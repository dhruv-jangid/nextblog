"use client";

import {
  Carousel,
  CarouselItem,
  CarouselContent,
} from "@/components/ui/carousel";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";

export const HorizontalList = ({
  data,
  imageOnly = false,
}: {
  data: { image: string; tag?: string; title: string; content?: string }[];
  imageOnly?: boolean;
}) => {
  return (
    <Carousel
      opts={{ align: "start", loop: true }}
      plugins={[Autoplay({ delay: 2000, stopOnInteraction: false })]}
      className="md:max-w-md lg:max-w-2xl xl:max-w-5xl 2xl:max-w-full px-4 xl:p-0"
    >
      <CarouselContent>
        {data.map(({ image, title, tag, content }, i) => (
          <CarouselItem
            key={i}
            className={cn(
              imageOnly
                ? "basis-1/2 md:basis-[calc(1/2.5*100%)] xl:basis-[calc(1/3.5*100%)] 2xl:basis-1/5"
                : "xl:basis-1/2 2xl:basis-5/12",
              "flex cursor-default select-none xl:pl-16"
            )}
          >
            <Image
              src={image}
              alt={title}
              width={280}
              height={342}
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover rounded-lg aspect-2/3 border w-40 md:w-52 sepia-50 brightness-90"
            />
            <div
              className={cn(
                imageOnly ? "hidden" : "flex",
                "flex-col justify-between pt-2 xl:pt-4 pl-3 xl:pl-6 md:gap-16"
              )}
            >
              <div className="space-y-1">
                <div className="text-xs md:text-sm tracking-tight font-medium">
                  {tag}
                </div>
                <div className="text-2xl md:text-3xl xl:text-4xl font-medium tracking-tighter">
                  {title}
                </div>
                <div className="mt-4 text-sm text-balance max-w-2xs leading-tight">
                  {content}
                </div>
              </div>
              <div className="text-8xl xl:text-9xl -mb-3.5 md:-mb-4">
                {i + 1}
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};
