"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageUp } from "lucide-react";
import { changeProfileImg, removeProfileImg } from "@/actions/handleUser";
import Account from "@/public/images/account.png";

export default function ProfileImg({
  imageUrl,
  isAuthor,
}: {
  imageUrl: string | null;
  isAuthor: boolean;
}) {
  const [isEditingImage, setIsEditingImage] = useState(false);

  return (
    <div className="flex flex-col gap-16 justify-center lg:flex-row items-center lg:text-base">
      {isEditingImage && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-75 flex justify-center items-center z-50">
          <div className="flex flex-col text-center items-center rounded-4xl bg-neutral-950 overflow-hidden ring ring-neutral-800">
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                if (file) {
                  setIsEditingImage(false);
                  await changeProfileImg(file);
                }
              }}
            />
            <button
              className="w-full p-3 px-6 cursor-pointer hover:bg-rose-300 hover:text-neutral-950 border-b border-neutral-800 transition-all duration-200"
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              Upload Image
            </button>
            <button
              type="submit"
              className="cursor-pointer w-full p-3 px-6 hover:bg-rose-300 hover:text-neutral-950 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={async () => {
                setIsEditingImage(false);
                await removeProfileImg();
              }}
              disabled={!imageUrl}
            >
              Remove Current Photo
            </button>
            <div
              className="w-full p-3 px-6 cursor-pointer hover:bg-rose-300 hover:text-neutral-950 border-t border-neutral-800 transition-all duration-200"
              onClick={() => {
                setIsEditingImage(false);
              }}
            >
              Cancel
            </div>
          </div>
        </div>
      )}
      <div className="relative h-30 w-30 lg:h-36 lg:w-36">
        <Image
          src={imageUrl || Account}
          fill={true}
          alt="Profile Image"
          quality={100}
          className="rounded-full"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {isAuthor && (
          <ImageUp
            className="absolute top-2 right-2 text-rose-300 cursor-pointer hover:animate-bounce"
            onClick={() => setIsEditingImage(true)}
          />
        )}
      </div>
    </div>
  );
}
