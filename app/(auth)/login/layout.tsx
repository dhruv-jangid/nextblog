import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BlogLust Login",
  description: "Login to BlogLust",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
