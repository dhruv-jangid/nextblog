"use client";

import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import login2 from "@/public/images/login2.jpg";
import { useState, useActionState } from "react";
import { handleAuth } from "@/actions/handleAuth";

export default function Login() {
  const [error, formAction, isPending] = useActionState(handleAuth, null);
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="grid grid-cols-2">
      <div className="flex flex-col items-center justify-center gap-8 w-1/2 place-self-center text-nowrap">
        <form
          action={formAction}
          className="flex flex-col items-center justify-center gap-6 w-full text-gray-200"
        >
          <div className="flex items-center justify-center gap-1 p-2 border border-gray-500 rounded-lg">
            <input type="hidden" name="login" value={isLogin ? "1" : "0"} />
            <label
              onClick={() => setIsLogin(true)}
              className={`text-lg font-medium px-3 py-1.5 rounded-md cursor-pointer ${
                isLogin && "bg-gray-500"
              }`}
            >
              Login
            </label>
            <label
              onClick={() => setIsLogin(false)}
              className={`text-lg font-medium px-3 py-1.5 rounded-md cursor-pointer ${
                !isLogin && "bg-gray-500"
              }`}
            >
              Register
            </label>
          </div>
          {error && (
            <div className="bg-red-500 bg-opacity-50 px-3 py-1.5 rounded-md">
              {error}
            </div>
          )}
          {!isLogin && (
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="username" className="text-lg font-medium">
                Username
              </label>
              <input
                type="text"
                className="w-full py-1.5 px-3 border bg-transparent border-gray-500 rounded-md focus:-outline-offset-2"
                name="username"
                required
              />
            </div>
          )}

          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="email" className="text-lg font-medium">
              Email
            </label>
            <input
              type="email"
              className="w-full py-1.5 px-3 border bg-transparent border-gray-500 rounded-md focus:-outline-offset-2"
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
              className="w-full p-1.5 px-3 border bg-transparent border-gray-500 rounded-md focus:-outline-offset-2"
              name="password"
              required
            />
          </div>
          <button
            disabled={isPending}
            className="bg-[#EEEEEE] text-[#0f0f0f] text-lg font-semibold w-full px-3 py-1.5 rounded-md hover:bg-[#EEEEEE]/80 transition-all duration-300"
          >
            {isPending
              ? isLogin
                ? "Logging in..."
                : "Registering..."
              : isLogin
              ? "Login"
              : "Register"}
          </button>
          <div className="grid grid-cols-5 place-items-center w-full">
            <hr className="col-span-2 w-full border-gray-500" />
            <h3 className="text-lg font-medium">or</h3>
            <hr className="col-span-2 w-full border-gray-500" />
          </div>
          <div className="flex items-center justify-center gap-2 w-full">
            <button className="flex items-center justify-center gap-2 bg-[#EEEEEE] text-[#0f0f0f] text-lg font-semibold w-full px-3 py-1.5 rounded-md hover:bg-[#EEEEEE]/80 transition-all duration-300">
              <FcGoogle />
              Google
            </button>
            <button className="flex items-center justify-center gap-2 bg-[#EEEEEE] text-[#0f0f0f] text-lg font-semibold w-full px-3 py-1.5 rounded-md hover:bg-[#EEEEEE]/80 transition-all duration-300">
              <FaGithub />
              Github
            </button>
          </div>
        </form>
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
