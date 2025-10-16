"use client";

import Link from "next/link";
import Image from "next/image";
import { Author } from "./author";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { CornerDownRight } from "lucide-react";

export const VerticalList = ({ blogs }: { blogs: Blog[] }) => {
  return (
    <div className="flex flex-col [&>*:not(:last-child)]:border-b">
      {blogs.map(({ title, image, createdAt, category, user, slug }) => (
        <div
          key={slug}
          className="px-4 md:px-8 lg:p-12 xl:px-0 py-8 lg:py-12 xl:py-16 lg:pr-8 flex gap-4 lg:gap-6"
        >
          <div className="aspect-[3/4] lg:aspect-[2/3] w-48 lg:w-64 relative max-w-sm">
            <Image
              src={image!}
              alt={title!}
              priority
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover rounded-lg"
            />
          </div>

          <div className="flex flex-col justify-between pt-2 pb-4 lg:pb-8">
            <div className="space-y-2 lg:space-y-3.5">
              <div className="flex items-center gap-3 text-sm">
                <time>
                  {new Intl.DateTimeFormat("en-GB", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  }).format(new Date(createdAt!))}
                </time>
                <Badge asChild>
                  <Link href={`/blogs/${category}`}>{category}</Link>
                </Badge>
              </div>

              <div className="text-3xl lg:text-4xl font-medium tracking-tighter text-balance line-clamp-3 truncate max-w-2xs md:max-w-xs">
                {title}
              </div>

              <Button className="w-fit mt-2 lg:mt-4" asChild>
                <Link href={`/${user!.username}/${slug}`}>
                  Discover <CornerDownRight />
                </Link>
              </Button>
            </div>

            <div className="mt-16 lg:mt-0">
              <Author
                image={user!.image ? user!.image : undefined}
                name={user!.name!}
                username={user!.username!}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
