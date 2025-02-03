import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MetaPress | Blogs",
  description: "Blogs on MetaPress",
};

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
