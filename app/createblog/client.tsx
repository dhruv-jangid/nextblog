"use client";

import {
  uploadImage,
  checkNudity,
  replaceImageSrcs,
  extractImagesFromContent,
} from "@/lib/imageUtils";
import pLimit from "p-limit";
import { ZodError } from "zod";
import { useState } from "react";
import { blogCategories } from "@/lib/utils";
import { titleFont } from "@/lib/static/fonts";
import { Button } from "@/components/ui/button";
import type { JSONContent } from "@tiptap/react";
import { createBlog } from "@/actions/handleBlog";
import { useToast } from "@/context/toastProvider";
import { RichTextEditor } from "@/components/editor";
import { getFirstZodError } from "@/lib/schemas/shared";
import { deleteImages } from "@/actions/handleCloudinary";
import { blogValidatorClient } from "@/lib/schemas/client";
import { isRedirectError } from "next/dist/client/components/redirect-error";

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
  const [characters, setCharacters] = useState(0);
  const { toast, success, error: errorToast } = useToast();

  const handleCreateBlog = async () => {
    setLoading(true);
    try {
      const { images, base64Urls } = extractImagesFromContent({
        content: blog.content,
      });

      toast({ title: "Checking..." });
      blogValidatorClient.parse({
        title: blog.title,
        content: blog.content,
        category: blog.category,
        images: images,
      });

      const { exists } = await (
        await fetch(`/api/checkTitle?title=${encodeURIComponent(blog.title)}`)
      ).json();
      if (exists) {
        throw new Error("Title already exists");
      }

      for (const image of images) {
        await checkNudity({ image });
      }

      toast({ title: "Uploading..." });
      const errorImages: string[] = [];
      const limit = pLimit(3);
      const imagesToUpload = images.map((image, index) =>
        limit(async () => {
          const { url, publicId } = await uploadImage({
            image,
            isUser: false,
          });
          errorImages.push(publicId);

          return {
            url,
            publicId,
            originalBase64: base64Urls[index],
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

      const uploadedImages = results.map(
        (r) =>
          (
            r as PromiseFulfilledResult<{
              url: string;
              publicId: string;
              originalBase64: string;
            }>
          ).value
      );

      const allImages = uploadedImages.map(({ url, publicId }) => ({
        url,
        publicId,
      }));

      const replacements = Object.fromEntries(
        uploadedImages.map(({ originalBase64, url }) => [originalBase64, url])
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
        disabled={loading || characters < 1000}
        onClick={handleCreateBlog}
      >
        {loading ? "Publishing..." : "Publish"}
      </Button>
    </div>
  );
};
