import "server-only";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { SignupClient } from "./client";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "MetaPress | Signup",
  description: "Create an account on MetaPress",
};

export default async function Signup() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    redirect("/");
  }

  return <SignupClient />;
}
