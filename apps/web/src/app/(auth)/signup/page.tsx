import "server-only";
import type { Metadata } from "next";
import { SignupClient } from "./client";

export const metadata: Metadata = {
  title: "MetaPress | Signup",
  description: "Create an account on MetaPress",
};

export default function Signup() {
  return <SignupClient />;
}
