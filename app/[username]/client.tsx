"use client";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { ZodError } from "zod/v4";
import { ImageUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Account from "@/public/images/account.png";
import { useToast } from "@/context/toastProvider";
import { getFirstZodError } from "@/lib/schemas/shared";
import { imageValidatorClient } from "@/lib/schemas/client";
import { getCloudinarySignature } from "@/actions/handleCloudinary";
import { changeProfileImage, removeProfileImage } from "@/actions/handleUser";

export default function UsernameClient({
  imageUrl,
  isUser,
}: {
  imageUrl: string | null;
  isUser: boolean;
}) {
  const { toast, success, error: errorToast } = useToast();

  return (
    <div className="flex flex-col">
      <div className="relative h-30 w-30 lg:h-36 lg:w-36">
        <Image
          src={imageUrl || Account}
          fill
          alt="Profile Image"
          quality={100}
          className="outline rounded-2xl shadow-2xl"
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
              </DialogHeader>
              <div className="flex flex-col gap-2 mt-2.5">
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const image = e.target.files?.[0];
                    if (image) {
                      toast({ title: "Uploading..." });
                      try {
                        imageValidatorClient.parse(image);

                        const {
                          cloudName,
                          apiKey,
                          timestamp,
                          signature,
                          asset_folder,
                          transformation,
                        } = await getCloudinarySignature({ isUser: true });

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
                        const { secure_url } = await result.json();

                        await changeProfileImage({ newImage: secure_url });
                        success({ title: "Profile updated" });
                      } catch (error) {
                        if (error instanceof ZodError) {
                          errorToast({ title: getFirstZodError(error) });
                        } else if (error instanceof Error) {
                          errorToast({ title: error.message });
                        } else {
                          errorToast({ title: "Something went wrong" });
                        }
                      }
                    }
                  }}
                />
                <Button
                  onClick={() => document.getElementById("fileInput")?.click()}
                >
                  Upload Image
                </Button>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    if (imageUrl) {
                      toast({ title: "Removing..." });
                      try {
                        await removeProfileImage();
                        toast({ title: "Profile updated" });
                      } catch (error) {
                        if (error instanceof Error) {
                          errorToast({ title: error.message });
                        } else {
                          errorToast({ title: "Something went wrong" });
                        }
                      }
                    } else {
                      errorToast({ title: "No current profile image" });
                    }
                  }}
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
}
