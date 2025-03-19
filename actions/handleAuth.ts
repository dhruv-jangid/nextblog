"use server";

import { permanentRedirect, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { APIError } from "better-auth/api";
import { checkProfanity } from "@/utils/checkProfanity";
import { generateSlug } from "@/utils/generateSlug";

export const socialSignIn = async (provider: "google" | "github") => {
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
  let done: boolean = false;

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
  name: string,
  email: string,
  password: string
) => {
  if (checkProfanity(name)) {
    return "Inappropriate language!";
  }

  try {
    const result = await auth.api.signUpEmail({
      body: { name, email, password, slug: generateSlug(name) },
    });

    if (result) return "Verification email sent to your gmail inbox!";

    return "Something went wrong!";
  } catch (error) {
    if (error instanceof APIError) {
      return error.message;
    }

    return "Something went wrong!";
  }
};

export const signOutCurrent = async () => {
  await auth.api.signOut({ headers: await headers() });

  permanentRedirect("/signin");
};
