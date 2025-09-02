"use client";

import { ThemeProvider } from "./providers/themeProvider";
import { ToastProvider } from "./providers/toastProvider";
import { AlertProvider } from "./providers/alertProvider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ToastProvider>
        <AlertProvider>{children}</AlertProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};
