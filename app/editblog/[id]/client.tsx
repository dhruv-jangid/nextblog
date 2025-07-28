"use client";

import {
  uploadImage,
  checkNudity,
  replaceImageSrcs,
  extractImagesFromContent,
  extractImageUrlsFromContent,
} from "@/lib/imageUtils";
import pLimit from "p-limit";
import { useState } from "react";
import { ZodError } from "zod/v4";
import { blogCategories } from "@/lib/utils";
import { titleFont } from "@/lib/static/fonts";
import { Button } from "@/components/ui/button";
import { editBlog } from "@/actions/handleBlog";
import type { JSONContent } from "@tiptap/react";
import { useToast } from "@/context/toastProvider";
import { RichTextEditor } from "@/components/editor";
import { getFirstZodError } from "@/lib/schemas/shared";
import { deleteImages } from "@/actions/handleCloudinary";
import { editBlogValidatorClient } from "@/lib/schemas/client";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export const EditBlogClient = ({
  blogId,
  blogSlug,
  oldTitle,
  oldContent,
  oldCategory,
  oldImages,
}: {
  blogId: string;
  blogSlug: string;
  oldTitle: string;
  oldContent: JSONContent;
  oldCategory: string;
  oldImages: { url: string; publicId: string }[];
}) => {
  const [blog, setBlog] = useState<{
    title: string;
    content: JSONContent;
    category: string;
  }>({
    title: oldTitle,
    content: oldContent,
    category: oldCategory,
  });
  const [loading, setLoading] = useState(false);
  const [characters, setCharacters] = useState(0);
  const { toast, success, error: errorToast } = useToast();

  const handleEditBlog = async () => {
    setLoading(true);
    try {
      const { images: newImages, base64Urls: newBase64Urls } =
        extractImagesFromContent({
          content: blog.content,
        });

      const existingImageUrls = extractImageUrlsFromContent({
        content: blog.content,
      });

      const imagesToKeep = oldImages.filter((img) =>
        existingImageUrls.includes(img.url)
      );

      const imagesToDelete = oldImages
        .filter((img) => !existingImageUrls.includes(img.url))
        .map((img) => img.publicId);

      toast({ title: "Checking..." });
      editBlogValidatorClient.parse({
        title: blog.title,
        content: blog.content,
        category: blog.category,
        newImages: newImages,
        imagesToKeep: imagesToKeep,
      });

      if (oldTitle !== blog.title) {
        const { exists } = await (
          await fetch(`/api/checkTitle?title=${encodeURIComponent(blog.title)}`)
        ).json();
        if (exists) {
          throw new Error("Title already exists");
        }
      }

      for (const image of newImages) {
        await checkNudity({ image });
      }

      toast({ title: "Uploading..." });
      let uploadedImages: {
        url: string;
        publicId: string;
        originalBase64: string;
      }[] = [];
      const errorImages: string[] = [];
      if (newImages.length > 0) {
        const limit = pLimit(3);
        const imagesToUpload: Promise<{
          url: string;
          publicId: string;
          originalBase64: string;
        }>[] = newImages.map((image, index) =>
          limit(async () => {
            const { url, publicId } = await uploadImage({
              image,
              isUser: false,
            });
            errorImages.push(publicId);

            return {
              url,
              publicId,
              originalBase64: newBase64Urls[index],
            };
          })
        );
        const results = await Promise.allSettled(imagesToUpload);

        const failed = results.find((r) => r.status === "rejected");
        if (failed) {
          if (errorImages.length > 0) {
            await deleteImages(errorImages);
          }
          throw new Error("Invalid Image(s)");
        }

        uploadedImages = results.map(
          (r) =>
            (
              r as PromiseFulfilledResult<{
                url: string;
                publicId: string;
                originalBase64: string;
              }>
            ).value
        );
      }

      const finalImages = [
        ...imagesToKeep,
        ...uploadedImages.map(({ url, publicId }) => ({ url, publicId })),
      ];

      const existingReplacements = Object.fromEntries(
        imagesToKeep.map((img) => [img.url, img.url])
      );

      const uploadReplacements =
        uploadedImages.length > 0
          ? Object.fromEntries(
              uploadedImages.map(({ originalBase64, url }) => [
                originalBase64,
                url,
              ])
            )
          : {};

      const finalContent = replaceImageSrcs({
        content: blog.content,
        replacements: {
          ...existingReplacements,
          ...uploadReplacements,
        },
      });

      await editBlog({
        blogId,
        blogSlug,
        title: blog.title,
        content: finalContent,
        category: blog.category,
        image: finalImages[0].url,
        images: finalImages,
        imagesToDelete,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        errorToast({ title: getFirstZodError(error) });
      } else if (isRedirectError(error)) {
        success({ title: "Updated" });
      } else if (error instanceof Error) {
        errorToast({ title: error.message });
      } else {
        errorToast({ title: "Something went wrong" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col tracking-tight mx-auto lg:w-5/12 lg:border-l lg:border-r">
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
        value={blog.title}
        autoFocus
        required
      />

      <RichTextEditor
        content={blog.content}
        readOnly={false}
        onChange={(content) => setBlog({ ...blog, content })}
        onCharactersChange={(characters) => setCharacters(characters)}
      />

      <span className="place-self-end mr-6 mb-4 text-muted-foreground">
        {characters}
      </span>

      <Button
        className="rounded-none py-5 text-base"
        disabled={
          loading ||
          characters < 1000 ||
          (oldContent === blog.content &&
            oldTitle === blog.title &&
            oldCategory === blog.category)
        }
        onClick={handleEditBlog}
      >
        {loading ? "Updating..." : "Update"}
      </Button>
    </div>
  );
};
