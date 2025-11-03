"use client";

import Link from "next/link";
import Image from "next/image";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { GithubSVG } from "./github-svg";
import { Separator } from "./ui/separator";
import { ArrowUpRight, CornerDownRight } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="p-6 md:p-8 flex flex-col gap-12 border-t border-dashed bg-accent">
      <div className="flex flex-col xl:flex-row justify-between p-4 bg-accent-foreground rounded-xl h-132 text-background selection:bg-background selection:text-foreground">
        <div className="p-4 space-y-4">
          <div className="text-sm space-x-4">
            <span>START A NEW JOURNEY</span>
            <span className="text-orange-500">MetaPress</span>
          </div>
          <div className="text-4xl xl:text-6xl tracking-tighter xl:leading-14 mb-8">
            <div>Interested in working with us?</div>
            <div>Start a conversation now.</div>
          </div>
          <Button variant="secondary" asChild>
            <Link href="/contact">
              Contact Us <CornerDownRight />
            </Link>
          </Button>
        </div>

        <div className="relative h-4/5 aspect-3/4 self-end">
          <Image
            src="/images/creative-writing.jpg"
            alt="Creative Writing"
            fill
            priority={false}
            placeholder="empty"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover rounded-xl border sepia-50 brightness-90"
          />
        </div>
      </div>

      <section className="flex flex-col lg:flex-row gap-12 md:gap-16 lg:gap-0">
        <div className="w-full space-y-32 lg:space-y-56">
          <div className="space-y-10 lg:space-y-16">
            <div className="text-5xl lg:text-6xl tracking-tight">
              We shape ideas,
              <br />
              connection,
              <br />
              stories.
            </div>

            <div className="inline-flex items-center gap-6 lg:gap-8">
              <span className="text-lg lg:text-xl underline underline-offset-10 decoration-dotted">
                info@metapress.it
              </span>
              <Link href="https://github.com/dhruv-jangid/nextblog">
                <GithubSVG />
              </Link>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-2 xl:gap-0 xl:w-5/6 2xl:w-2/3 text-sm text-muted-foreground">
            <span>&copy; {new Date().getFullYear()}. All rights reserved.</span>
            <div className="xl:self-end inline-flex xl:justify-between xl:w-1/2 2xl:w-5/12 gap-6 xl:gap-0">
              <Link
                href="/"
                className="underline underline-offset-8 decoration-dotted tracking-tight inline-flex items-center gap-0.5"
              >
                Terms of Use <ArrowUpRight size={12} />
              </Link>
              <Link
                href="/"
                className="underline underline-offset-8 decoration-dotted tracking-tight inline-flex items-center gap-0.5"
              >
                Privacy Policy <ArrowUpRight size={12} />
              </Link>
            </div>
          </div>
        </div>

        <Separator className="lg:hidden" />

        <div className="lg:mt-1.5 lg:w-2/3 flex flex-col justify-between gap-12">
          <div>
            <span className="text-2xl tracking-tight">
              Subscribe to the newsletter
            </span>
            <div className="relative w-full xl:w-2/3">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="border-0 shadow-none border-b rounded-none py-8 md:py-10 pr-12 tracking-tight bg-transparent!"
              />
              <Button
                size="icon"
                className="absolute right-0 top-4 md:top-6 hover:-rotate-45 duration-300"
              >
                <CornerDownRight />
              </Button>
            </div>
          </div>

          <address className="not-italic">
            <div>Home, 123</div>
            <div>Vadodara, Gujarat</div>
            <div>India</div>
          </address>

          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              Site by{" "}
              <Link
                href="https://github.com/dhruv-jangid"
                className="underline underline-offset-8 decoration-dotted inline-flex items-center gap-0.5"
              >
                Dhruv Jangid <ArrowUpRight size={12} />
              </Link>
            </span>
            <div className="inline-flex items-center gap-1.5">
              MetaPress
              <Image
                src="/images/logo.png"
                alt="MetaPress Logo"
                width={20}
                height={20}
                className="opacity-70 dark:invert aspect-square"
              />
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
};
