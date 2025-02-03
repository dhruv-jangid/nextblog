"use client";

import type { User } from "@prisma/client";
import { Button } from "@/components/button";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { CloudImage } from "@/components/cloudimage";
import logo from "@/public/images/logo.png";
import { logoutUser } from "@/actions/handleAuth";

const MenuIcon = () => (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="M4 6h16M4 12h16M4 18h16"
  />
);

const CloseIcon = () => (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="M6 18L18 6M6 6l12 12"
  />
);

const ChevronIcon = () => (
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="M19 9l-7 7-7-7"
  />
);

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/blogs", label: "Blogs" },
  { href: "/contact", label: "Contact" },
  { href: "/createblog", label: "Create Blog" },
];

export const Navbar = ({ user }: { user: User | null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest(".mobile-menu-container")) {
        setIsOpen(false);
      }
      if (isProfileOpen && !target.closest(".profile-menu-container")) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, isProfileOpen]);

  return (
    <div className="flex justify-between items-center p-6 sticky top-0 z-50 backdrop-blur-2xl rounded-b-2xl">
      <button
        className="lg:hidden mobile-menu-container"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? <CloseIcon /> : <MenuIcon />}
        </svg>
      </button>

      <div className="flex items-center gap-2">
        <Image src={logo} alt="Logo" className="invert w-6" />
        <h1 className="font-semibold text-xl">MetaPress</h1>
      </div>

      <div className="hidden lg:flex gap-8 items-center text-lg">
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={
              href === "/createblog"
                ? "bg-[#EEEEEE] rounded-xl py-1 px-3 text-black hover:bg-[#EEEEEE]/80 transition-all duration-300"
                : ""
            }
          >
            {label}
          </Link>
        ))}
      </div>

      <div
        className={`lg:hidden absolute top-16 left-7 text-md mobile-menu-container ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <div className="flex flex-col items-center rounded-2xl gap-4 p-1.5 bg-[#191919] shadow-md outline outline-1 outline-gray-600/80">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className={
                href === "/createblog"
                  ? "bg-[#EEEEEE] rounded-xl py-1 px-3 text-black hover:bg-[#EEEEEE]/80 transition-all duration-300"
                  : ""
              }
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="lg:hidden relative profile-menu-container">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-1.5 bg-[#EEEEEE]/10 transition-all duration-300 rounded-full pl-2 pr-1 py-1"
            >
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  isProfileOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <ChevronIcon />
              </svg>
              <CloudImage
                publicId={user.id}
                width={32}
                height={32}
                alt="Profile Picture"
                className="rounded-full"
                author
              />
            </button>
            <div
              className={`flex flex-col absolute right-0 text-lg mt-1 p-1.5 w-max bg-[#191919] shadow-md outline outline-1 outline-gray-600/80 rounded-2xl transition-all duration-300 transform ${
                isProfileOpen
                  ? "opacity-100 scale-100 visible"
                  : "opacity-0 scale-95 invisible"
              }`}
            >
              <Link
                href={`/${user?.slug}`}
                onClick={() => setIsProfileOpen(false)}
                className="px-3 py-1 hover:bg-[#EEEEEE] hover:text-black cursor-pointer rounded-xl whitespace-nowrap"
              >
                Profile
              </Link>
              <Link
                href={`/${user?.slug}/settings`}
                onClick={() => setIsProfileOpen(false)}
                className="px-3 py-1 hover:bg-[#EEEEEE] hover:text-black cursor-pointer rounded-xl whitespace-nowrap"
              >
                Settings
              </Link>
              <div
                className="px-3 py-1 hover:bg-[#EEEEEE] hover:text-black cursor-pointer rounded-xl whitespace-nowrap"
                onClick={() => {
                  setIsProfileOpen(false);
                  logoutUser();
                }}
              >
                Logout
              </div>
            </div>
          </div>
        ) : (
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        )}
      </div>

      <div className="hidden lg:block text-lg profile-menu-container">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-1.5 bg-[#EEEEEE]/10 hover:bg-[#EEEEEE]/20 transition-all duration-300 rounded-full pl-2 pr-1 py-1"
            >
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  isProfileOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <ChevronIcon />
              </svg>
              <CloudImage
                publicId={user.id}
                width={38}
                height={38}
                alt="Profile Picture"
                className="rounded-full"
                author
              />
            </button>
            <div
              className={`flex flex-col absolute right-0 text-lg mt-1 p-1.5 w-max bg-[#191919] shadow-md outline outline-1 outline-gray-600/80 rounded-2xl transition-all duration-300 transform ${
                isProfileOpen
                  ? "opacity-100 scale-100 visible"
                  : "opacity-0 scale-95 invisible"
              }`}
            >
              <Link
                href={`/${user?.slug}`}
                onClick={() => setIsProfileOpen(false)}
                className="px-3 py-1 hover:bg-[#EEEEEE] hover:text-black cursor-pointer rounded-xl"
              >
                Profile
              </Link>
              <Link
                href={`/${user?.slug}/settings`}
                onClick={() => setIsProfileOpen(false)}
                className="px-3 py-1 hover:bg-[#EEEEEE] hover:text-black cursor-pointer rounded-xl"
              >
                Settings
              </Link>
              <div
                className="px-3 py-1 hover:bg-[#EEEEEE] hover:text-black cursor-pointer rounded-xl"
                onClick={() => {
                  setIsProfileOpen(false);
                  logoutUser();
                }}
              >
                Logout
              </div>
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
