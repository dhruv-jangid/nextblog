import { cookies } from "next/headers";
import { logoutUser } from "@/actions/handleAuth";
import { prisma } from "@/lib/db";
import type { User } from "@prisma/client";
import { redirect } from "next/navigation";
import { NavbarClient } from "@/components/navbarclient";

export const Navbar = async () => {
  let user: User | null = null;
  const cookieSession = (await cookies()).get("metapress");

  if (cookieSession) {
    user = await prisma.user.findUnique({
      where: { id: cookieSession.value },
    });

    if (!user) {
      logoutUser();
      redirect("/login");
    }
  }

  return <NavbarClient user={user} />;
};
