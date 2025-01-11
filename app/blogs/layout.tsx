import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs",
  description: "MetaPress Blogs",
};

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
