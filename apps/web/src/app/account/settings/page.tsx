import "server-only";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { AccountClient } from "./client";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "MetaPress | Account Settings",
  description: "Manage account settings on MetaPress",
};

export default async function Account() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/signin");
  }

  return <AccountClient />;
}
