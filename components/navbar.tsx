"use client";

import { Button } from "@/components/button";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "@/app/favicon.ico";
import { signOutCurrent } from "@/actions/handleAuth";
import { Menu, X, ChevronDown } from "lucide-react";
import Account from "@/public/images/account.png";
import { Session } from "@/lib/auth";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/blogs", label: "Blogs" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/createblog", label: "Create" },
];

export const Navbar = ({ session }: { session: Session | null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();

  const isProfileActive = pathname === `/${session?.user.slug}`;
  const isSettingsActive = pathname === "/settings";

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
    <div className="flex justify-between items-center px-6 md:px-8 py-6 sticky top-0 z-50 backdrop-blur-3xl rounded-b-4xl tracking-tight">
      <button
        className="lg:hidden mobile-menu-container"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X
            size={36}
            className="text-neutral-300 border border-b-transparent border-neutral-700 rounded-xl rounded-bl-none p-1.5"
          />
        ) : (
          <Menu
            size={36}
            className="text-neutral-300 border border-neutral-700 rounded-xl p-1.5"
          />
        )}
      </button>

      <div className="flex items-center gap-2 cursor-default hover:animate-pulse">
        <Image src={logo} alt="Logo" width={24} />
        <h1 className="font-semibold text-xl text-rose-300">MetaPress</h1>
      </div>

      <div className="hidden lg:flex gap-6 items-center text-lg">
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`rounded-xl py-1 px-3 transition-all duration-300 ${
              pathname === href
                ? "bg-rose-500/10 text-rose-300"
                : "hover:bg-rose-500/10"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      <div
        className={`lg:hidden absolute top-16 left-6 mobile-menu-container ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <div className="flex flex-col items-center rounded-2xl gap-4 py-2.5 px-1 bg-neutral-950 border rounded-tl-none border-neutral-700">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className={`rounded-xl py-1 px-3 transition-all duration-300 ${
                pathname === href
                  ? "bg-rose-500/10 text-rose-300"
                  : "hover:bg-rose-500/10"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="lg:hidden relative profile-menu-container">
        {session?.user ? (
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`flex items-center gap-1.5 border border-neutral-700 transition-all duration-300 ${
                isProfileOpen && "rounded-br-none border-b-transparent"
              } rounded-full pl-2 pr-1 py-1`}
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isProfileOpen && "rotate-180"
                }`}
              />
              <Image
                src={session.user.image || Account}
                width={32}
                height={32}
                alt="Profile Picture"
                className="rounded-full"
              />
            </button>
            <div
              className={`flex flex-col absolute right-0 p-2 w-max bg-neutral-950 shadow-md border border-neutral-800 rounded-3xl transition-all duration-300 transform ${
                isProfileOpen
                  ? "opacity-100 scale-100 visible rounded-tr-none"
                  : "opacity-0 scale-95 invisible"
              }`}
            >
              <Link
                href={`/${session?.user.slug}`}
                onClick={() => setIsProfileOpen(false)}
                className={`px-3 py-1 rounded-3xl whitespace-nowrap ${
                  isProfileActive ? "bg-rose-500/10" : "hover:bg-rose-500/10"
                }`}
              >
                Profile
              </Link>
              <Link
                href="/settings"
                onClick={() => setIsProfileOpen(false)}
                className={`px-3 py-1 rounded-3xl whitespace-nowrap ${
                  isSettingsActive ? "bg-rose-500/10" : "hover:bg-rose-500/10"
                }`}
              >
                Setting
              </Link>
              <div
                className="px-3 py-1 rounded-3xl whitespace-nowrap"
                onClick={() => {
                  setIsProfileOpen(false);
                  signOutCurrent();
                }}
              >
                Logout
              </div>
            </div>
          </div>
        ) : (
          <Link href="/signin">
            <Button>Signin</Button>
          </Link>
        )}
      </div>

      <div className="hidden lg:block text-lg profile-menu-container">
        {session?.user ? (
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`flex items-center gap-1.5 border border-neutral-700 hover:bg-rose-950/80 transition-all duration-300 ${
                isProfileOpen && "rounded-br-none border-b-transparent"
              } rounded-full pl-2 pr-1 py-1 cursor-pointer`}
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isProfileOpen && "rotate-180"
                }`}
              />
              <Image
                src={session.user.image || Account}
                width={38}
                height={38}
                alt="Profile Picture"
                className="rounded-full"
              />
            </button>
            <div
              className={`flex flex-col absolute right-0 text-lg p-2 w-max bg-neutral-950 shadow-md border border-neutral-700 rounded-tr-none rounded-3xl transition-all duration-300 transform ${
                isProfileOpen
                  ? "opacity-100 scale-100 visible"
                  : "opacity-0 scale-95 invisible"
              }`}
            >
              <Link
                href={`/${session?.user.slug}`}
                onClick={() => setIsProfileOpen(false)}
                className={`px-3 py-1 cursor-pointer rounded-3xl ${
                  isProfileActive ? "bg-rose-500/10" : "hover:bg-rose-500/10"
                }`}
              >
                Profile
              </Link>
              <Link
                href="/settings"
                onClick={() => setIsProfileOpen(false)}
                className={`px-3 py-1 cursor-pointer rounded-3xl ${
                  isSettingsActive ? "bg-rose-500/10" : "hover:bg-rose-500/10"
                }`}
              >
                Setting
              </Link>
              <div
                className="px-3 py-1 hover:bg-rose-500/10 cursor-pointer rounded-3xl"
                onClick={() => {
                  setIsProfileOpen(false);
                  signOutCurrent();
                }}
              >
                Logout
              </div>
            </div>
          </div>
        ) : (
          <Link href="/signin">
            <Button>Signin</Button>
          </Link>
        )}
      </div>
    </div>
  );
};
