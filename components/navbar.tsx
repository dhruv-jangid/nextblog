import Link from "next/link";
import { Button } from "@/components/button";
import Image from "next/image";
import { cookies } from "next/headers";
import { logoutUser } from "@/actions/handleAuth";
import logo from "@/public/images/logo.png";
import { prisma } from "@/lib/db";
import type { User } from "@prisma/client";
import { redirect } from "next/navigation";
import { CloudImage } from "./cloudimage";

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

  return (
    <div className="text-lg flex justify-between items-center p-6 sticky top-0 z-50 backdrop-blur-lg rounded-b-2xl">
      <div className="flex w-6 gap-2">
        <Image src={logo} alt="Logo" className="invert" />
        <h1 className="font-semibold text-xl">MetaPress</h1>
      </div>
      <div className="flex gap-8 items-center">
        <Link href="/">Home</Link>
        <Link href="/blogs">Blogs</Link>
        <Link href="/contact">Contact</Link>
        <Link
          href="/createblog"
          className="bg-[#EEEEEE] rounded-lg py-1 px-3 text-black hover:bg-[#EEEEEE]/80 transition-all duration-300"
        >
          Create Blog
        </Link>
      </div>
      <div>
        {user ? (
          <div className="relative cursor-pointer group">
            <CloudImage
              publicId={user.id}
              width={44}
              height={44}
              alt={user.name}
              className="rounded-full"
              author
            />
            <div className="absolute right-0 mt-2 w-32 bg-[#EEEEEE] text-black shadow-md rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100 invisible group-hover:visible">
              <ul className="py-2">
                <Link href={`/${user?.slug}`}>
                  <li className="px-4 py-1 hover:bg-[#0F0F0F] hover:text-white cursor-pointer">
                    Profile
                  </li>
                </Link>
                <Link href={`/${user?.slug}/settings`}>
                  <li className="px-4 py-1 hover:bg-[#0F0F0F] hover:text-white cursor-pointer">
                    Settings
                  </li>
                </Link>
                <li
                  className="px-4 py-1 hover:bg-[#0F0F0F] hover:text-white cursor-pointer"
                  onClick={logoutUser}
                >
                  Logout
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        )}
      </div>
    </div>
  );
};
