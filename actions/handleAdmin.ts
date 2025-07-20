"use server";

import "server-only";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { APIError } from "better-auth/api";

export const deleteUserByAdmin = async (body: {
  userId: string;
}): Promise<void> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  try {
    await auth.api.removeUser({ body, headers: await headers() });
  } catch (error) {
    if (error instanceof APIError || error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Something went wrong");
  }
};
