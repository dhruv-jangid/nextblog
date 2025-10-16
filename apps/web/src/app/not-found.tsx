"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-dvh w-full overflow-hidden">
      <div className="h-1/4 grid grid-cols-3 w-full ml-8 items-end">
        {Array.from({ length: 6 }).map((_, i) => {
          return (
            <span
              key={i}
              className="tracking-tight text-sm text-muted-foreground"
            >
              NOT FOUND
            </span>
          );
        })}
      </div>
      <div className="h-full">
        <div className="text-8xl w-fit ml-12 lg:ml-32 xl:ml-48 leading-20 font-medium">
          <div className="tracking-tighter">NOT</div>
          <div className="tracking-tighter">FOUND</div>
        </div>
        <div className="text-end text-[14rem] xl:text-[28rem] leading-64 text-input -mr-4 tracking-tighter">
          404
        </div>
        <div className="text-2xl lg:text-xl xl:text-5xl text-muted-foreground mt-14">
          YOU DIDN&apos;T DESTROY ANY INJECTION MOULDS, BUT IT LOOKS LIKE
          YOU&apos;RE LOST. DON&apos;T WORRY. YOU CAN HEAD OVER TO THE{" "}
          <Link
            href="/"
            className="underline text-foreground underline-offset-4"
          >
            HOMEPAGE
          </Link>{" "}
          OR TO THE{" "}
          <Link
            href="/contact"
            className="underline text-foreground underline-offset-4"
          >
            CONTACT
          </Link>{" "}
          PAGE IF YOU HAVEN&apos;T HAD ENOUGH. A LAB EXPERIMENT IN, FOR SURE.
        </div>
      </div>
    </div>
  );
}
