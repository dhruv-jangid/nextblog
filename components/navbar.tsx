"use client";

import { Button } from "@/components/button";
import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Logo from "@/app/favicon.ico";
import { signOutCurrent } from "@/actions/handleAuth";
import { Menu, X, ChevronDown } from "lucide-react";
import Account from "@/public/images/account.png";
import { Session } from "@/lib/auth";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/blogs", label: "Blogs" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/createblog", label: "Create" },
];

export const Navbar = ({ session }: { session: Session | null }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="flex justify-between items-center px-8 md:px-12 py-6 sticky top-0 z-50 backdrop-blur-3xl rounded-b-4xl tracking-tight">
      <div className="relative lg:hidden">
        {isMenuOpen ? (
          <X
            size={36}
            strokeWidth={1}
            className="border border-b-transparent border-neutral-800 rounded-xl rounded-bl-none p-1.5"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
        ) : (
          <Menu
            size={36}
            strokeWidth={1}
            className="border border-neutral-800 rounded-xl p-1.5"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
        )}
        <div
          className={`absolute top-9 left-0 ${
            isMenuOpen ? "block" : "hidden"
          } flex flex-col items-center rounded-3xl leading-tight gap-4 py-2.5 px-1 bg-neutral-950 border rounded-tl-none border-neutral-800`}
        >
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => {
                setIsMenuOpen(false);
              }}
              className={`rounded-4xl py-1.5 px-3.5 ${
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

      <div className="flex items-center gap-2.5 cursor-default hover:animate-pulse">
        <Image src={Logo} alt="MetaPress Logo" width={26} priority />
        <Link href="/" className="font-semibold text-xl text-rose-300">
          MetaPress
        </Link>
      </div>

      <div className="hidden lg:flex gap-3 xl:gap-6 items-center text-lg">
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`rounded-4xl py-1 px-3.5 transition-all duration-300 ${
              pathname === href
                ? "bg-rose-500/10 text-rose-300"
                : "hover:bg-rose-500/10 cursor-pointer"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {session?.user ? (
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`flex items-center gap-1 border border-neutral-800 hover:bg-rose-500/10 transition-all duration-300 ${
              isProfileOpen && "rounded-br-none border-b-transparent"
            } rounded-full p-1 pl-1.5 cursor-pointer`}
          >
            <ChevronDown
              size={18}
              strokeWidth={1}
              className={`transition-transform duration-200 ${
                isProfileOpen && "rotate-180"
              }`}
            />
            <Image
              src={session.user.image || Account}
              width={36}
              height={36}
              alt="Profile Picture"
              className="rounded-full w-8 h-8 md:w-9 md:h-9"
            />
          </button>
          <div
            className={`flex flex-col items-center justify-between gap-1.5 absolute right-0 p-2 bg-neutral-950 leading-tight border border-neutral-800 rounded-tr-none rounded-3xl transition-all duration-300 transform ${
              isProfileOpen
                ? "opacity-100 scale-100 visible"
                : "opacity-0 scale-95 invisible"
            }`}
          >
            <Link href={`/${session?.user.slug}`}>
              <Button
                onClick={() => {
                  setIsProfileOpen(false);
                }}
              >
                Profile
              </Button>
            </Link>
            <Link href="/settings">
              <Button
                onClick={() => {
                  setIsProfileOpen(false);
                }}
              >
                Setting
              </Button>
            </Link>
            <Button
              onClick={() => {
                setIsProfileOpen(false);
                signOutCurrent();
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      ) : (
        <Link href="/signin">
          <Button roseVariant>Signin</Button>
        </Link>
      )}
    </nav>
  );
};
