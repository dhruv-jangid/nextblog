import "server-only";
import "@/globals.css";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { Sidebar } from "@/components/sidebar/sidebar";
import { Bricolage_Grotesque } from "next/font/google";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Providers } from "@/components/providers/providers";

const bricolageGrotesque = Bricolage_Grotesque({
  adjustFontFallback: true,
  subsets: ["latin"],
  preload: true,
});

export const metadata: Metadata = {
  title: "MetaPress",
  description: "MetaPress: The Pulse of Creativity",
  applicationName: "MetaPress",
  authors: { name: "Dhruv Jangid", url: "https://github.com/dhruv-jangid" },
  creator: "Dhruv Jangid",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(bricolageGrotesque.className)}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <Providers>
          <Sidebar />

          <main className="w-full">
            <SidebarTrigger />
            {children}
            <Footer />
          </main>

          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
