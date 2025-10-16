import "server-only";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ResetPasswordClient } from "./client";

export const metadata: Metadata = {
  title: "MetaPress | Reset Password",
  description: "Reset password of your MetaPress account",
};

export default async function ResetPassword() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    redirect("/");
  }

  return <ResetPasswordClient />;
}
