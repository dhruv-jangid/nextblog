"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import auth from "@/public/images/auth.jpg";
import { useActionState } from "react";
import { Button } from "@/components/button";
import Image from "next/image";
import Link from "next/link";
import {
  googleAuth,
  githubAuth,
  credentialsSignin,
} from "@/actions/handleAuth";

export default function Signin() {
  const [error, action, isPending] = useActionState(credentialsSignin, null);

  return (
    <div className="grid lg:grid-cols-2 h-[80vh]">
      <div className="flex flex-col items-center justify-center gap-4 w-2/3 lg:w-1/2 place-self-center text-nowrap">
        <div className="flex items-center justify-center gap-4 w-full">
          <button
            className="flex items-center justify-center gap-2 bg-[#EEEEEE] text-[#0f0f0f] text-lg font-semibold w-full px-3 py-1.5 rounded-xl hover:bg-[#EEEEEE]/80 transition-all duration-300 cursor-pointer"
            onClick={() => googleAuth()}
          >
            <FcGoogle />
            Google
          </button>
          <button
            className="flex items-center justify-center gap-2 bg-[#EEEEEE] text-[#0f0f0f] text-lg font-semibold w-full px-3 py-1.5 rounded-xl hover:bg-[#EEEEEE]/80 transition-all duration-300 cursor-pointer"
            onClick={() => githubAuth()}
          >
            <FaGithub />
            Github
          </button>
        </div>

        <div className="grid grid-cols-5 place-items-center w-full">
          <hr className="col-span-2 w-full border-gray-500" />
          <h3 className="text-lg font-medium">or</h3>
          <hr className="col-span-2 w-full border-gray-500" />
        </div>

        <form
          action={action}
          className="flex flex-col items-center justify-center gap-4 w-full text-gray-200 text-lg font-medium"
        >
          {error && (
            <div
              className="bg-red-800 bg-opacity-50 w-full text-base font-normal text-wrap px-3 py-2 rounded-xl text-center line-clamp-3"
              dangerouslySetInnerHTML={{ __html: error }}
            ></div>
          )}

          <div className="flex flex-col gap-2 w-full">
            <input
              type="email"
              className="w-full py-1.5 px-3 border bg-transparent border-gray-500 rounded-xl focus:outline-hidden"
              id="email"
              name="email"
              placeholder="Email"
              required
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <input
              type="password"
              className="w-full p-1.5 px-3 border bg-transparent border-gray-500 rounded-xl focus:outline-hidden mb-1.5"
              id="password"
              name="password"
              placeholder="Password"
              required
            />
          </div>

          <Button
            disabled={isPending}
            className="w-full bg-[#EEEEEE] text-[#0f0f0f] text-lg font-semibold py-1.5 rounded-xl cursor-pointer hover:bg-[#EEEEEE]/80 transition-all duration-300"
          >
            {isPending ? "Signing in..." : "Signin"}
          </Button>
        </form>
        <div className="flex flex-col items-center justify-between gap-4 w-full text-gray-300 text-lg">
          <div className="text-center mt-2">
            <p>
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-[#EEEEEE] underline font-semibold"
              >
                Signup
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="rounded-full rounded-tr-none overflow-hidden hidden lg:block relative">
        <Image
          src={auth}
          alt="The adventure begins"
          fill
          quality={100}
          priority={true}
          placeholder="blur"
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
