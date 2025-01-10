"use client";

import Link from "next/link";
import Button from "./button";
import Image from "next/image";
import { useContext } from "react";
import { UserContext } from "@/context/userContext";
import { VscAccount } from "react-icons/vsc";

export default function Navbar() {
  const user = useContext(UserContext);

  return (
    <div className="text-2xl flex justify-between items-center p-8 sticky top-0 z-50 backdrop-blur-lg rounded-b-2xl">
      <h1 className="font-semibold text-2xl">MetaPress</h1>
      <div className="flex gap-8 items-center text-xl">
        <Link href="/">Home</Link>
        <Link href="/blogs">Blogs</Link>
        <Link href="/contact">Contact</Link>
        {user?.user.isLoggedIn ? (
          <>
            <Link href="/createblog">
              <button className="bg-[#EEEEEE] px-3 py-1 rounded-lg w-max text-black hover:bg-[#EEEEEE]/80 transition-all duration-300">
                Create Blog
              </button>
            </Link>
            <div className="cursor-pointer">
              {/* {user?.user.isLoggedIn ? (
                <Image
                  src={user?.user.isLoggedIn}
                  width="42"
                  height="42"
                  alt="User Image"
                  className="rounded-full"
                />
              ) : ( */}
              <VscAccount size={28} />
              {/* )}  */}
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
