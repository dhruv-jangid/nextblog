"use server";

import { permanentRedirect } from "next/navigation";
import argon2 from "argon2";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";

const signUpSchema = z
  .object({
    slug: z
      .string()
      .min(3, "Username must have at least 3 characters")
      .max(20, "Username must be less than 20 characters")
      .regex(
        /^[a-z][a-z0-9_.]*$/,
        "Must start with lowercase letter and contain only a-z, 0-9, . and _"
      ),
    email: z.string().email("Invalid email format"),
    password: z
      .string()
      .min(8, "Password must have at least 8 characters")
      .max(32, "Password must be less than 32 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).*$/,
        "Must contain 1 uppercase, 1 lowercase, and 1 special character"
      )
      .refine((pass) => !pass.includes(" "), "Cannot contain spaces"),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  });

export const credentialsSignin = async (prevState, formData: FormData) => {
  const data = Object.fromEntries(formData.entries());
  const { email, password } = data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid Credentials";
        default:
          return "Something went wrong!";
      }
    }
    throw error;
  }

  permanentRedirect("/");
};

export const credentialsSignup = async (prevState, formData: FormData) => {
  const data = Object.fromEntries(formData.entries());
  const parsedData = signUpSchema.safeParse(data);
  if (!parsedData.success) {
    return parsedData.error.errors.map((err) => err.message).join("<br>");
  }

  const { slug, password, email } = parsedData.data;
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { slug }] },
  });
  if (existingUser) return "Email or username already taken";

  const hashedPassword = await argon2.hash(password);

  await prisma.user.create({
    data: {
      slug,
      name: slug,
      password: hashedPassword,
      email,
      accounts: {
        create: {
          type: "credentials",
          provider: "credentials",
          providerAccountId: slug,
        },
      },
    },
  });

  permanentRedirect("/signin");
};

export const googleAuth = async () => {
  await signIn("google");
  return null;
};

export const githubAuth = async () => {
  await signIn("github");
  return null;
};

export const signOutCurrent = async () => {
  await signOut({ redirect: false });

  permanentRedirect("/signin");
};
