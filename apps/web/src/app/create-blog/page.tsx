import "server-only";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CreateBlogUI } from "./_components/ui";
import { AuthService } from "@/core/auth/auth.service";

export const metadata: Metadata = {
  title: "Create Blog",
  description: "Create a blog on MetaPress",
};

export default async function CreateBlog() {
  const session = await AuthService.getUserSession();
  if (!session) {
    redirect("/signin");
  }

  return <CreateBlogUI />;
}
