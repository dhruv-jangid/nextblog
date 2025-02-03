import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MetaPress | Login",
  description: "Login to MetaPress",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
