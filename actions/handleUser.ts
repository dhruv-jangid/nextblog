"use server";

import { deleteImage, deleteImages, uploadImage } from "@/lib/cloudinary";
import { auth, signOut } from "@/lib/auth";
import { getPublicIdFromUrl } from "@/lib/cloudinary";
import { prisma } from "@/lib/db";
import { permanentRedirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const changeProfileImg = async (image: File) => {
  const session = await auth();
  if (!session) {
    return { success: false, message: "User not authenticated" };
  }
  const { id } = session.user;

  const user = await prisma.user.findUnique({
    where: { id },
    select: { image: true },
  });

  if (!user) return { success: false, message: "User not found" };

  const publicId = user.image ? getPublicIdFromUrl(user.image, true) : null;
  if (publicId) {
    const result = await deleteImage(publicId);
    if (!result.success) {
      return { success: false, message: "Failed to delete image" };
    }
  }

  const imageUpload = await uploadImage(image, true);
  if (!imageUpload.success) {
    return { success: false, message: imageUpload.result };
  }

  const result = await prisma.user.update({
    where: { id },
    data: { image: imageUpload.result },
  });

  if (result) {
    revalidatePath(`/${session.user.slug}`);
    return { success: true, message: imageUpload.result };
  }

  return { success: false, message: "Failed to update image" };
};

export const removeProfileImg = async () => {
  const session = await auth();
  if (!session) {
    return { success: false, message: "User not authenticated" };
  }
  const { id } = session.user;

  const user = await prisma.user.findUnique({
    where: { id },
    select: { image: true },
  });

  if (!user) return { success: false, message: "User not found" };

  if (user.image) {
    const publicId = getPublicIdFromUrl(user.image, true);
    if (publicId) {
      const result = await deleteImage(publicId);
      if (!result.success) {
        return { success: false, message: "Failed to delete image" };
      }
    }
    await prisma.user.update({
      where: { id },
      data: { image: null },
    });

    revalidatePath(`/${session.user.slug}`);
    return { success: true, message: "Image deleted successfully" };
  }

  return { success: false, message: "No image to delete" };
};

export const changeSlug = async (prevState: any, formData: FormData) => {
  const session = await auth();
  if (!session) {
    return { success: false, message: "User not authenticated" };
  }
  const { id } = session.user;

  const slug = formData.get("slug") as string;

  if (slug === session.user.slug) {
    return {
      success: false,
      message: "New username is the same as the current one",
    };
  }

  const result = await prisma.user.update({
    where: { id },
    data: { slug },
  });

  if (result) {
    await signOut({ redirect: false });
    permanentRedirect("/signin");
  }

  return { success: false, message: "Failed to update username" };
};

export const changeName = async (name: string) => {
  const session = await auth();
  if (!session) {
    return { success: false, message: "User not authenticated" };
  }
  const { id } = session.user;

  if (name === session.user.name) {
    return {
      success: false,
      message: "New name is the same as the current one",
    };
  }

  const result = await prisma.user.update({
    where: { id },
    data: { name },
  });

  if (result) {
    return { success: true, message: "Name updated successfully" };
  }

  return { success: false, message: "Failed to update name" };
};

export const removeUser = async () => {
  const session = await auth();
  if (!session) {
    return "User not authenticated";
  }
  const { id } = session.user;

  try {
    await prisma.$transaction(async (tx) => {
      const [blogs, user] = await Promise.all([
        tx.blog.findMany({
          where: { authorId: id },
          select: { id: true, image: true },
        }),
        tx.user.findUnique({
          where: { id },
          select: { image: true },
        }),
      ]);

      const publicIds = blogs
        .map((blog) => blog.image && getPublicIdFromUrl(blog.image))
        .filter((id): id is string => Boolean(id));

      const userImagePublicId = user?.image
        ? getPublicIdFromUrl(user.image, true)
        : null;
      if (userImagePublicId) publicIds.push(userImagePublicId);

      await tx.user.delete({ where: { id } });

      if (publicIds.length > 0) {
        const deleteResult = await deleteImages(publicIds);
        if (!deleteResult.success) {
          throw new Error("Failed to delete images");
        }
      }
    });

    await signOut({ redirect: false });
  } catch (error) {
    console.error("Error deleting user:", error);
    return "Failed to delete account";
  }

  permanentRedirect("/signin");
};

export const newsletterSubscription = async (
  prevState: any,
  formData: FormData
) => {
  const email = formData.get("email") as string;
  if (!email) {
    return "Email is required";
  }

  return "Subscribed to newsletter";
};
