import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MetaPress | Contact",
  description: "Contact MetaPress",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
