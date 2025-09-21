"use client";

import {
  CarouselItem,
  CarouselNext,
  CarouselContent,
  CarouselPrevious,
  Carousel as SCarousel,
} from "@/components/ui/carousel";
import Link from "next/link";
import Image from "next/image";
import { Author } from "./author";
import { Button } from "./ui/button";
import Autoplay from "embla-carousel-autoplay";
import { titleFont } from "@/lib/static/fonts";

export const Carousel = ({ blogs }: { blogs: Blog[] }) => {
  return (
    <SCarousel
      opts={{ align: "center", loop: true }}
      plugins={[Autoplay({ delay: 5000 })]}
    >
      <CarouselContent>
        {blogs.map(({ title, image, createdAt, category, user, slug }) => {
          return (
            <CarouselItem
              key={slug}
              className="flex flex-col lg:flex-row overflow-hidden h-[92dvh]"
            >
              <div className="relative h-full lg:w-3/5 xl:w-2/5">
                <Image
                  src={image!}
                  alt={title!}
                  priority
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col max-h-fit lg:self-end gap-3 m-6 lg:ml-12 lg:mb-10">
                <div className="flex items-center gap-4">
                  <time>
                    {new Intl.DateTimeFormat("en-GB", {
                      month: "long",
                      day: "2-digit",
                      year: "numeric",
                    }).format(new Date(createdAt!))}
                  </time>
                  <Link href={`/blogs/${category}`}>
                    <Button variant="outline" className="tracking-tight">
                      {category}
                    </Button>
                  </Link>
                </div>
                <div className="flex flex-col gap-4 lg:gap-6 lg:w-2/3 text-balance">
                  <Link
                    href={`/${user!.username}/${slug}`}
                    className={`${titleFont.className} text-4xl lg:text-6xl text-balance underline-hover hover:animate-pulse line-clamp-3 leading-tight lg:leading-16`}
                  >
                    {title}
                  </Link>
                  <Author
                    image={user!.image}
                    name={user!.name!}
                    username={user!.username!}
                  />
                </div>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="absolute top-1/2 left-4" />
      <CarouselNext className="absolute top-1/2 right-4" />
    </SCarousel>
  );
};
