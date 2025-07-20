"use client";

import Link from "next/link";
import Image from "next/image";
import Logo from "@/app/favicon.ico";
import type { Session } from "@/lib/auth";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { titleFont } from "@/lib/static/fonts";
import { Button } from "@/components/ui/button";
import Account from "@/public/images/account.png";
import { useTheme } from "@/context/themeProvider";
import { LaptopMinimal, Moon, Sun, Menu, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/blogs", label: "Blogs" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/createblog", label: "Create" },
];

export const Navbar = ({ user }: { user: Session["user"] | null }) => {
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <nav className="flex justify-between items-center px-8 h-[8dvh] max-h-[8dvh] sticky top-0 z-50 border-b backdrop-blur-3xl">
      <Link
        href="/"
        className={`${titleFont.className} flex items-center gap-2.5 -z-10 cursor-pointer hover:animate-pulse`}
      >
        <Image
          src={Logo}
          alt="MetaPress Logo"
          className="dark:invert"
          width={26}
          priority
        />
        <h1 className="text-xl font-medium mt-0.5">MetaPress</h1>
      </Link>

      <div className="lg:hidden relative">
        {isMenuOpen ? (
          <>
            <X
              onClick={() => setIsMenuOpen(false)}
              className="z-50 cursor-pointer"
            />
            <div className="fixed top-0 right-0 h-dvh w-64 bg-accent flex flex-col gap-8 px-8 py-6 transition-transform duration-300">
              <div className="flex justify-end">
                <X
                  onClick={() => setIsMenuOpen(false)}
                  className="cursor-pointer"
                />
              </div>
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`${
                    pathname === href ? "font-semibold" : "underline-hover"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <div className="mt-auto flex flex-col gap-4">
                {user ? (
                  <Link
                    href={user.username!}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Avatar>
                      <AvatarImage src={user.image ? user.image : undefined} />
                      <AvatarFallback>{user.name}</AvatarFallback>
                    </Avatar>
                  </Link>
                ) : (
                  <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button>Get Started</Button>
                  </Link>
                )}
                <div className="flex gap-2">
                  {theme === "system" ? (
                    <LaptopMinimal
                      size={16}
                      cursor="pointer"
                      onClick={() => setTheme("light")}
                    />
                  ) : theme === "light" ? (
                    <Sun
                      size={16}
                      cursor="pointer"
                      onClick={() => setTheme("dark")}
                    />
                  ) : (
                    <Moon
                      size={16}
                      cursor="pointer"
                      onClick={() => setTheme("system")}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="fixed h-dvh inset-0 bg-black/80 -z-10" />
          </>
        ) : (
          <Menu
            onClick={() => setIsMenuOpen(true)}
            className="cursor-pointer"
          />
        )}
      </div>

      <div className="hidden lg:flex gap-8 items-center font-medium">
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`${
              pathname === href ? "font-semibold" : "underline-hover"
            }`}
          >
            {label}
          </Link>
        ))}
        {user ? (
          <Link href={user.username!}>
            <Avatar>
              <AvatarImage src={user.image ? user.image : Account.src} />
              <AvatarFallback>{user.name}</AvatarFallback>
            </Avatar>
          </Link>
        ) : (
          <Link href="/signup">
            <Button>Get Started</Button>
          </Link>
        )}
        {theme === "system" ? (
          <LaptopMinimal
            size={16}
            className="-mx-2.5"
            cursor="pointer"
            onClick={() => setTheme("light")}
          />
        ) : theme === "light" ? (
          <Sun
            size={16}
            className="-mx-2.5"
            cursor="pointer"
            onClick={() => setTheme("dark")}
          />
        ) : (
          <Moon
            size={16}
            className="-mx-2.5"
            cursor="pointer"
            onClick={() => setTheme("system")}
          />
        )}
      </div>
    </nav>
  );
};
