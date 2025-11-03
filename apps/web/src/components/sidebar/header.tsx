import Link from "next/link";
import Image from "next/image";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "../ui/sidebar";

export const Header = () => {
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
              width={18}
              height={18}
              priority
            />
            <span className="text-base tracking-tight mt-0.5">MetaPress</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
