"use server";

import "server-only";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { v2 as cloudinary } from "cloudinary";

const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
const api_key = process.env.CLOUDINARY_API_KEY;
const api_secret = process.env.CLOUDINARY_API_SECRET;
if (!cloud_name || !api_key || !api_secret) {
  throw new Error("Cloudinary ENVs required");
}

cloudinary.config({ cloud_name, api_key, api_secret });

export const getCloudinarySignature = async ({
  isUser,
}: {
  isUser: boolean;
}): Promise<{
  cloudName: string;
  apiKey: string;
  signature: string;
  timestamp: string;
  asset_folder: string;
  transformation: string;
}> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    const timestamp = String(Math.floor(Date.now() / 1000));
    const transformation = `${
      !isUser ? "g_auto" : "ar_1:1,g_faces"
    },f_webp,q_auto:low,c_auto`;
    const asset_folder = `metapress/${!isUser ? "blogs" : "users"}`;

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        asset_folder,
        transformation,
      },
      api_secret
    );

    return {
      cloudName: cloud_name,
      apiKey: api_key,
      timestamp,
      signature,
      asset_folder,
      transformation,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const deleteImage = async ({
  publicId,
}: {
  publicId: string;
}): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const deleteImages = async (publicIds: string[]) => {
  try {
    await cloudinary.api.delete_resources(publicIds, {
      invalidate: true,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
};
