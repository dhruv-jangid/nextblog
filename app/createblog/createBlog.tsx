"use server";
// Server action (place at top of file, outside component)
export const createBlog = async (formData: FormData) => {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  // Add to your database (example using prisma)
  const blog = await prisma.blog.create({
    data: {
      title,
      content,
      imageUrl: "", // We'll update this after Cloudinary upload
    },
  });

  return blog.id; // Return the blog ID for redirect
};
