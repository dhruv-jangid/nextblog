import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MetaPress | Signup",
  description: "Signup to MetaPress",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
