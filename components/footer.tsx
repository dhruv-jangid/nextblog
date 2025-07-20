"use client";

import Link from "next/link";
import Image from "next/image";
import Logo from "@/app/favicon.ico";
import { blogCategories } from "@/lib/utils";

export const Footer = () => {
  return (
    <footer className="px-8 lg:px-64 w-full border-t min-h-96">
      <div className="flex justify-between py-10 lg:py-16">
        <div className="flex flex-col gap-3 lg:gap-4 w-fit">
          <div className="text-sm font-semibold">Quick Links</div>
          <div className="flex flex-col gap-2.5">
            <Link href="/" className="underline-hover">
              Home
            </Link>
            <Link href="/blogs" className="underline-hover">
              Blogs
            </Link>
            <Link href="/contact" className="underline-hover">
              Contact
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-3 lg:gap-4 w-fit">
          <div className="text-sm font-semibold">Categories</div>
          <div className="flex flex-col gap-2.5">
            {blogCategories.slice(0, 6).map((category, index) => (
              <Link
                href={`/blogs/${category}`}
                key={index}
                className="underline-hover"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 lg:gap-4 w-fit">
          <div className="text-sm font-semibold">Social</div>
          <div className="flex flex-col gap-2.5">
            <div
              className="underline-hover"
              onClick={() => {
                window.open("https://x.com/dhruvvjangidd");
              }}
            >
              X
            </div>
            <div
              className="underline-hover"
              onClick={() => {
                window.open("https://github.com/toxic-lmao");
              }}
            >
              Github
            </div>
            <div
              className="underline-hover"
              onClick={() => {
                window.open("https://youtube.com/@toxiclmao");
              }}
            >
              Youtube
            </div>
            <div
              className="flex gap-2 items-center cursor-pointer underline-hover"
              onClick={() => {
                window.open("https://linkedin.com/in/dhruv-jangid/");
              }}
            >
              LinkedIn
            </div>
            <div
              className="flex gap-2 items-center cursor-pointer underline-hover"
              onClick={() => {
                window.open("https://instagram.com/toxic.lmao");
              }}
            >
              Instagram
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="flex justify-between items-center pt-8 pb-12">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold cursor-pointer hover:animate-pulse text-lg"
        >
          <Image src={Logo} alt="MetaPress Logo" width={26} priority />
          MetaPress
        </Link>
        <div className="w-2/3 text-balance text-right">
          © {new Date().getFullYear()} MetaPress. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
