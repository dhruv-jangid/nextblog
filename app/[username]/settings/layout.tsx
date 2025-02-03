import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MetaPress | User | Settings",
  description: "Settings for user on MetaPress",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
