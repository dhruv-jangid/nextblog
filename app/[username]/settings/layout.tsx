import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;

  return {
    title: `Settings | ${username}`,
    description: "Settings for user on MetaPress",
  };
}

export default async function SettingsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const session = await auth();

  if (username !== session?.user.slug) {
    redirect("/");
  }
  return <SessionProvider>{children}</SessionProvider>;
}
