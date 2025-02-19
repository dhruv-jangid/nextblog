import { Metadata } from "next";

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
  return <div>{children}</div>;
}
