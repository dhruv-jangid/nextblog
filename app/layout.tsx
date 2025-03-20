import type { Metadata } from "next";
import "@/app/globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import localFont from "next/font/local";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const degular = localFont({
  src: "../public/fonts/DegularVariable.ttf",
});

export const metadata: Metadata = {
  title: "MetaPress",
  description: "MetaPress: The Pulse of Creativity",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <html lang="en" className={degular.className}>
      <body className="bg-neutral-950 text-neutral-100 antialiased w-[90vw] lg:w-[80vw] xl:w-[70vw] mx-auto selection:bg-rose-950">
        <Navbar session={session} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
