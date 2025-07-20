import "server-only";
import "@/app/globals.css";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { cn } from "@/lib/static/shadcnUtils";
import { mainFont } from "@/lib/static/fonts";
import { AlertProvider } from "@/context/alertProvider";
import { ToastProvider } from "@/context/toastProvider";
import { ThemeProvider } from "@/context/themeProvider";

export const metadata: Metadata = {
  title: "MetaPress",
  description: "MetaPress: The Pulse of Creativity",
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ToastProvider>
            <AlertProvider>
              <Navbar user={session ? session.user : null} />
              {children}
              <Footer />
            </AlertProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
