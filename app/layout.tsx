import type { Metadata } from "next";
import "@/app/globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import localFont from "next/font/local";
import { auth } from "@/lib/auth";

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
  const session = await auth();
  const user = session ? session.user : null;

  return (
    <html lang="en" className={degular.className}>
      <body className="bg-[#0F0F0F] text-white w-[90vw] lg:w-[80vw] xl:w-[70vw] mx-auto">
        <Navbar user={user} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
