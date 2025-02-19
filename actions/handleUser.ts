"use server";

import { deleteImages } from "@/utils/cloudinaryUtils";
import { auth, signOut } from "@/lib/auth";
import { getPublicIdFromUrl } from "@/utils/cloudinaryUtils";
import { prisma } from "@/lib/db";
import { permanentRedirect } from "next/navigation";

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
