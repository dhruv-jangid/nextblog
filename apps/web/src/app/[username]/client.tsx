"use client";

import {
  uploadImage,
  checkNudity,
  getPublicIdFromImageUrl,
} from "@/lib/imageUtils";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import Image from "next/image";
import { ZodError } from "zod";
import { useRouter } from "next/navigation";
import { titleFont } from "@/lib/static/fonts";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { BlogGrid } from "@/components/bloggrid";
import { updateUserCache } from "@/actions/handleCache";
import { getFirstZodError } from "@/lib/schemas/shared";
import { deleteImage } from "@/actions/handleCloudinary";
import { imageValidatorClient } from "@/lib/schemas/client";
import type { BlogType, UserType } from "@/lib/static/types";
import { ImageUp, SquareArrowOutUpRight } from "lucide-react";
import { useToast } from "@/components/providers/toastProvider";

export const ProfileClient = ({
  userRow,
  actualBlogs,
  isSelf,
  isSelfAdmin,
}: {
  userRow: UserType;
  actualBlogs: BlogType[];
  isSelf: boolean;
  isSelfAdmin: boolean;
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col gap-16 justify-center lg:flex-row items-center lg:text-base">
        <div className="flex lg:justify-center gap-8 xl:gap-12 w-full py-22 pb-18">
          <div className="h-30 w-30 lg:h-36 lg:w-36">
            <ProfileImg imageUrl={userRow.image} isUser={isSelf} />
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex gap-1.5 items-center">
              <h1 className={`${titleFont.className} text-3xl mr-2`}>
                {userRow.username}
              </h1>
              {isSelf && (
                <Link href="/settings/profile" className="hidden md:block">
                  <Button variant="secondary">Edit Profile</Button>
                </Link>
              )}
              {isSelfAdmin && (
                <Link href={`/admin/dashboard`} className="hidden md:block">
                  <Button variant="secondary">
                    <span className="flex items-center gap-1.5">
                      Dashboard <SquareArrowOutUpRight />
                    </span>
                  </Button>
                </Link>
              )}
            </div>

            <div className="flex items-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                {actualBlogs.length}
                <span className="text-muted-foreground">Blogs</span>
              </div>
              <div className="flex items-center gap-2">
                {userRow.totalLikes}
                <span className="text-muted-foreground">Likes</span>
              </div>
            </div>

            <div className="flex gap-2 items-center text-lg opacity-85">
              {userRow.name}
              {userRow.role === "admin" && (
                <span className="text-lg text-red-500">
                  ({userRow.role.toUpperCase()})
                </span>
              )}
            </div>
            <div className="flex gap-1.5">
              {isSelf && (
                <Link href="/settings?tab=profile" className="md:hidden">
                  <Button>Edit Profile</Button>
                </Link>
              )}
              {isSelfAdmin && (
                <Link href={`/admin/dashboard`} className="md:hidden">
                  <Button>
                    Dashboard <SquareArrowOutUpRight />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {actualBlogs.length > 0 ? (
        <BlogGrid blogs={actualBlogs} />
      ) : (
        <div
          className={`${titleFont.className} flex justify-center items-center min-h-[59vh] text-4xl w-full border-t text-muted-foreground`}
        >
          This user has no published blogs!
        </div>
      )}
    </div>
  );
};

export const ProfileImg = ({
  imageUrl,
  isUser,
}: {
  imageUrl: string | null;
  isUser: boolean;
}) => {
  const router = useRouter();
  const { toast, success, error: errorToast } = useToast();

  const updateImage = async (
    e: React.ChangeEvent<HTMLInputElement> | false
  ) => {
    const fileInput = document.getElementById(
      "fileInput"
    ) as HTMLInputElement | null;

    try {
      if (!e) {
        toast({ title: "Removing..." });
        const { error } = await authClient.updateUser({ image: null });
        if (error) {
          throw new Error(error.message);
        }
      } else {
        const image = e.target.files?.[0];
        if (image) {
          imageValidatorClient.parse(image);

          toast({ title: "Checking..." });
          await checkNudity({ image });

          toast({ title: "Uploading..." });
          const { url } = await uploadImage({
            image,
            isUser: true,
          });

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
      success({ title: "Profile updated" });
    } catch (error) {
      if (error instanceof ZodError) {
        errorToast({ title: getFirstZodError(error) });
      } else if (error instanceof Error) {
        errorToast({ title: error.message });
      } else {
        errorToast({ title: "Something went wrong" });
      }
    } finally {
      if (fileInput) {
        fileInput.value = "";
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
