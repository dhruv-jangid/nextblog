"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import Instagram from "@/public/images/instagram.png";
import Github from "@/public/images/github.png";
import categories from "@/utils/blogCategories.json";
import { useActionState } from "react";
import { newsletterSubscription } from "@/actions/handleUser";
import Image from "next/image";

export const Footer = () => {
  const [error, action, isPending] = useActionState(
    newsletterSubscription,
    null
  );

  return (
    <div className="p-8 pb-16 lg:px-16 lg:pt-14 lg:pb-24 bg-[#191919] rounded-t-2xl grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-10 gap-8 lg:gap-0 tracking-tight">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">About Me</h1>
        <div className="flex flex-col gap-2.5">
          <div className="flex gap-2 items-center">
            <Image
              src={Github}
              alt="Github Icon"
              width={16}
              height={16}
              className="invert"
            />
            <Link href="https://github.com/toxic-lmao" target="_blank">
              Github
            </Link>
          </div>
          <div className="flex gap-2 items-center">
            <Image
              src={Instagram}
              alt="Instagram Icon"
              width={16}
              height={16}
            />
            <Link href="https://www.instagram.com/toxic.lmao/" target="_blank">
              Instagram
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Quick Links</h1>
        <div className="flex flex-col gap-2.5">
          <Link href="/">Home</Link>
          <Link href="/blogs">Blogs</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Categories</h1>
        <div className="flex flex-col gap-2.5">
          {categories.slice(0, 4).map((category, index) => (
            <Link href={`/blogs/${category}`} key={index}>
              {category}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4 md:col-span-3 lg:col-span-1">
        <h1 className="text-2xl font-bold">Newsletter</h1>
        <form action={action} className="flex flex-col gap-2.5">
          {error && (
            <p className="text-center bg-red-800 py-1.5 rounded-xl">{error}</p>
          )}
          <div className="relative">
            <input
              type="email"
              id="newsletter"
              name="newsletter"
              placeholder="Email"
              className="bg-[#262626] rounded-xl p-2 px-4 w-full"
              disabled={isPending}
              autoComplete="email"
            />
            <Mail
              className="absolute right-4 top-1/2 -translate-y-1/2"
              color="gray"
              size={20}
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="bg-[#EEEEEE] text-[#0F0F0F] py-2 rounded-xl cursor-pointer hover:bg-[#EEEEEE]/80 transition-all duration-300"
          >
            {isPending ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      </div>
    </div>
  );
};
