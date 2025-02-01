"use client";

import Link from "next/link";
import { Button } from "@/components/button";
import Image from "next/image";
import { logoutUser } from "@/actions/handleAuth";
import logo from "@/public/images/logo.png";
import type { User } from "@prisma/client";
import { CloudImage } from "./cloudimage";
import { useState } from "react";

interface NavbarClientProps {
  user: User | null;
}

export const NavbarClient = ({ user }: NavbarClientProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="text-lg flex justify-between items-center p-6 sticky top-0 z-50 backdrop-blur-2xl rounded-b-2xl">
      <div className="flex w-6 gap-2">
        <Image src={logo} alt="Logo" className="invert" />
        <h1 className="font-semibold text-xl">MetaPress</h1>
      </div>

      <button className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      <div className="hidden lg:flex gap-8 items-center">
        <Link href="/">Home</Link>
        <Link href="/blogs">Blogs</Link>
        <Link href="/contact">Contact</Link>
        <Button>
          <Link href="/createblog">Create Blog</Link>
        </Button>
      </div>

      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-lg ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <div className="flex flex-col items-center py-4 gap-4">
          <Link href="/" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link href="/blogs" onClick={() => setIsOpen(false)}>
            Blogs
          </Link>
          <Link href="/contact" onClick={() => setIsOpen(false)}>
            Contact
          </Link>
          <Link href="/createblog" onClick={() => setIsOpen(false)}>
            Create Blog
          </Link>
        </div>
      </div>

      <div className="hidden lg:block">
        {user ? (
          <div className="relative cursor-pointer group">
            <CloudImage
              publicId={user.id}
              width={44}
              height={44}
              alt={user.name}
              className="rounded-full"
              author
            />
            <div className="absolute right-0 mt-2 w-32 bg-[#EEEEEE] text-black shadow-md rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100 invisible group-hover:visible">
              <ul className="py-2">
                <Link href={`/${user?.slug}`}>
                  <li className="px-4 py-1 hover:bg-[#0F0F0F] hover:text-white cursor-pointer">
                    Profile
                  </li>
                </Link>
                <Link href={`/${user?.slug}/settings`}>
                  <li className="px-4 py-1 hover:bg-[#0F0F0F] hover:text-white cursor-pointer">
                    Settings
                  </li>
                </Link>
                <li
                  className="px-4 py-1 hover:bg-[#0F0F0F] hover:text-white cursor-pointer"
                  onClick={logoutUser}
                >
                  Logout
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        )}
      </div>
    </div>
  );
};
