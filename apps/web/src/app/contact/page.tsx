import "server-only";
import type { Metadata } from "next";
import { ContactClient } from "./client";

export const metadata: Metadata = {
  title: "MetaPress | Contact",
  description: "Contact MetaPress",
};

export default function Signup() {
  return <ContactClient />;
}
