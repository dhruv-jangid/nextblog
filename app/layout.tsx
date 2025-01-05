import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import localFont from "next/font/local";
import { UserProvider } from "@/context/userContext";

const degular = localFont({
  src: "../public/fonts/DegularVariable.ttf",
});

export const metadata: Metadata = {
  title: "BlogLust",
  description: "Blog Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={degular.className}>
      <body className="bg-[#0F0F0F] text-white w-[70vw] mx-auto">
        <UserProvider>
          <Navbar />
          {children}
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
