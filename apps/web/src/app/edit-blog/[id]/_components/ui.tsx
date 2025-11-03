"use client";

import {
  extractImages,
  extractImageUrls,
  replaceImageUrls,
} from "@/lib/content/utils";
import {
  Drawer,
  DrawerClose,
  DrawerTitle,
  DrawerHeader,
  DrawerFooter,
  DrawerContent,
  DrawerTrigger,
  DrawerDescription,
} from "@/components/ui/drawer";
import Link from "next/link";
import pLimit from "p-limit";
import { toast } from "sonner";
import { ZodError } from "zod";
import { useState } from "react";
import { getFirstZodError } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/combobox";
import { Textarea } from "@/components/ui/textarea";
import { editBlog } from "@/core/blog/blog.actions";
import { extractPublicId } from "@/lib/image/utils";
import { Fullscreen, Upload, X } from "lucide-react";
import { checkNudity } from "@/lib/image/check-nudity";
import { uploadImage } from "@/lib/image/upload-image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { deleteImages } from "@/core/image/image.actions";
import { ContentEditor } from "@/components/content-editor";
import { ContentViewer } from "@/components/content-viewer";
import { blogCategories } from "@/shared/blog/blog.constants";
import { editBlogClientSchema } from "@/shared/blog/blog.schema";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export const EditBlogUI = ({ oldBlog }: { oldBlog: Blog }) => {
  const [blog, setBlog] = useState<{
    title: string;
    content: BlogContent;
    category: string;
  }>({
    title: oldBlog.title,
    content: oldBlog.content,
    category: oldBlog.category,
  });
  const [loading, setLoading] = useState(false);

  const handleEditBlog = async () => {
    setLoading(true);
    let toastIds: (string | number)[] = [];
    try {
      const { images: newImages, base64Urls: newBase64Urls } = extractImages(
        blog.content
      );

      const existingImageUrls = extractImageUrls(blog.content);

      const imagesToKeep = existingImageUrls.map((url) => ({
        url,
        publicId: extractPublicId(url),
      }));

      const oldImageUrls = extractImageUrls(oldBlog.content);

      const imagesToDelete = oldImageUrls
        .filter((url) => !existingImageUrls.includes(url))
        .map((url) => extractPublicId(url));

      console.log(imagesToKeep);

      editBlogClientSchema.parse({
        title: blog.title,
        content: blog.content,
        category: blog.category,
        newImages: newImages,
        imagesToKeep: imagesToKeep,
      });

      toastIds.push(toast.loading("Checking..."));
      newImages.forEach(async (image) => await checkNudity(image));

      toastIds.push(toast.loading("Updating..."));
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
            const { url, publicId } = await uploadImage(image, false);
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

      const finalContent = replaceImageUrls(blog.content, {
        ...existingReplacements,
        ...uploadReplacements,
      });

      await editBlog({
        blogId: oldBlog.id,
        title: blog.title,
        content: finalContent,
        category: blog.category,
        cover: finalImages[0].url,
        images: finalImages,
        imagesToDelete,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        toast.info(getFirstZodError(error));
      } else if (isRedirectError(error)) {
        toast.success("Updated");
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
      toastIds.forEach((t) => toast.dismiss(t));
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
        className="resize-none min-h-32 max-w-4/5 text-6xl md:text-6xl p-5"
        disabled={loading}
        autoFocus
        required
      />

      <div className="space-x-4">
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
          loading={loading}
        />
      </div>

      <ContentEditor
        content={blog.content}
        onChange={(content) => setBlog({ ...blog, content })}
        loading={loading}
      />

      <div className="self-end">
        <Link href="/" className="mr-1.5">
          <Button variant="destructive" size="lg">
            Cancel <X />
          </Button>
        </Link>
        <Drawer dismissible={!loading}>
          <DrawerTrigger asChild>
            <Button
              size="lg"
              disabled={loading || !blog.category || !blog.title}
            >
              Preview <Fullscreen />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{blog.title}</DrawerTitle>
              <DrawerDescription>{blog.category}</DrawerDescription>
            </DrawerHeader>
            <ScrollArea className="flex flex-col h-[50dvh] lg:gap-12 w-11/12 lg:w-5/12 mx-auto cursor-text">
              <ContentViewer content={blog.content} />
            </ScrollArea>
            <DrawerFooter>
              <Button
                size="lg"
                disabled={loading || !blog.category || !blog.title}
                onClick={handleEditBlog}
              >
                {loading ? (
                  "Updating..."
                ) : (
                  <>
                    Update <Upload />
                  </>
                )}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" disabled={loading}>
                  Edit Again
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};
