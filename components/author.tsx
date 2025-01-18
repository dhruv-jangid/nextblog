import Link from "next/link";
import type { BlogWithAuthor } from "@/app/createblog/page";
import { CloudImage } from "@/components/cloudimage";

export const Author: React.FC<
  Pick<BlogWithAuthor["author"], "slug" | "name"> & {
    publicId: string;
    date: Date;
    end?: boolean;
  }
> = ({ publicId, name, slug, date, end }) => {
  return (
    <Link href={`/${slug}`}>
      <div
        className={`flex gap-2 items-center cursor-pointer ${
          end ? "justify-end text-end" : "justify-start text-start"
        }`}
      >
        {!end && (
          <CloudImage
            publicId={publicId}
            alt={name}
            width={44}
            height={44}
            priority={true}
            className="rounded-full"
            author
          />
        )}
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
        {end && (
          <CloudImage
            publicId={publicId}
            alt={name}
            width={44}
            height={44}
            priority={true}
            className="rounded-full bg-red-500"
            author
          />
        )}
      </div>
    </Link>
  );
};
