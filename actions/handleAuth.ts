"use server";

import "server-only";
import {
  emailValidator,
  getFirstZodError,
  passwordValidator,
  credentialsValidator,
} from "@/lib/schemas/shared";
import { ZodError } from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { APIError } from "better-auth/api";

export const socialAuth = async ({
  provider,
}: {
  provider: "google" | "github";
}): Promise<void> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    throw new Error("Already signed in");
  }

  let redirectUrl: string | undefined;
  try {
    const { url } = await auth.api.signInSocial({
      body: {
        provider,
        disableRedirect: true,
        errorCallbackURL: "/signin",
      },
    });
    redirectUrl = url;
  } catch (error) {
    if (error instanceof APIError || error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }

  if (redirectUrl) {
    redirect(redirectUrl);
  }

  throw new Error("Something went wrong");
};

export const credentialSignIn = async (body: {
  email: string;
  password: string;
  rememberMe: boolean;
}): Promise<void> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    throw new Error("Already signed in");
  }

  try {
    emailValidator.parse(body.email);

    await auth.api.signInEmail({ body });
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(getFirstZodError(error));
    } else if (error instanceof APIError || error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }

  redirect("/");
};

export const credentialSignUp = async (credentials: {
  name: string;
  username: string;
  email: string;
  password: string;
}): Promise<void> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    throw new Error("Already signed in");
  }

  try {
    const body = credentialsValidator.parse(credentials);

    await auth.api.signUpEmail({ body });
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(getFirstZodError(error));
    } else if (error instanceof APIError) {
      switch (error.body?.code) {
        case "USERNAME_IS_ALREADY_TAKEN_PLEASE_TRY_ANOTHER":
          throw new Error("Username is already taken");
        case "USER_ALREADY_EXISTS":
          throw new Error("Email already registered");
        default:
          throw new Error(error.message);
      }
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const forgetPassword = async ({
  email,
}: {
  email: string;
}): Promise<void> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    throw new Error("Already signed in");
  }

  try {
    emailValidator.parse(email);

    await auth.api.forgetPassword({
      body: { email, redirectTo: "/resetpassword" },
      headers: await headers(),
    });
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(getFirstZodError(error));
    } else if (error instanceof APIError || error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const resetPassword = async (body: {
  newPassword: string;
  token: string;
}): Promise<void> => {
  try {
    passwordValidator.parse(body.newPassword);

    await auth.api.resetPassword({ body });
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(getFirstZodError(error));
    } else if (error instanceof APIError || error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }

  redirect("/signin");
};

export const signOutCurrent = async (): Promise<void> => {
  try {
    await auth.api.signOut({ headers: await headers() });
  } catch (error) {
    if (error instanceof APIError || error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }

  redirect("/signin");
};
