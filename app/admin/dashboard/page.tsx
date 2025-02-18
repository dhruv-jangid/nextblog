import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import AdminDashboardClient from "./admin-dashboard-client";

export type AdminBlog = {
  id: string;
  title: string;
  slug: string;
  createdAt: Date;
  image: string | null;
  author: {
    name: string;
    slug: string;
  };
};

export type AdminUser = {
  id: string;
  name: string | null;
  slug: string | null;
  image: string | null;
  email: string;
  role: string;
};

export default async function AdminDashboard() {
  const session = await auth();

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
    }) as Promise<AdminBlog[]>,
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
    }) as Promise<AdminUser[]>,
  ]);

  return <AdminDashboardClient blogs={blogs} users={users} />;
}
