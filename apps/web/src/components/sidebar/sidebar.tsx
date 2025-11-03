import {
  Sidebar as SB,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "../ui/sidebar";
import { Header } from "./header";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { AuthService } from "@/core/auth/auth.service";

export const Sidebar = async ({
  ...props
}: React.ComponentProps<typeof SB>) => {
  const user = await AuthService.getUserSession();

  return (
    <SB collapsible="icon" {...props}>
      <SidebarHeader>
        <Header />
      </SidebarHeader>

      <SidebarContent>
        <Navbar />
      </SidebarContent>

      <SidebarFooter>
        <Footer user={user} />
      </SidebarFooter>
    </SB>
  );
};
