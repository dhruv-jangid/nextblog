import "server-only";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Logout } from "./_components/logout";
import { AuthService } from "@/core/auth/auth.service";

export const metadata: Metadata = {
  title: "Edit Profile",
  description: "Manage profile on MetaPress",
};

export default async function Profile() {
  const session = await AuthService.getUserSession();
  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="pt-24 min-h-dvh">
      <div className="text-5xl font-medium tracking-tight pb-8 text-end border-b border-dashed w-full px-12 lg:px-64">
        Profile
      </div>

      <div className="space-y-12 mx-12 lg:mx-24 text-xl mt-36">
        <div className="tracking-tight">Username: {session.username}</div>
        <div className="tracking-tight">Name: {session.name}</div>
        <div className="space-y-2">
          <div className="tracking-tight">Logout from current device</div>
          <Logout />
        </div>
      </div>
    </div>
  );
}
