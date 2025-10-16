"use client";

import {
  checkNudity,
  uploadImage,
  replaceImageSrcs,
  extractImagesFromContent,
  extractImageUrlsFromContent,
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
import Link from "next/link";
import pLimit from "p-limit";
import { toast } from "sonner";
import { ZodError } from "zod";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Editor } from "@/components/editor";
import { blogCategories } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { editBlog } from "@/actions/handle-blog";
import { Combobox } from "@/components/combobox";
import { Textarea } from "@/components/ui/textarea";
import { Fullscreen, Upload, X } from "lucide-react";
import { getFirstZodError } from "@/lib/schemas/other";
import { ScrollArea } from "@/components/ui/scroll-area";
import { editBlogClientSchema } from "@/lib/schemas/blog";
import { deleteImages } from "@/actions/handle-cloudinary";

export const EditBlogClient = ({
  oldBlog,
  username,
}: {
  oldBlog: Blog & {
    images: Array<{ url: string; publicId: string }>;
  };
  username: string;
}) => {
  const [blog, setBlog] = useState<{
    title: string;
    content: BlogContent;
    category: string;
  }>({
    title: oldBlog.title!,
    content: oldBlog.content!,
    category: oldBlog.category!,
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [characters, setCharacters] = useState(0);

  const handleEditBlog = async () => {
    setLoading(true);

    let toastIds: (string | number)[] = [];
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

      editBlogClientSchema.parse({
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

      toastIds.push(toast.loading("Checking..."));
      for (const image of newImages) {
        await checkNudity({ image });
      }

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

      const slug = await editBlog({
        blogId: oldBlog.id!,
        blogSlug: oldBlog.slug!,
        title: blog.title,
        content: finalContent,
        category: blog.category,
        image: finalImages[0].url,
        images: finalImages,
        imagesToDelete,
      });
      router.replace(`/${username}/${slug}`);
      toast.success("Updated");
    } catch (error) {
      if (error instanceof ZodError) {
        toast.info(getFirstZodError(error));
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
        value={blog.title}
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
          }).format(new Date(oldBlog.createdAt!))}
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
        onChange={(content: BlogContent) => setBlog({ ...blog, content })}
        onCharactersChange={(characters: number) => setCharacters(characters)}
        loading={loading}
      />

      <span className="place-self-end mr-0.5 -mt-8 -mb-6 text-muted-foreground">
        {characters} / 1,000 (50,000)
      </span>

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
