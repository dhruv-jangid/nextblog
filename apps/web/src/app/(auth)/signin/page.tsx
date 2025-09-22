import "server-only";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { SigninClient } from "./client";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "MetaPress | Signin",
  description: "Signin to MetaPress",
};

export default async function Signin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    redirect("/");
  }

  return <SigninClient />;
}
