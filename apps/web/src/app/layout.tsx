import "server-only";
import "@/globals.css";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { mainFont } from "@/lib/static/fonts";
import { Providers } from "@/components/providers";

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
    <html lang="en" suppressHydrationWarning>
      <body className={cn(mainFont.className, "antialiased")}>
        <Providers>
          <Navbar user={session ? session.user : null} />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
