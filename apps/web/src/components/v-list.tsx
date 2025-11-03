"use client";

import Link from "next/link";
import Image from "next/image";
import { Author } from "./author";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { CornerDownRight } from "lucide-react";

export const VerticalList = ({ blogs }: { blogs: Blog[] }) => {
  return (
    <div className="[&>*:not(:last-child)]:border-b-2 [&>*:not(:last-child)]:border-dashed">
      {blogs.map(({ id, title, cover, createdAt, category, author }) => (
        <div
          key={id}
          className="px-4 md:px-8 lg:p-12 xl:px-0 py-8 lg:py-12 xl:py-16 lg:pr-8 flex gap-4 lg:gap-6"
        >
          <div className="aspect-3/4 lg:aspect-2/3 w-48 lg:w-64 relative max-w-sm">
            <Image
              src={cover}
              alt={title}
              priority
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover rounded-lg"
            />
          </div>

          <div className="inline-flex flex-col justify-between pt-2 pb-4 lg:pb-8">
            <div className="space-y-2 lg:space-y-3.5">
              <div className="inline-flex items-center gap-3 text-sm">
                <time>
                  {new Intl.DateTimeFormat("en-GB", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  }).format(new Date(createdAt))}
                </time>
                <Badge asChild>
                  <Link href={`/category/${category}`}>{category}</Link>
                </Badge>
              </div>

              <div className="text-3xl lg:text-4xl font-medium tracking-tighter text-balance line-clamp-3 truncate max-w-2xs md:max-w-xs">
                {title}
              </div>

              <Button className="mt-2 lg:mt-4" asChild>
                <Link href={`/${author.username}/${id}`}>
                  Discover <CornerDownRight />
                </Link>
              </Button>
            </div>

            <div className="mt-16 lg:mt-0">
              <Author
                image={author.image}
                name={author.name}
                username={author.username}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
