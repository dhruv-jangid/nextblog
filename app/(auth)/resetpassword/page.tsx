import "server-only";
import type { Metadata } from "next";
import { ResetPasswordClient } from "./client";

export const metadata: Metadata = {
  title: "MetaPress | Reset Password",
  description: "Reset password of MetaPress account",
};

export default function ResetPassword() {
  return <ResetPasswordClient />;
}
