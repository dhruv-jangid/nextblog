import "server-only";
import { v2 as cloudinary } from "cloudinary";

const cloud_name = process.env.CLOUDINARY_CLOUD_NAME!;
const api_key = process.env.CLOUDINARY_API_KEY!;
const api_secret = process.env.CLOUDINARY_API_SECRET!;

cloudinary.config({ cloud_name, api_key, api_secret });

export class ImageService {
  static async getSignature(data: GetImageSignature) {
    const signature = cloudinary.utils.api_sign_request(
      {
        asset_folder: data.asset_folder,
        timestamp: data.timestamp,
        transformation: data.transformation,
      },
      api_secret
    );

    return {
      cloudName: cloud_name,
      apiKey: api_key,
      timestamp: data.timestamp,
      signature,
      asset_folder: data.asset_folder,
      transformation: data.transformation,
    };
  }

  static async delete(publicId: DeleteImage) {
    await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });
  }

  static async deleteMany(publicIds: DeleteManyImages) {
    await cloudinary.api.delete_resources(publicIds, {
      invalidate: true,
    });
  }
}
