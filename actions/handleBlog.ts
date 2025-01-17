"use server";

import { prisma } from "@/lib/db";
import { uploadCover } from "@/lib/uploadCover";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const createBlog = async (prevState, formData) => {
  const user_id = (await cookies()).get("metapress")?.value;
  const { title, blogCover, content, category } = formData;

  const slug = title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");

  const existingBlog = await prisma.blog.findUnique({
    where: { slug },
  });

  if (existingBlog) {
    return "Title already taken, please choose a different title.";
  }

  const newBlog = await prisma.blog.create({
    data: {
      title,
      slug,
      content,
      category,
      authorId: user_id,
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: user_id },
    select: { slug: true },
  });

  try {
    await uploadCover(
      blogCover,
      `${newBlog.id}_${newBlog.category}_${user.slug}`
    );

    redirect(`/blogs/${user.slug}/${newBlog.slug}`);
  } catch (error) {
    console.error("Image upload failed: ", error);

    return "Error uploading cover image.";
  }
};
