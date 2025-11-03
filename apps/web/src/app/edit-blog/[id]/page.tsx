import "server-only";
import type { Metadata } from "next";
import { EditBlogUI } from "./_components/ui";
import { notFound, redirect } from "next/navigation";
import { AuthService } from "@/core/auth/auth.service";
import { BlogService } from "@/core/blog/blog.service";

export const metadata: Metadata = {
  title: "MetaPress | Edit Blog",
  description: "Edit blog on MetaPress",
};

export default async function EditBlog({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await AuthService.getUserSession();
  if (!session) {
    redirect("/signin");
  }

  const { id } = await params;

  const blogService = new BlogService(session);
  const blog = await blogService.find(id);
  if (!blog) {
    notFound();
  }

  return <EditBlogUI oldBlog={blog} />;
}
