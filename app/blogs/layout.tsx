import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs",
  description: "BlogLust Blogs Page",
};

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
