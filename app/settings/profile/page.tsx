import "server-only";
import { auth } from "@/lib/auth";
import { Profile } from "./client";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { titleFont } from "@/lib/static/fonts";

export const metadata: Metadata = {
  title: "MetaPress | Edit Profile",
  description: "Manage profile settings on MetaPress",
};

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div className="mx-auto py-16">
      <h1
        className={`${titleFont.className} text-3xl font-medium pb-10 text-end border-b w-full px-12 lg:px-64`}
      >
        Edit Profile
      </h1>
      <Profile user={session!.user} />
    </div>
  );
}
