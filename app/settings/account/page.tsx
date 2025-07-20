import "server-only";
import { Account } from "./client";
import type { Metadata } from "next";
import { titleFont } from "@/lib/static/fonts";

export const metadata: Metadata = {
  title: "MetaPress | Account Settings",
  description: "Manage account settings on MetaPress",
};

export default async function AccountPage() {
  return (
    <div className="mx-auto py-16">
      <h1
        className={`${titleFont.className} text-3xl font-medium pb-10 text-end border-b w-full px-12 lg:px-64`}
      >
        Account Settings
      </h1>
      <Account />
    </div>
  );
}
