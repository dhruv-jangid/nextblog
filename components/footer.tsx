"use client";

import Link from "next/link";
import { MdOutlineEmail } from "react-icons/md";
import { FaGithub, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <div className="py-16 bg-[#191919] rounded-t-2xl flex justify-around mt-10">
      <div className="flex flex-col gap-2 w-1/4">
        <h1 className="text-2xl font-bold pb-2">About</h1>
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
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold pb-2">Quick Links</h1>
        <Link href="/">Home</Link>
        <Link href="/blogs">Blogs</Link>
        <Link href="/contact">Contact</Link>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold pb-2">Category</h1>
        <Link href="/blogs/agriculture">Agriculture</Link>
        <Link href="/blogs/technology">Technology</Link>
        <Link href="/blogs/health">Health</Link>
        <Link href="/blogs/science">Science</Link>
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Newsletter</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Email"
            className="bg-[#262626] rounded-lg p-2 px-4"
          />
          <MdOutlineEmail
            className="absolute right-4 top-1/2 -translate-y-1/2"
            color="gray"
            size={20}
          />
        </div>
        <button className="bg-[#EEEEEE] text-black p-2 rounded-lg">
          Subscribe
        </button>
      </div>
    </div>
  );
}
