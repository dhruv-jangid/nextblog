"use client";

import Link from "next/link";
import Image from "next/image";
import type { AdminBlog, AdminUser } from "./page";
import Account from "@/public/images/account.png";

type AdminDashboardProps = {
  blogs: AdminBlog[];
  users: AdminUser[];
};

export default function AdminDashboardClient({
  blogs,
  users,
}: AdminDashboardProps) {
  return (
    <div className="flex flex-col gap-10 px-4 lg:px-16 py-4 lg:py-12">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold">Recent Blogs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Link
              href={`/${blog.author.slug}/${blog.slug}`}
              key={blog.id}
              className="group bg-[#191919] rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative w-full h-48">
                <Image
                  src={blog.image || "/images/default-blog.jpg"}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <span className="text-gray-400 text-sm">
                  {new Date(blog.createdAt).toLocaleString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </span>

                <h2 className="text-xl font-semibold mt-2 mb-4 group-hover:text-blue-400 transition-colors line-clamp-2">
                  {blog.title}
                </h2>

                <div className="flex items-center justify-between pt-4 border-t border-[#252525]">
                  <span className="text-sm text-gray-400">
                    by {blog.author.name}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold">Users</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {users.map((user) => (
            <div
              key={user.id}
              className="group bg-[#191919] rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={user.image || Account}
                    alt={user.name || "User"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold group-hover:text-blue-400 transition-colors">
                    {user.name}
                  </h2>
                  <p className="text-gray-400">{user.email}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <p className="text-gray-400">{user.role}</p>
                <Link
                  href={`/${user.slug}`}
                  className="text-blue-400 hover:underline"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
