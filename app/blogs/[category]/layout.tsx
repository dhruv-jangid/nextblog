import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MetaPress | Blogs | Category",
  description: "Blogs on MetaPress",
};

export default function BlogCategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
