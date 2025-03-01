import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Dashboard } from "@/components/dashboard";
import { headers } from "next/headers";

export default async function AdminDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const [blogs, users] = await Promise.all([
    prisma.blog.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        createdAt: true,
        image: true,
        author: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        email: true,
        role: true,
        image: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return <Dashboard blogs={blogs} users={users} />;
}
