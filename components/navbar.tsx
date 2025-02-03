import { cookies } from "next/headers";
import { NavbarClient } from "@/components/navbarclient";

export const Navbar = async () => {
  const cookieSession = (await cookies()).get("metapress");
  if (cookieSession) {
    const user = JSON.parse(cookieSession?.value);
    return <NavbarClient user={user} />;
  }

  return <NavbarClient user={null} />;
};
