import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MetaPress | User",
  description: "User on MetaPress",
};

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
