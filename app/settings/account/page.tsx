import "server-only";
import { Account } from "./client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MetaPress | Account Settings",
  description: "Manage account settings on MetaPress",
};

export default async function AccountPage() {
  return <Account />;
}
