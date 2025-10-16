"use client";

import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "./ui/sidebar";
import { AlertProvider } from "./providers/alertProvider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <AlertProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </AlertProvider>
    </ThemeProvider>
  );
};
