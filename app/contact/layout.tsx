import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "BlogLust Contact Page",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
