"use client";

import { CldImage } from "next-cloudinary";
import { useRouter } from "next/navigation";
import type { BlogWithAuthor } from "@/app/createblog/page";

export const Author: React.FC<
  Pick<BlogWithAuthor["author"], "slug" | "name"> & {
    publicId: string;
    date: Date;
  }
> = ({ publicId, name, slug, date }) => {
  const router = useRouter();

  return (
    <div
      className="flex gap-2 items-center justify-end text-end"
      onClick={(e) => {
        e.stopPropagation();
        router.push(`/${slug}`);
      }}
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-white font-semibold leading-none">{name}</h3>
        <h6 className="text-gray-300 leading-none">
          {new Date(date).toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })}
        </h6>
      </div>
      <CldImage
        src={`nextblog/authors/${publicId}`}
        alt={name}
        width={42}
        height={42}
        priority={true}
        className="rounded-full"
      />
    </div>
  );
};
