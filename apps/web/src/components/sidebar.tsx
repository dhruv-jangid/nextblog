"use client";

import {
  Sidebar as SB,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "./ui/sidebar";
import { Header } from "./sidebar/header";
import { Navbar } from "./sidebar/navbar";
import { Footer } from "./sidebar/footer";
import { YourBlogs } from "./sidebar/your-blogs";

export const Sidebar = ({
  user,
  ...props
}: React.ComponentProps<typeof SB> & { user: Session["user"] | undefined }) => {
  return (
    <SB collapsible="icon" {...props}>
      <SidebarHeader>
        <Header />
      </SidebarHeader>
      <SidebarContent>
        <Navbar />
        {/* {user && <YourBlogs />} */}
      </SidebarContent>
      <SidebarFooter>
        <Footer user={user} />
      </SidebarFooter>
    </SB>
  );
};
