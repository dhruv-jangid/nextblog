"use client";

import {
  checkNudity,
  uploadImage,
  getPublicIdFromImageUrl,
} from "@/lib/image-utils";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";
import { toast } from "sonner";
import { ZodError } from "zod";
import { ImageUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { getFirstZodError } from "@/lib/schemas/other";
import { imageClientSchema } from "@/lib/schemas/blog";
import { updateUserCache } from "@/actions/handle-cache";
import { deleteImage } from "@/actions/handle-cloudinary";

export const ProfileImage = ({
  imageUrl,
  isUser,
}: {
  imageUrl: string | null | undefined;
  isUser: boolean;
}) => {
  const router = useRouter();

  const updateImage = async (
    e: React.ChangeEvent<HTMLInputElement> | false
  ) => {
    const fileInput = document.getElementById(
      "fileInput"
    ) as HTMLInputElement | null;

    let toastIds: (string | number)[] = [];
    try {
      if (!e) {
        toastIds.push(toast.loading("Removing..."));
        const { error } = await authClient.updateUser({ image: null });
        if (error) {
          throw new Error(error.message);
        }

        toast.success("Removed");
      } else {
        const image = e.target.files?.[0];
        if (image) {
          imageClientSchema.parse(image);

          toastIds.push(toast.loading("Checking..."));
          await checkNudity({ image });

          toastIds.push(toast.loading("Uploading..."));
          const { url } = await uploadImage({ image, isUser });

          const { error } = await authClient.updateUser({ image: url });
          if (error) {
            throw new Error(error.message);
          }
        }
      }

      await updateUserCache();

      if (imageUrl && imageUrl.includes("cloudinary")) {
        const publicId = getPublicIdFromImageUrl({
          url: imageUrl,
          isUser: true,
        });
        await deleteImage({ publicId });
      }

      router.refresh();
      toast.success("Profile updated");
    } catch (error) {
      if (error instanceof ZodError) {
        toast.info(getFirstZodError(error));
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      if (fileInput) {
        fileInput.value = "";
      }
      for (const t of toastIds) {
        toast.dismiss(t);
      }
    }
  };

  return (
    <div className="flex flex-col">
      <div className="relative h-30 w-30 lg:h-36 lg:w-36">
        <Image
          src={imageUrl || "/images/account.png"}
          fill
          alt="Profile Image"
          className="outline rounded-full shadow-2xl"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {isUser && (
          <Dialog>
            <DialogTrigger className="text-sm opacity-70 underline cursor-pointer">
              <ImageUp
                className="absolute top-2 right-2 fill-accent cursor-pointer hover:animate-pulse opacity-85"
                size={22}
              />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Options</DialogTitle>
                <DialogDescription>Update your profile photo</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-2 mt-2.5">
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => updateImage(e)}
                />
                <Button
                  variant="secondary"
                  onClick={() => document.getElementById("fileInput")?.click()}
                >
                  Upload Image
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => updateImage(false)}
                  disabled={!imageUrl}
                >
                  Remove Current Image
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};
