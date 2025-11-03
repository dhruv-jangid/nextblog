"use client";

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
import pLimit from "p-limit";
import { toast } from "sonner";
import { ZodError } from "zod";
import { useState } from "react";
import { getFirstZodError } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/combobox";
import { Fullscreen, Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { createBlog } from "@/core/blog/blog.actions";
import { checkNudity } from "@/lib/image/check-nudity";
import { uploadImage } from "@/lib/image/upload-image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { deleteImages } from "@/core/image/image.actions";
import { ContentEditor } from "@/components/content-editor";
import { ContentViewer } from "@/components/content-viewer";
import { blogCategories } from "@/shared/blog/blog.constants";
import { createBlogClientSchema } from "@/shared/blog/blog.schema";
import { extractImages, replaceImageUrls } from "@/lib/content/utils";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export const CreateBlogUI = () => {
  const [blog, setBlog] = useState<{
    title: string;
    content: BlogContent;
    category: string;
  }>({
    title: "",
    content: {},
    category: "",
  });
  const [loading, setLoading] = useState(false);

  const handleCreateBlog = async () => {
    setLoading(true);

    let toastIds: (string | number)[] = [];
    try {
      const { images, base64Urls } = extractImages(blog.content);

      createBlogClientSchema.parse({
        title: blog.title,
        content: blog.content,
        category: blog.category,
        images: images,
      });

      toastIds.push(toast.loading("Checking..."));
      images.forEach(async (image) => await checkNudity(image));

      toastIds.push(toast.loading("Uploading..."));
      const errorImages: string[] = [];
      const limit = pLimit(3);
      const imagesToUpload = images.map((image, index) =>
        limit(async () => {
          const { url, publicId } = await uploadImage(image, false);
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
          deleteImages(errorImages);
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
      const updatedContent = replaceImageUrls(blog.content, replacements);

      await createBlog({
        title: blog.title,
        content: updatedContent,
        category: blog.category,
        cover: allImages[0].url,
        images: allImages,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        toast.info(getFirstZodError(error));
      } else if (isRedirectError(error)) {
        toast.success("Published");
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
      for (const t of toastIds) {
        toast.dismiss(t);
      }
    }
  };

  return (
    <div className="mx-auto space-y-8 w-11/12 lg:w-5/12 my-14 lg:my-24">
      <Textarea
        placeholder="Title (10-100 characters)"
        onChange={(e) =>
          setBlog((prev) => ({ ...prev, title: e.target.value }))
        }
        minLength={10}
        maxLength={100}
        className="resize-none min-h-32 max-w-4/5 text-6xl md:text-6xl p-5"
        disabled={loading}
        autoFocus
        required
      />

      <div className="space-x-4">
        <time>
          {new Intl.DateTimeFormat("en-GB", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }).format(new Date(Date.now()))}
        </time>
        <Combobox
          value={blog.category}
          setValue={(category) => setBlog((prev) => ({ ...prev, category }))}
          array={blogCategories}
          placeholder="Category"
          loading={loading}
        />
      </div>

      <ContentEditor
        content={blog.content}
        onChange={(content) => setBlog((prev) => ({ ...prev, content }))}
        loading={loading}
      />

      <Drawer dismissible={!loading}>
        <DrawerTrigger asChild>
          <Button
            size="lg"
            className="-mt-4"
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
              onClick={handleCreateBlog}
            >
              {loading ? (
                "Publishing..."
              ) : (
                <>
                  Publish
                  <Upload />
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
  );
};
