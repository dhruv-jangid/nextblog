import "server-only";
import "@/globals.css";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { Footer } from "@/components/footer";
import { Sidebar } from "@/components/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { bricolageGrotesque } from "@/lib/fonts";
import { Providers } from "@/components/providers";
import { SidebarTrigger } from "@/components/ui/sidebar";

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
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <html
      className={cn(bricolageGrotesque.className)}
      lang="en"
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <Providers>
          <Sidebar user={session?.user} />
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
