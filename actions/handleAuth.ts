"use server";

import { permanentRedirect, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { APIError } from "better-auth/api";
import { checkProfanity } from "@/utils/checkProfanity";
import { ZodError } from "zod";
import { passwordValidator } from "@/utils/zod";

export const socialAuth = async (provider: "google" | "github") => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    permanentRedirect("/");
  }

  const result = await auth.api.signInSocial({
    body: {
      provider,
      disableRedirect: true,
      errorCallbackURL: "/signin",
    },
  });

  if (result.url) {
    redirect(result.url);
  }

  return "Something went wrong!";
};

export const credentialSignIn = async (email: string, password: string) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    permanentRedirect("/");
  }

  let done = false;

  try {
    const result = await auth.api.signInEmail({ body: { email, password } });

    if (result) {
      done = true;
    }
  } catch (error) {
    if (error instanceof APIError) {
      return error.message;
    }

    return "Something went wrong!";
  }

  if (done) {
    permanentRedirect("/");
  }

  return "Something went wrong!";
};

export const credentialSignUp = async (
  slug: string,
  email: string,
  password: string
) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    permanentRedirect("/");
  }

  if (checkProfanity(slug)) {
    return "Inappropriate language!";
  }

  const checkPassword = passwordValidator.safeParse(password);
  if (!checkPassword.success) {
    return checkPassword.error.format()._errors[0];
  }

  try {
    await auth.api.signUpEmail({
      body: { name: slug, email, password, slug },
    });

    return "Verification email sent to your gmail inbox!";
  } catch (error) {
    if (error instanceof APIError) {
      switch (error.body?.code) {
        case "FAILED_TO_CREATE_USER":
          return "Username not available";
        case "USER_ALREADY_EXISTS":
          return "Email already registered";
        default:
          return error.message;
      }
    }

    if (error instanceof ZodError) {
      return error.errors[0].message;
    }

    return "Something went wrong!";
  }
};

export const forgetPassword = async (email: string) => {
  try {
    await auth.api.forgetPassword({
      body: { email, redirectTo: "/resetpassword" },
    });

    return "If an account exists with this email, you will receive an password reset link!";
  } catch (error) {
    if (error instanceof APIError) {
      if (error.body?.code === "VALIDATION_ERROR") return "Invalid email";
      return error.message;
    }

    return "Something went wrong!";
  }
};

export const resetPassword = async (newPassword: string, token: string) => {
  let done = false;

  try {
    const { status } = await auth.api.resetPassword({
      body: { newPassword, token },
    });

    if (status) {
      done = true;
    }
  } catch (error) {
    if (error instanceof APIError) {
      return error.message;
    }

    return "Something went wrong!";
  }

  if (done) {
    return permanentRedirect("/signin");
  }

  return "Something went wrong!";
};

export const signOutCurrent = async () => {
  await auth.api.signOut({ headers: await headers() });

  permanentRedirect("/signin");
};
