import "server-only";
import type { Metadata } from "next";
import { CreateBlogClient } from "./client";

export const metadata: Metadata = {
  title: "MetaPress | Create Blog",
  description: "Create a blog on MetaPress",
};

export default function CreateBlog() {
  return (
    <div className="flex flex-col tracking-tight mx-auto lg:w-5/12 lg:border-l lg:border-r">
      <CreateBlogClient />
    </div>
  );
}
