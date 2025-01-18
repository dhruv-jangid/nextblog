import Link from "next/link";
import { Button } from "@/components/button";
import Image from "next/image";
import { cookies } from "next/headers";
import { getCldImageUrl } from "next-cloudinary";
import { logoutUser } from "@/actions/handleAuth";
import logo from "@/public/images/logo.png";
import { prisma } from "@/lib/db";
import type { User } from "@prisma/client";

export const Navbar = async () => {
  let user: User | null = null;
  let profileUrl: string | null = null;

  const cookieSession = (await cookies()).get("metapress");

  if (cookieSession) {
    user = await prisma.user.findUnique({
      where: { id: cookieSession.value },
    });

    if (user) {
      profileUrl = getCldImageUrl({
        src: `nextblog/authors/${user.id}`,
      });
    } else {
      logoutUser();
    }
  }

  return (
    <div className="text-xl flex justify-between items-center p-8 sticky top-0 z-50 backdrop-blur-lg rounded-b-2xl">
      <div className="flex w-6 gap-2">
        <Image src={logo} alt="Logo" className="invert" />
        <h1 className="font-semibold text-2xl">MetaPress</h1>
      </div>
      <div className="flex gap-8 items-center text-xl">
        <Link href="/">Home</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/createblog">Create Blog</Link>
        <Link href="/about">About</Link>
      </div>
      <div>
        {profileUrl ? (
          <div className="relative cursor-pointer group">
            <Image
              src={profileUrl}
              width={36}
              height={36}
              alt="Profile Image"
              className="rounded-xl"
            />
            <div className="absolute right-0 mt-2 w-40 bg-[#EEEEEE] text-black shadow-md rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100 invisible group-hover:visible">
              <ul className="py-2">
                <Link href={`/${user?.slug}`}>
                  <li className="px-4 py-1 hover:bg-gray-200 cursor-pointer">
                    Profile
                  </li>
                </Link>
                <Link href={`/settings`}>
                  <li className="px-4 py-1 hover:bg-gray-200 cursor-pointer">
                    Settings
                  </li>
                </Link>
                <li
                  className="px-4 py-1 hover:bg-gray-200 cursor-pointer"
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
