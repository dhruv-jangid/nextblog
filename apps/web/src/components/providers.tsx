"use client";

import { Toaster } from "./ui/sonner";
import { ThemeProvider } from "next-themes";
import { AlertProvider } from "./providers/alertProvider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AlertProvider>
        {children}
        <Toaster />
      </AlertProvider>
    </ThemeProvider>
  );
};
