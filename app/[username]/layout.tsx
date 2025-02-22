import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;

  return {
    title: `Profile | ${username}`,
    description: `View the profile of ${username} on our platform.`,
  };
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
