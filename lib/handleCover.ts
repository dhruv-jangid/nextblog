import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadCover = async (
  image: File,
  publicId: string,
  isAuthor: boolean = false
) => {
  try {
    const fileBuffer = Buffer.from(await image.arrayBuffer());
    const readableStream = Readable.from(fileBuffer);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: !isAuthor ? "nextblog/blogs" : "nextblog/authors",
          public_id: publicId,
        },
        (error, result) => {
          if (error) {
            reject(new Error("Upload Failed: " + error.message));
          }
          resolve(result);
        }
      );

      readableStream.pipe(uploadStream);
    });
  } catch (error) {
    throw new Error("Upload failed: " + error);
  }
};

export const deleteCover = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      invalidate: true,
      type: "authenticated",
    });
    return { success: true, message: "Cover deleted successfully" };
  } catch (error) {
    console.error("Error deleting cover:", error);
    return { success: false, message: "Failed to delete cover" };
  }
};
