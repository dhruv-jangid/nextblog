import Link from "next/link";
import { MdOutlineEmail } from "react-icons/md";
import { FaGithub, FaInstagram } from "react-icons/fa";
import categories from "@/utils/blogCategories.json";

export const Footer = () => {
  return (
    <div className="p-8 lg:p-16 bg-[#191919] rounded-t-2xl grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-10 gap-6 lg:gap-0">
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
        <div className="flex flex-col gap-2.5">
          <div className="relative">
            <input
              type="text"
              placeholder="Email"
              className="bg-[#262626] rounded-xl p-2 px-4 w-full"
            />
            <MdOutlineEmail
              className="absolute right-4 top-1/2 -translate-y-1/2"
              color="gray"
              size={20}
            />
          </div>
          <button className="bg-[#EEEEEE] text-[#0F0F0F] py-2 rounded-xl cursor-pointer hover:bg-[#EEEEEE]/80 transition-all duration-300">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
};
