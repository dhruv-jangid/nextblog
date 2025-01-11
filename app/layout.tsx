import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import localFont from "next/font/local";

const degular = localFont({
  src: "../public/fonts/DegularVariable.ttf",
});

export const metadata: Metadata = {
  title: "MetaPress",
  description: "MetaPress: The Pulse of Creativity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={degular.className}>
      <body className="bg-[#0F0F0F] text-white w-[70vw] mx-auto">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
