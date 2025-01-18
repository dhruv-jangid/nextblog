"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import login2 from "@/public/images/login2.jpg";
import { useActionState } from "react";
import { handleAuth } from "@/actions/handleAuth";
import { Button } from "@/components/button";
import Image from "next/image";

export default function Login() {
  const [error, formAction, isPending] = useActionState(handleAuth, null);
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="grid grid-cols-2">
      <div className="flex flex-col items-center justify-center gap-4 w-1/2 place-self-center text-nowrap">
        <form
          action={formAction}
          className="flex flex-col items-center justify-center gap-4 w-full text-gray-200 text-lg font-medium"
        >
          <div className="flex items-center justify-center gap-1 p-2 border border-gray-500 rounded-xl font-normal">
            <input
              type="hidden"
              name="login"
              value={isLogin ? "true" : "false"}
            />
            <label
              onClick={() => setIsLogin(true)}
              className={`px-3 py-1.5 rounded-lg cursor-pointer ${
                isLogin ? "bg-gray-500" : "bg-transparent"
              }`}
            >
              Signin
            </label>
            <label
              onClick={() => setIsLogin(false)}
              className={`px-3 py-1.5 rounded-lg cursor-pointer ${
                !isLogin ? "bg-gray-500" : "bg-transparent"
              }`}
            >
              Signup
            </label>
          </div>

          {error && (
            <div
              className="bg-red-500 bg-opacity-50 w-full text-base font-normal text-wrap px-3 py-1.5 rounded-md"
              dangerouslySetInnerHTML={{ __html: error }}
            ></div>
          )}

          {!isLogin && (
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="username" className="text-lg font-medium">
                Username
              </label>
              <input
                type="text"
                className="w-full py-1.5 px-3 border bg-transparent border-gray-500 rounded-lg focus:outline-none"
                id="username"
                name="username"
                required
              />
            </div>
          )}

          {!isLogin && (
            <div className="flex flex-col gap-2 w-full">
              <label>Profile Image</label>
              <input
                type="file"
                className="hidden"
                id="authorImg"
                name="authorImg"
                accept="image/*"
                required
              />
              <label
                htmlFor="authorImg"
                className="w-full py-2 px-3 text-base border bg-transparent border-gray-500 rounded-lg text-center cursor-pointer hover:bg-gray-500/80 transition-all"
              >
                Select Image
              </label>
            </div>
          )}

          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="email" className="text-lg font-medium">
              Email
            </label>
            <input
              type="email"
              className="w-full py-1.5 px-3 border bg-transparent border-gray-500 rounded-lg focus:outline-none"
              id="email"
              name="email"
              required
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="password" className="text-lg font-medium">
              Password
            </label>
            <input
              type="password"
              className="w-full p-1.5 px-3 border bg-transparent border-gray-500 rounded-lg focus:outline-none mb-1.5"
              id="password"
              name="password"
              required
            />
          </div>

          <Button disabled={isPending}>
            {isPending
              ? isLogin
                ? "Signing in..."
                : "Signing up..."
              : isLogin
              ? "Signin"
              : "Signup"}
          </Button>
        </form>
        <div className="flex flex-col items-center justify-between gap-4 w-full text-gray-200 text-lg font-medium">
          <div className="grid grid-cols-5 place-items-center w-full">
            <hr className="col-span-2 w-full border-gray-500" />
            <h3 className="text-lg font-medium">or</h3>
            <hr className="col-span-2 w-full border-gray-500" />
          </div>
          <div className="flex items-center justify-center gap-4 w-full">
            <button className="flex items-center justify-center gap-2 bg-[#EEEEEE] text-[#0f0f0f] text-lg font-semibold w-full px-3 py-1.5 rounded-lg hover:bg-[#EEEEEE]/80 transition-all duration-300">
              <FcGoogle />
              Google
            </button>
            <button className="flex items-center justify-center gap-2 bg-[#EEEEEE] text-[#0f0f0f] text-lg font-semibold w-full px-3 py-1.5 rounded-lg hover:bg-[#EEEEEE]/80 transition-all duration-300">
              <FaGithub />
              Github
            </button>
          </div>
        </div>
      </div>
      <div className="rounded-full rounded-tr-none overflow-hidden">
        <Image
          src={login2}
          alt="The adventure begins"
          width={600}
          height={600}
          priority={true}
          placeholder="blur"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </div>
  );
}
