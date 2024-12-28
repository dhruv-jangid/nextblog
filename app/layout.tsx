import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

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
    <html lang="en">
      <body className="bg-[#0F0F0F] text-white w-[70vw] mx-auto font-degular">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
