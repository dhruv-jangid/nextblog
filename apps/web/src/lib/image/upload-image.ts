import { ZodError } from "zod";
import { getFirstZodError } from "../utils";
import { imageClientSchema } from "@/shared/blog/blog.schema";
import { getImageSignature } from "@/core/image/image.actions";

export const uploadImage = async (
  image: File,
  isUser: boolean
): Promise<{ url: string; publicId: string }> => {
  try {
    imageClientSchema.parse(image);

    const {
      cloudName,
      apiKey,
      timestamp,
      signature,
      asset_folder,
      transformation,
    } = await getImageSignature({ isUser });

    const formData = new FormData();
    formData.append("file", image);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("asset_folder", asset_folder);
    formData.append("transformation", transformation);

    const result = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const { error, secure_url, public_id } = await result.json();
    if (error) {
      throw new Error("Invalid Image");
    }

    return { url: secure_url, publicId: public_id };
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(getFirstZodError(error));
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
};
