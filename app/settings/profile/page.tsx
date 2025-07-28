import "server-only";
import { auth } from "@/lib/auth";
import { Profile } from "./client";
import type { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "MetaPress | Edit Profile",
  description: "Manage profile settings on MetaPress",
};

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  return <Profile user={session!.user} />;
}
