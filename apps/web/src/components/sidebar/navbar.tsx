"use client";

import {
  Rss,
  BookText,
  PencilRuler,
  type LucideIcon,
  MessageCircleMore,
  House,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarGroup,
  SidebarMenuItem,
  SidebarGroupLabel,
  SidebarMenuButton,
} from "../ui/sidebar";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";

const navLinks: { title: string; url: Route; icon: LucideIcon }[] = [
  {
    title: "Home",
    url: "/",
    icon: House,
  },
  {
    title: "Feed",
    url: "/feed",
    icon: Rss,
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
    url: "/create-blog",
    icon: PencilRuler,
  },
];

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Explore</SidebarGroupLabel>
      <SidebarMenu>
        {navLinks.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              tooltip={item.title}
              isActive={item.url === pathname}
              asChild
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
};
