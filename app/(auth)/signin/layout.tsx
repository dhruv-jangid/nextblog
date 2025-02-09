import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MetaPress | Signin",
  description: "Signin to MetaPress",
};

export default function SigninLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
