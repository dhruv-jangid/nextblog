"use client";

import {
  Rss,
  Library,
  BookText,
  PencilRuler,
  MessageCircleMore,
  type LucideIcon,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarGroup,
  SidebarMenuItem,
  SidebarGroupLabel,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";

const navLinks: { title: string; url: Route; icon: LucideIcon }[] = [
  {
    title: "Home",
    url: "/",
    icon: Rss,
  },
  {
    title: "Blogs",
    url: "/blogs",
    icon: Library,
  },
  {
    title: "About",
    url: "/about",
    icon: BookText,
  },
  {
    title: "Contact",
    url: "/contact",
    icon: MessageCircleMore,
  },
  {
    title: "Create",
    url: "/createblog",
    icon: PencilRuler,
  },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Explore</SidebarGroupLabel>
      <SidebarMenu>
        {navLinks.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              tooltip={item.title}
              asChild
              isActive={item.url === pathname}
            >
              <Link href={item.url}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
