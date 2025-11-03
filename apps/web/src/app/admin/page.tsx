import "server-only";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SquareArrowOutUpRight } from "lucide-react";
import { AuthService } from "@/core/auth/auth.service";

export const metadata: Metadata = {
  title: "Admin | Panel",
  description: "View the admin panel of MetaPress",
};

export default async function Admin() {
  const session = await AuthService.getUserSession();
  if (!session || session.role !== "admin") {
    notFound();
  }

  return (
    <div className="flex items-center justify-center h-dvh">
      <Button asChild>
        <Link href="/admin/dashboard">
          Dashboard <SquareArrowOutUpRight size={18} />
        </Link>
      </Button>
    </div>
  );
}
