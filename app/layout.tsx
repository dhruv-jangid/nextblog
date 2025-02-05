import type { Metadata } from "next";
import "@/app/globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import localFont from "next/font/local";
import { cookies } from "next/headers";

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
  const cookieSession = (await cookies()).get("metapress");
  const user = cookieSession ? JSON.parse(cookieSession.value) : null;

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
