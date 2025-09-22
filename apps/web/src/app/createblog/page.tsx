import "server-only";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CreateBlogClient } from "./client";

export const metadata: Metadata = {
  title: "MetaPress | Create Blog",
  description: "Create a blog on MetaPress",
};

export default async function CreateBlog() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/signin");
  }

  return <CreateBlogClient />;
}
