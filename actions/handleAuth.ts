"use server";

import { permanentRedirect } from "next/navigation";
import argon2 from "argon2";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { deleteImages, uploadImage } from "@/lib/handleImage";
import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";
import { auth } from "@/lib/auth";
import { getPublicIdFromUrl } from "@/lib/handleImage";

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
    userImg: z
      .instanceof(File, { message: "Profile image is required" })
      .refine(
        (file) => file.size <= 5 * 1024 * 1024,
        "User image must be less than 5MB"
      )
      .refine(
        (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
        "Only JPEG, PNG, and WEBP formats are allowed"
      ),
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

  const { slug, password, email, userImg } = parsedData.data;
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { slug }] },
  });
  if (existingUser) return "Email or username already taken";

  const hashedPassword = await argon2.hash(password);
  const imageUrl = await uploadImage(userImg, true);

  await prisma.user.create({
    data: {
      slug,
      name: slug,
      image: imageUrl,
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
  await signIn("google", { redirectTo: "/" });
};

export const githubAuth = async () => {
  await signIn("github", { redirectTo: "/" });
};

export const currentSignout = async () => {
  await signOut({ redirect: false });
  permanentRedirect("/signin");
};

export const removeUser = async (): Promise<string> => {
  const session = await auth();
  const id = session?.user.id;

  if (!id) {
    return "User not authenticated";
  }

  try {
    await prisma.$transaction(async (tx) => {
      const [blogs, user] = await Promise.all([
        tx.blog.findMany({
          where: { authorId: id },
          select: { id: true, image: true },
        }),
        tx.user.findUnique({
          where: { id },
          select: { image: true },
        }),
      ]);

      const publicIds = blogs.map(
        (blog) => blog.image && getPublicIdFromUrl(blog.image)
      );

      const userImagePublicId = getPublicIdFromUrl(user.image, true);
      if (userImagePublicId) publicIds.push(userImagePublicId);

      await tx.user.delete({ where: { id } });

      if (publicIds.length > 0) {
        const deleteResult = await deleteImages(publicIds);
        if (!deleteResult.success) {
          throw new Error("Failed to delete images");
        }
      }
    });

    await signOut({ redirect: false });
    return "Account deleted successfully";
  } catch (error) {
    console.error("Error deleting user:", error);
    return "Failed to delete account";
  }
};
