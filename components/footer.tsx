"use client";

import Link from "next/link";
import { MdOutlineEmail } from "react-icons/md";
import { FaGithub, FaInstagram } from "react-icons/fa";
import categories from "@/utils/blogCategories.json";
import { useActionState } from "react";
import { newsletterSubscription } from "@/actions/handleUser";

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
            <FaGithub size={20} />
            <Link href="https://github.com/toxic-lmao" target="_blank">
              Github
            </Link>
          </div>
          <div className="flex gap-2 items-center">
            <FaInstagram size={20} />
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
              id="email"
              name="email"
              placeholder="Email"
              className="bg-[#262626] rounded-xl p-2 px-4 w-full"
              disabled={isPending}
              autoComplete="email"
            />
            <MdOutlineEmail
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
