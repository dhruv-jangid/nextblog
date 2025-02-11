import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (
  image: File,
  isAuthor: boolean = false
): Promise<string> => {
  try {
    const fileBuffer = Buffer.from(await image.arrayBuffer());
    const readableStream = Readable.from(fileBuffer);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: !isAuthor ? "nextblog/blogs" : "nextblog/authors",
          allowed_formats: ["jpeg", "png", "webp"],
          format: "webp",
          invalidate: true,
          transformation: !isAuthor
            ? [{ aspect_ratio: "16:9", crop: "fill", gravity: "center" }]
            : [
                {
                  width: 300,
                  height: 300,
                  aspect_ratio: "1:1",
                  crop: "fill",
                  gravity: "face:auto",
                },
              ],
        },
        (error, result) => {
          if (error) {
            reject(new Error("Upload Failed: " + error.message));
            return;
          }
          if (!result) {
            reject(
              new Error("Upload failed: No result returned from Cloudinary")
            );
            return;
          }
          resolve(result.secure_url);
        }
      );

      readableStream.pipe(uploadStream);
    });
  } catch (error) {
    throw new Error("Upload failed: " + error);
  }
};

export const deleteImage = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });
    return { success: true, message: "Cover deleted successfully" };
  } catch (error) {
    console.error("Error deleting cover:", error);
    return { success: false, message: "Failed to delete cover" };
  }
};

export const deleteImages = async (publicIds: string[]) => {
  try {
    await cloudinary.api.delete_resources(publicIds, {
      invalidate: true,
    });
    return { success: true, message: "Images deleted successfully" };
  } catch (error) {
    console.error("Error deleting images:", error);
    return { success: false, message: "Failed to delete images" };
  }
};

export const getPublicIdFromUrl = (url: string, isAuthor: boolean = false) => {
  const regex = /\/upload\/v\d+\/(.+?)\.\w+$/;
  const match = url.match(regex);
  let publicId = match ? match[1] : null;

  if (publicId && isAuthor) {
    const parts = publicId.split("/");
    if (parts[0] === "nextblog" && parts.length > 2) {
      parts[1] = "authors";
      publicId = parts.join("/");
    }
  }

  return publicId;
};
