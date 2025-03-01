"use server";

import { permanentRedirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const signOutCurrent = async () => {
  await auth.api.signOut({ headers: await headers() });

  permanentRedirect("/signin");
};
