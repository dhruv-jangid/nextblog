"use client";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip="MetaPress"
          className="hover:bg-transparent mt-0.5"
          asChild
        >
          <Link href="/" className="w-max">
            <Image
              src="/images/logo.png"
              alt="MetaPress Logo"
              className="dark:invert aspect-square"
              width={24}
              height={24}
              priority
            />
            <span className="text-lg tracking-tight font-medium mt-0.5">
              MetaPress
            </span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
