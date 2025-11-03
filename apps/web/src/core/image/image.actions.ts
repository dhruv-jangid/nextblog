"use server";

import "server-only";
import { ImageService } from "./image.service";
import { AuthService } from "../auth/auth.service";

export const getImageSignature = async (data: GetImageSignatureInput) => {
  const session = await AuthService.getUserSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    const asset_folder = `metapress/${!data.isUser ? "blogs" : "users"}`;
    const timestamp = String(Math.floor(Date.now() / 1000));
    const transformation = `${
      !data.isUser ? "g_auto" : "ar_1:1,g_faces"
    },f_webp,q_auto:low,c_auto`;

    return await ImageService.getSignature({
      ...data,
      asset_folder,
      timestamp,
      transformation,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const deleteImage = async (publicId: string) => {
  const session = await AuthService.getUserSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    await ImageService.delete(publicId);
  } catch {}
};

export const deleteImages = async (publicIds: string[]) => {
  const session = await AuthService.getUserSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    await ImageService.deleteMany(publicIds);
  } catch {}
};
