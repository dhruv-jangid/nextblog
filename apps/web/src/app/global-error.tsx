"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="dark h-dvh w-full overflow-hidden">
        <div className="h-1/4 grid grid-cols-3 w-full ml-8 items-end">
          {Array.from({ length: 6 }).map((_, i) => {
            return (
              <span
                key={i}
                className="tracking-tight text-sm text-muted-foreground"
              >
                ERROR
              </span>
            );
          })}
        </div>

        <div className="h-full">
          <div className="text-9xl w-fit ml-12 lg:ml-32 xl:ml-48 font-medium text-foreground">
            <div className="tracking-tighter">ERROR</div>
            <div className="-mt-16 mb-6 space-x-4">
              <Button variant="outline" asChild>
                <Link href="/">Return to Home</Link>
              </Button>
              <Button variant="ghost" onClick={reset}>
                Try Again
              </Button>
            </div>
          </div>

          <div className="text-end text-[14rem] xl:text-[28rem] leading-64 text-input -mr-4 -tracking-widest">
            500
          </div>

          <div className="text-2xl lg:text-xl xl:text-5xl text-muted-foreground mt-14 tracking-tight">
            SOMETHING WENT SIDEWAYS IN THE LAB. WE DIDN&apos;T BREAK ANY
            MACHINES (PROBABLY), BUT THIS EXPERIMENT DIDN&apos;T GO AS PLANNED.
            YOU CAN TRY AGAIN, HEAD BACK TO THE HOMEPAGE, OR CONTACT US BEFORE
            THE BEAKERS BOIL OVER.
          </div>
        </div>
      </body>
    </html>
  );
}
