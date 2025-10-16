import "server-only";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { ProfileClient } from "./client";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "MetaPress | Edit Profile",
  description: "Manage profile settings on MetaPress",
};

export default async function Profile() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/signin");
  }

  return <ProfileClient user={session.user} />;
}
