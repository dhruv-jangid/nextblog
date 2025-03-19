"use client";

import Google from "@/public/images/google.png";
import Github from "@/public/images/github.png";
import { Eye, EyeClosed } from "lucide-react";
import auth from "@/public/images/auth.jpg";
import { useState } from "react";
import { Button } from "@/components/button";
import Image from "next/image";
import Link from "next/link";
import { credentialSignUp, socialSignIn } from "@/actions/handleAuth";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="grid xl:grid-cols-2 h-[80vh]">
      <div className="flex flex-col items-center justify-center gap-4 w-2/3 lg:w-1/2 place-self-center text-nowrap">
        <div className="flex items-center justify-center gap-4 w-full">
          <button
            className="flex items-center justify-center gap-2 bg-[#EEEEEE] text-[#0f0f0f] text-lg font-semibold w-full px-3 py-1.5 rounded-xl hover:bg-[#EEEEEE]/80 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={pending}
            onClick={async () => {
              setError(null);
              setPending(true);
              const error = await socialSignIn("google");
              if (error) {
                setPending(false);
                setError(error);
              }
            }}
          >
            <Image src={Google} alt="Google's icon" width={16} height={16} />
            Google
          </button>
          <button
            className="flex items-center justify-center gap-2 bg-[#EEEEEE] text-[#0f0f0f] text-lg font-semibold w-full px-3 py-1.5 rounded-xl hover:bg-[#EEEEEE]/80 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={async () => {
              setError(null);
              setPending(true);
              const error = await socialSignIn("github");
              if (error) {
                setPending(false);
                setError(error);
              }
            }}
            disabled={pending}
          >
            <Image src={Github} alt="Github's icon" width={18} height={18} />
            Github
          </button>
        </div>

        <div className="flex items-center justify-evenly w-full">
          <hr className="w-1/3 border-gray-500" />
          <h3 className="text-lg font-medium px-1.5">or</h3>
          <hr className="w-1/3 border-gray-500" />
        </div>

        {error && (
          <div className="px-4 py-2 text-red-500 bg-red-500/10 border border-red-500/50 rounded-xl">
            {error}
          </div>
        )}

        <form
          className="flex flex-col items-center justify-center gap-4 w-full text-gray-200 text-lg font-medium"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setPending(true);

            const email = e.currentTarget.email.value as string;
            const password = e.currentTarget.password.value as string;
            const slug = e.currentTarget.slug.value as string;

            const error = await credentialSignUp(slug, email, password);
            if (error) {
              setPending(false);
              setError(error);
            }
          }}
        >
          <div className="flex flex-col gap-2 w-full">
            <input
              type="text"
              className="w-full py-1.5 px-3 border bg-white/5 border-gray-500 rounded-xl focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              id="slug"
              name="slug"
              placeholder="Username"
              required
              disabled={pending}
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <input
              type="email"
              className="w-full py-1.5 px-3 border bg-white/5 border-gray-500 rounded-xl focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              id="email"
              name="email"
              placeholder="Email"
              required
              disabled={pending}
            />
          </div>

          <div className="relative flex flex-col gap-2 w-full h-24">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-1.5 px-3 border bg-white/5 border-gray-500 rounded-xl focus:outline-hidden mb-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              id="password"
              name="password"
              placeholder="Password"
              required
              disabled={pending}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-5 -translate-y-1/2 text-gray-400 hover:text-gray-200 cursor-pointer"
              disabled={pending}
            >
              {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
            </button>
            <input
              type="password"
              className="w-full p-1.5 px-3 border bg-white/5 border-gray-500 rounded-xl focus:outline-hidden mb-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              id="passwordConfirm"
              name="passwordConfirm"
              placeholder="Confirm Password"
              required
              disabled={pending}
            />
          </div>

          <Button
            disabled={pending}
            className="w-full bg-[#EEEEEE] text-[#0f0f0f] text-lg font-semibold py-2 rounded-xl cursor-pointer hover:bg-[#EEEEEE]/80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pending ? "Signing up..." : "Signup"}
          </Button>
        </form>
        <div className="flex flex-col items-center justify-between gap-4 w-full text-gray-200 text-lg font-medium">
          <div className="text-center mt-2">
            <p>
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-[#EEEEEE] underline font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                tabIndex={pending ? -1 : 0}
                aria-disabled={pending}
                replace
              >
                Signin
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="rounded-full rounded-tr-none overflow-hidden hidden xl:block relative">
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
