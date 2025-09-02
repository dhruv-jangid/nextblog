import "server-only";
import Link from "next/link";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SquareArrowOutUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin | Panel",
  description: "View the admin panel of MetaPress",
};

export default async function Admin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    notFound();
  }

  return (
    <div className="flex items-center justify-center h-[92dvh]">
      <Link href="/admin/dashboard">
        <Button>
          Dashboard <SquareArrowOutUpRight size={18} />
        </Button>
      </Link>
    </div>
  );
}
