"use client";

import Link from "next/link";
import Button from "./button";
import Image from "next/image";
import { useContext } from "react";
import { UserContext } from "@/context/userContext";
import userImg from "@/public/images/users/user1.jpg";

export default function Navbar() {
  const user = useContext(UserContext);

  return (
    <div className="text-2xl flex justify-between items-center p-8 sticky top-0 z-50 backdrop-blur-lg rounded-b-2xl">
      <h1 className="font-semibold text-2xl">BlogLust</h1>
      <div className="flex gap-8 items-center text-xl">
        <Link href="/">Home</Link>
        <Link href="/blogs">Blogs</Link>
        <Link href="/contact">Contact</Link>
        {user?.user.isLoggedIn ? (
          <div>
            <Image
              src={userImg}
              width="42"
              height="42"
              alt="User Image"
              className="rounded-full"
            />
          </div>
        ) : (
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
