import * as nsfwjs from "nsfwjs";
import { ZodError } from "zod/v4";
import * as tf from "@tensorflow/tfjs";
import type { JSONContent } from "@tiptap/react";
import { getFirstZodError } from "@/lib/schemas/shared";
import { imageValidatorClient } from "@/lib/schemas/client";
import { getCloudinarySignature } from "@/actions/handleCloudinary";

let nsfwModel: nsfwjs.NSFWJS | null = null;
if (process.env.NODE_ENV === "production") {
  tf.enableProdMode();
}

export const uploadImage = async ({
  image,
  isUser,
}: {
  image: File;
  isUser: boolean;
}): Promise<{ url: string; publicId: string }> => {
  try {
    imageValidatorClient.parse(image);

    const {
      cloudName,
      apiKey,
      timestamp,
      signature,
      asset_folder,
      transformation,
    } = await getCloudinarySignature({ isUser });

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
export const checkNudity = async ({
  image,
}: {
  image: File;
}): Promise<void> => {
  try {
    if (!nsfwModel) {
      nsfwModel = await nsfwjs.load("/models/mobilenet_v2/model.json");
    }

    const img = document.createElement("img");
    img.src = URL.createObjectURL(image);

    await new Promise((resolve) => {
      img.onload = () => resolve(true);
    });

    const predictions = await nsfwModel.classify(img);

    const rawScore =
      predictions.find((p) => p.className === "Porn")?.probability ?? 0;
    const sexyScore =
      predictions.find((p) => p.className === "Sexy")?.probability ?? 0;

    if (rawScore >= 0.6 || sexyScore >= 0.6) {
      throw new Error("Inappropriate image");
    }

    URL.revokeObjectURL(img.src);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
};

export const getPublicIdFromImageUrl = ({
  url,
  isUser = false,
}: {
  url: string;
  isUser: boolean;
}): string => {
  const regex = /\/upload\/v\d+\/(.+?)\.\w+$/;
  const match = url.match(regex);
  let publicId = match![1];

  if (isUser) {
    const parts = publicId.split("/");
    if (parts[0] === "nextblog" && parts.length > 2) {
      parts[1] = "authors";
      publicId = parts.join("/");
    }
  }

  return publicId;
};

export const replaceImageSrcs = ({
  content,
  replacements,
}: {
  content: JSONContent;
  replacements: Record<string, string>;
}): JSONContent => {
  const safeContent = JSON.parse(JSON.stringify(content));

  const processNode = (node: JSONContent): JSONContent => {
    if (!node || typeof node !== "object") {
      return node;
    }

    if (
      node.type === "image" &&
      node.attrs?.src &&
      typeof node.attrs.src === "string" &&
      replacements[node.attrs.src]
    ) {
      return {
        ...node,
        attrs: {
          ...node.attrs,
          src: replacements[node.attrs.src],
        },
      };
    }

    if (node.content && Array.isArray(node.content)) {
      return {
        ...node,
        content: node.content.map((child) => processNode(child)),
      };
    }

    return node;
  };

  return processNode(safeContent);
};

const base64ToFile = ({
  base64,
  filename,
}: {
  base64: string;
  filename: string;
}): File => {
  const [header, data] = base64.split(",");
  const mime = header.match(/:(.*?);/)?.[1] || "image/jpeg";
  const binaryString = atob(data);
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return new File([bytes], filename, { type: mime });
};
export const extractImagesFromContent = ({
  content,
}: {
  content: JSONContent;
}): { images: File[]; base64Urls: string[] } => {
  const images: File[] = [];
  const base64Urls: string[] = [];
  const processedUrls = new Set<string>();
  let imageCounter = 0;

  const processNode = (node: JSONContent) => {
    if (!node || typeof node !== "object") return;

    if (
      node.type === "image" &&
      node.attrs?.src &&
      typeof node.attrs.src === "string" &&
      node.attrs.src.startsWith("data:image/") &&
      !processedUrls.has(node.attrs.src)
    ) {
      try {
        const mimeType = node.attrs.src.split(";")[0].split("/")[1] || "jpeg";
        const filename = `image-${++imageCounter}-${Date.now()}.${mimeType}`;

        const file = base64ToFile({ base64: node.attrs.src, filename });
        images.push(file);
        base64Urls.push(node.attrs.src);
        processedUrls.add(node.attrs.src);
      } catch (error) {
        console.warn("Failed to process image:", error);
      }
    }

    if (Array.isArray(node.content)) {
      node.content.forEach(processNode);
    }
  };

  processNode(content);
  return { images, base64Urls };
};

const isCloudinaryUrl = ({ url }: { url: string }): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.endsWith("cloudinary.com");
  } catch {
    return false;
  }
};
export const extractImageUrlsFromContent = ({
  content,
}: {
  content: JSONContent;
}): string[] => {
  const cloudinaryUrls: string[] = [];
  const processedUrls = new Set<string>();

  const processNode = (node: JSONContent) => {
    if (!node || typeof node !== "object") return;

    if (
      node.type === "image" &&
      node.attrs?.src &&
      typeof node.attrs.src === "string" &&
      isCloudinaryUrl({ url: node.attrs.src }) &&
      !processedUrls.has(node.attrs.src)
    ) {
      cloudinaryUrls.push(node.attrs.src);
      processedUrls.add(node.attrs.src);
    }

    if (Array.isArray(node.content)) {
      node.content.forEach(processNode);
    }
  };

  processNode(content);
  return cloudinaryUrls;
};
