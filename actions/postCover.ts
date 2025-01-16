import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const postCover = async (blogCover: File, publicId: string) => {
  try {
    const fileBuffer = Buffer.from(await blogCover.arrayBuffer());
    const readableStream = Readable.from(fileBuffer);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "nextblog/blogs",
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
