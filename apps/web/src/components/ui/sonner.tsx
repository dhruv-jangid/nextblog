"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-center"
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      toastOptions={{
        style: {
          fontFamily: "Bricolage Grotesque",
          borderRadius: "calc(var(--radius-2xl)",
          fontSize: "var(--text-sm)",
          padding: "calc(var(--spacing) * 3.5) calc(var(--spacing) * 5)",
          gap: "calc(var(--spacing) * 2)",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
