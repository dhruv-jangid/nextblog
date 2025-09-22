import "server-only";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { ContactClient } from "./client";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "MetaPress | Contact",
  description: "Contact MetaPress",
};

export default async function Contact() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/signin");
  }

  return <ContactClient />;
}
