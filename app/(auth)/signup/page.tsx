"use client";

import Google from "@/public/images/google.png";
import Github from "@/public/images/github.png";
import { Eye, EyeClosed } from "lucide-react";
import auth from "@/public/images/auth.jpg";
import { useState } from "react";
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
            className="flex items-center justify-center gap-2 bg-neutral-900 text-neutral-300 text-lg font-semibold border border-neutral-800 w-full py-2.5 leading-tight rounded-4xl hover:-translate-y-1 hover:translate-x-1 ease-out duration-300 hover:shadow-[-4px_4px_0px_rgba(0,0,0,1)] shadow-rose-300 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="flex items-center justify-center gap-2 bg-neutral-900 text-neutral-300 text-lg font-semibold border border-neutral-800 w-full py-2.5 leading-tight rounded-4xl hover:-translate-y-1 hover:translate-x-1 ease-out duration-300 hover:shadow-[-4px_4px_0px_rgba(0,0,0,1)] shadow-rose-300 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
            <Image
              src={Github}
              alt="Github's icon"
              width={18}
              height={18}
              className="invert"
            />
            Github
          </button>
        </div>

        <div className="flex items-center justify-evenly w-full">
          <hr className="w-1/3 border-neutral-700" />
          <h3 className="text-lg font-medium px-1.5 text-neutral-300">or</h3>
          <hr className="w-1/3 border-neutral-700" />
        </div>

        {error && (
          <div className="px-5 py-2.5 leading-tight text-red-500 bg-red-500/10 border border-red-500/50 rounded-4xl">
            {error}
          </div>
        )}

        <form
          className="flex flex-col items-center justify-center gap-4 w-full text-lg font-medium"
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
          <div className="relative flex flex-col gap-3 w-full">
            <input
              type="text"
              className="w-full py-2.5 px-5 leading-tight border border-neutral-700 rounded-4xl focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              id="slug"
              name="slug"
              placeholder="Username"
              required
              disabled={pending}
            />
            <input
              type="email"
              className="w-full py-2.5 px-5 leading-tight border border-neutral-700 rounded-4xl focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              id="email"
              name="email"
              placeholder="Email"
              required
              disabled={pending}
            />
            <input
              type={showPassword ? "text" : "password"}
              className="w-full py-2.5 px-5 leading-tight border border-neutral-700 rounded-4xl focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              id="password"
              name="password"
              placeholder="Password"
              required
              disabled={pending}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-32 -translate-y-1/6 text-neutral-400 hover:text-rose-300 cursor-pointer"
              disabled={pending}
            >
              {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
            </button>
            <input
              type="password"
              className="w-full py-2.5 px-5 leading-tight border border-neutral-700 rounded-4xl focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              id="passwordConfirm"
              name="passwordConfirm"
              placeholder="Confirm Password"
              required
              disabled={pending}
            />
          </div>

          <button
            disabled={pending}
            className="w-full bg-neutral-900 border border-neutral-800 text-neutral-300 text-lg font-semibold py-2.5 leading-tight rounded-4xl cursor-pointer transition-all hover:-translate-y-1 hover:translate-x-1 ease-out duration-300 hover:shadow-[-4px_4px_0px_rgba(0,0,0,1)] shadow-rose-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pending ? "Signing up..." : "Signup"}
          </button>
        </form>
        <div className="flex flex-col items-center justify-between gap-4 w-full text-neutral-400 text-lg">
          <div className="text-center mt-2">
            <p>
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-neutral-300 underline font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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
