import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Settings",
    description: "User Settings",
  };
}

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
