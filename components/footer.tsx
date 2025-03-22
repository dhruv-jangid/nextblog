"use client";

import Link from "next/link";
import { Send } from "lucide-react";
import Instagram from "@/public/images/instagram.png";
import Github from "@/public/images/github.png";
import categories from "@/utils/blogCategories.json";
import { newsletterSubscription } from "@/actions/handleUser";
import Image from "next/image";
import { useState } from "react";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="p-10 lg:pb-36 lg:p-14 bg-neutral-900 rounded-t-4xl grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-12 gap-y-8 lg:gap-0 tracking-tight">
      <div className="flex flex-col gap-4 w-fit">
        <h3 className="text-2xl font-bold text-rose-300">About Me</h3>
        <div className="flex flex-col gap-2.5">
          <div
            className="flex gap-2 items-center cursor-pointer w-fit relative after:absolute after:-bottom-0.5 after:left-0 after:h-[1px] after:w-0 after:bg-neutral-400 hover:after:w-full after:transition-all after:duration-300"
            onClick={() => {
              window.open("https://github.com/toxic-lmao");
            }}
          >
            <Image
              src={Github}
              alt="Github Icon"
              width={16}
              height={16}
              className="invert"
            />
            Github
          </div>
          <div
            className="flex gap-2 items-center cursor-pointer w-fit relative after:absolute after:-bottom-0.5 after:left-0 after:h-[1px] after:w-0 after:bg-neutral-400 hover:after:w-full after:transition-all after:duration-300"
            onClick={() => {
              window.open("https://www.instagram.com/toxic.lmao");
            }}
          >
            <Image
              src={Instagram}
              alt="Instagram Icon"
              width={16}
              height={16}
            />
            Instagram
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-fit">
        <h3 className="text-2xl font-bold text-rose-300">Quick Links</h3>
        <div className="flex flex-col gap-2.5">
          <Link
            href="/"
            className="w-fit relative after:absolute after:-bottom-0.5 after:left-0 after:h-[1px] after:w-0 after:bg-neutral-400 hover:after:w-full after:transition-all after:duration-300"
          >
            Home
          </Link>
          <Link
            href="/blogs"
            className="w-fit relative after:absolute after:-bottom-0.5 after:left-0 after:h-[1px] after:w-0 after:bg-neutral-400 hover:after:w-full after:transition-all after:duration-300"
          >
            Blogs
          </Link>
          <Link
            href="/contact"
            className="w-fit relative after:absolute after:-bottom-0.5 after:left-0 after:h-[1px] after:w-0 after:bg-neutral-400 hover:after:w-full after:transition-all after:duration-300"
          >
            Contact
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-fit">
        <h3 className="text-2xl font-bold text-rose-300">Categories</h3>
        <div className="flex flex-col gap-2.5">
          {categories.slice(0, 4).map((category, index) => (
            <Link
              href={`/blogs/${category}`}
              key={index}
              className="w-fit relative after:absolute after:-bottom-0.5 after:left-0 after:h-[1px] after:w-0 after:bg-neutral-400 hover:after:w-full after:transition-all after:duration-300"
            >
              {category}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4 md:col-span-3 lg:col-span-1">
        <h1 className="text-2xl font-bold text-rose-300">Newsletter</h1>
        <div className="relative flex flex-col gap-1">
          <input
            type="email"
            id="newsletter"
            name="newsletter"
            placeholder="Email"
            className="w-full py-2.5 px-5 leading-tight border border-neutral-700 rounded-4xl focus:outline-hidden mb-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <button
            onClick={async () => {
              setEmail("");
              const error = await newsletterSubscription(email);
              setError(error);
            }}
            className={`absolute right-5 top-3 text-neutral-500 ${
              email.length > 3 && "text-rose-300"
            } cursor-pointer disabled:cursor-not-allowed`}
            disabled={email.length < 4}
          >
            <Send size={18} />
          </button>
          {error && (
            <p className="px-5 py-2.5 leading-tight font-semibold text-red-500 bg-red-500/10 border border-red-500/50 rounded-4xl text-center">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
