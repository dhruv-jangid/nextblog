import "server-only";
import type { Metadata } from "next";
import { SigninClient } from "./client";

export const metadata: Metadata = {
  title: "MetaPress | Signin",
  description: "Signin to MetaPress",
};

export default function Signin() {
  return <SigninClient />;
}
