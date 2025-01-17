import Link from "next/link";
import Button from "./button";
import Image from "next/image";
import { cookies } from "next/headers";
import { getCldImageUrl } from "next-cloudinary";
import { logoutUser } from "@/actions/handleAuth";
import logo from "@/public/images/logo.png";
import { prisma } from "@/lib/db";

export default async function Navbar() {
  let user = null;
  let profileUrl = null;
  const cookieSession = (await cookies()).get("metapress");

  if (cookieSession) {
    user = await prisma.user.findUnique({
      where: { id: cookieSession.value },
    });

    if (user) {
      profileUrl = getCldImageUrl({
        src: `nextblog/authors/${user.id}`,
      });
    }
  }

  return (
    <div className="text-2xl flex justify-between items-center p-8 sticky top-0 z-50 backdrop-blur-lg rounded-b-2xl">
      <div className="flex w-6 gap-2">
        <Image src={logo} alt="Logo" className="invert" />
        <h1 className="font-semibold text-2xl">MetaPress</h1>
      </div>
      <div className="flex gap-8 items-center text-xl">
        <Link href="/">Home</Link>
        <Link href="/blogs">Blogs</Link>
        <Link href="/contact">Contact</Link>
        {profileUrl ? (
          <>
            <Link href="/createblog">
              <button className="bg-[#EEEEEE] px-3 py-1 rounded-lg w-max text-black hover:bg-[#EEEEEE]/80 transition-all duration-300">
                Create Blog
              </button>
            </Link>
            <div className="relative cursor-pointer group">
              <Image
                src={profileUrl}
                width="32"
                height="32"
                alt="Profile Image"
                className="rounded-full"
              />
              <div className="absolute right-0 mt-2 w-40 bg-[#EEEEEE] text-black shadow-md rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100 invisible group-hover:visible">
                <ul className="py-2">
                  <li className="px-4 py-1 hover:bg-gray-200 cursor-pointer">
                    Profile
                  </li>
                  <li className="px-4 py-1 hover:bg-gray-200 cursor-pointer">
                    Settings
                  </li>
                  <li
                    className="px-4 py-1 hover:bg-gray-200 cursor-pointer"
                    onClick={logoutUser}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            </div>
          </>
        ) : (
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
