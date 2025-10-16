"use client";

import {
  checkNudity,
  uploadImage,
  replaceImageSrcs,
  extractImagesFromContent,
} from "@/lib/image-utils";
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
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Editor } from "@/components/editor";
import { blogCategories } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/combobox";
import { Fullscreen, Upload } from "lucide-react";
import { createBlog } from "@/actions/handle-blog";
import { Textarea } from "@/components/ui/textarea";
import { getFirstZodError } from "@/lib/schemas/other";
import { ScrollArea } from "@/components/ui/scroll-area";
import { deleteImages } from "@/actions/handle-cloudinary";
import { createBlogClientSchema } from "@/lib/schemas/blog";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export const CreateBlogClient = () => {
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
  const [characters, setCharacters] = useState(0);

  const handleCreateBlog = async () => {
    setLoading(true);

    let toastIds: (string | number)[] = [];
    try {
      const { images, base64Urls } = extractImagesFromContent({
        content: blog.content,
      });

      createBlogClientSchema.parse({
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

      toastIds.push(toast.loading("Checking..."));
      for (const image of images) {
        await checkNudity({ image });
      }

      toastIds.push(toast.loading("Uploading..."));
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
    <div className="flex flex-col mx-auto gap-8 lg:gap-12 lg:w-5/12 my-12 lg:my-22">
      <Textarea
        id="title"
        onChange={(e) => setBlog({ ...blog, title: e.currentTarget.value })}
        placeholder="Title (10-100 characters)"
        maxLength={100}
        className="resize-none min-h-32 max-w-4/5 text-6xl md:text-6xl p-5"
        disabled={loading}
        autoFocus
        required
      />

      <div className="flex items-center gap-4">
        <time>
          {new Intl.DateTimeFormat("en-GB", {
            month: "long",
            day: "2-digit",
            year: "numeric",
          }).format(new Date(Date.now()))}
        </time>
        <Combobox
          array={blogCategories}
          placeholder="Category"
          value={blog.category}
          setValue={(category) => setBlog({ ...blog, category })}
          loading={loading}
        />
      </div>

      <Editor
        content={blog.content}
        readOnly={false}
        onChange={(content) => setBlog({ ...blog, content })}
        onCharactersChange={(characters) => setCharacters(characters)}
        loading={loading}
      />

      <span className="place-self-end mr-0.5 -mt-8 -mb-6 text-muted-foreground">
        {characters} / 1,000 (50,000)
      </span>

      <Drawer dismissible={!loading}>
        <DrawerTrigger asChild>
          <Button
            size="lg"
            className="self-end"
            disabled={
              loading || characters < 1000 || !blog.category || !blog.title
            }
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
            <Editor content={blog.content} readOnly />
          </ScrollArea>
          <DrawerFooter>
            <Button
              size="lg"
              disabled={
                loading || characters < 1000 || !blog.category || !blog.title
              }
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
