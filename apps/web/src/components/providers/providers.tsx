"use client";

import { ThemeProvider } from "next-themes";
import { AlertProvider } from "./alertProvider";
import { SidebarProvider } from "../ui/sidebar";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <AlertProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </AlertProvider>
    </ThemeProvider>
  );
};
