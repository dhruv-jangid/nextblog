"use client";

import pLimit from "p-limit";
import { useState } from "react";
import { ZodError } from "zod/v4";
import { titleFont } from "@/lib/static/fonts";
import { blogCategories } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { JSONContent } from "@tiptap/react";
import { createBlog } from "@/actions/handleBlog";
import { useToast } from "@/context/toastProvider";
import { RichTextEditor } from "@/components/editor";
import { getFirstZodError } from "@/lib/schemas/shared";
import { blogValidatorClient } from "@/lib/schemas/client";
import { getCloudinarySignature } from "@/actions/handleCloudinary";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { extractImagesFromContent, replaceImageSrcs } from "@/lib/imageUtils";

export const CreateBlogClient = () => {
  const [blog, setBlog] = useState<{
    title: string;
    content: JSONContent;
    category: string;
  }>({
    title: "",
    content: {},
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast, success, error: errorToast } = useToast();

  return (
    <>
      <select
        id="category"
        onChange={(e) => setBlog({ ...blog, category: e.currentTarget.value })}
        className="leading-tight px-3.5 py-2.5 border-b cursor-pointer focus:outline-none"
        value={blog.category}
      >
        <option value="" disabled>
          Category
        </option>
        {blogCategories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <textarea
        id="title"
        onChange={(e) => setBlog({ ...blog, title: e.currentTarget.value })}
        placeholder="Title (10-100 characters)"
        maxLength={100}
        className={`${titleFont.className} min-h-48 text-xl md:text-3xl lg:text-5xl font-medium px-6 py-5 resize-none border-b focus:outline-none`}
        autoFocus
        required
      />

      <RichTextEditor
        content={blog.content}
        readOnly={false}
        onChange={(content) => setBlog({ ...blog, content })}
      />

      <Button
        className="rounded-none py-5 text-base"
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          try {
            const { images, base64Urls } = extractImagesFromContent({
              content: blog.content,
            });

            blogValidatorClient.parse({
              title: blog.title,
              content: blog.content,
              category: blog.category,
              images: images,
            });

            const { exists } = await (
              await fetch(
                `/api/checkTitle?title=${encodeURIComponent(blog.title)}`
              )
            ).json();
            if (exists) {
              throw new Error("Title already exists");
            }

            toast({ title: "Uploading..." });
            const limit = pLimit(3);
            const imagesToUpload: Promise<{
              url: string;
              publicId: string;
              originalBase64: string;
            }>[] = images.map((image, index) =>
              limit(async () => {
                const {
                  cloudName,
                  apiKey,
                  timestamp,
                  asset_folder,
                  transformation,
                  signature,
                } = await getCloudinarySignature({ isUser: false });

                const formData = new FormData();
                formData.append("file", image);
                formData.append("api_key", apiKey);
                formData.append("timestamp", timestamp);
                formData.append("asset_folder", asset_folder);
                formData.append("transformation", transformation);
                formData.append("signature", signature);

                const result = await fetch(
                  `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                  {
                    method: "POST",
                    body: formData,
                  }
                );
                const { secure_url, public_id } = await result.json();

                return {
                  url: secure_url,
                  publicId: public_id,
                  originalBase64: base64Urls[index],
                };
              })
            );
            const uploadedImages = await Promise.all(imagesToUpload);

            const allImages = uploadedImages.map(({ url, publicId }) => ({
              url,
              publicId,
            }));

            const replacements = Object.fromEntries(
              uploadedImages.map(({ originalBase64, url }) => [
                originalBase64,
                url,
              ])
            );
            const updatedContent = replaceImageSrcs({
              content: blog.content,
              replacements,
            });

            await createBlog({
              title: blog.title,
              content: updatedContent,
              category: blog.category,
              image: allImages[0].url,
              images: allImages,
            });
          } catch (error) {
            if (error instanceof ZodError) {
              errorToast({ title: getFirstZodError(error) });
            } else if (isRedirectError(error)) {
              success({ title: "Published" });
            } else if (error instanceof Error) {
              errorToast({ title: error.message });
            } else {
              errorToast({ title: "Something went wrong" });
            }
          } finally {
            setLoading(false);
          }
        }}
      >
        {loading ? "Publishing..." : "Publish"}
      </Button>
    </>
  );
};
