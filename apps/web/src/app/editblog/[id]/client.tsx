"use client";

import {
  checkNudity,
  uploadImage,
  replaceImageSrcs,
  extractImagesFromContent,
  extractImageUrlsFromContent,
} from "@/lib/imageUtils";
import pLimit from "p-limit";
import { ZodError } from "zod";
import { useState } from "react";
import { blogCategories } from "@/lib/utils";
import { cn } from "@/lib/static/shadcnUtils";
import { titleFont } from "@/lib/static/fonts";
import { Button } from "@/components/ui/button";
import { editBlog } from "@/actions/handleBlog";
import { Combobox } from "@/components/combobox";
import type { JSONContent } from "@tiptap/react";
import type { BlogType } from "@/lib/static/types";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/editor";
import { getFirstZodError } from "@/lib/schemas/shared";
import { deleteImages } from "@/actions/handleCloudinary";
import { editBlogValidatorClient } from "@/lib/schemas/client";
import { useToast } from "@/components/providers/toastProvider";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export const EditBlogClient = ({
  oldBlog,
}: {
  oldBlog: BlogType & {
    content: JSONContent;
    images: Array<{ url: string; publicId: string }>;
  };
}) => {
  const [blog, setBlog] = useState<{
    title: string;
    content: JSONContent;
    category: string;
  }>({
    title: oldBlog.title,
    content: oldBlog.content,
    category: oldBlog.category,
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

      const imagesToKeep = oldBlog.images.filter((img) =>
        existingImageUrls.includes(img.url)
      );

      const imagesToDelete = oldBlog.images
        .filter((img) => !existingImageUrls.includes(img.url))
        .map((img) => img.publicId);

      editBlogValidatorClient.parse({
        title: blog.title,
        content: blog.content,
        category: blog.category,
        newImages: newImages,
        imagesToKeep: imagesToKeep,
      });

      if (oldBlog.title !== blog.title) {
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

      toast({ title: "Updating..." });
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
        blogId: oldBlog.id,
        blogSlug: oldBlog.slug,
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
    <div className="flex flex-col mx-auto gap-8 lg:gap-12 lg:w-5/12 my-12 lg:my-22">
      <Textarea
        id="title"
        value={blog.title}
        onChange={(e) => setBlog({ ...blog, title: e.currentTarget.value })}
        placeholder="Title (10-100 characters)"
        maxLength={100}
        className={cn(
          titleFont.className,
          "resize-none min-h-32 max-w-4/5 text-6xl md:text-6xl p-5"
        )}
        autoFocus
        required
      />

      <div className="flex items-center gap-4">
        <time>
          {new Intl.DateTimeFormat("en-GB", {
            month: "long",
            day: "2-digit",
            year: "numeric",
          }).format(new Date(oldBlog.createdAt))}
        </time>
        <Combobox
          array={blogCategories}
          placeholder="Category"
          value={blog.category}
          setValue={(category) => setBlog({ ...blog, category })}
        />
      </div>

      <RichTextEditor
        content={blog.content}
        readOnly={false}
        onChange={(content) => setBlog({ ...blog, content })}
        onCharactersChange={(characters) => setCharacters(characters)}
      />

      <span className="place-self-end mr-0.5 -mt-8 -mb-6 text-muted-foreground">
        {characters} / 1,000 (50,000)
      </span>

      <Button
        size="lg"
        className="self-end"
        disabled={loading}
        onClick={handleEditBlog}
      >
        {loading ? "Updating..." : "Update"}
      </Button>
    </div>
  );
};
