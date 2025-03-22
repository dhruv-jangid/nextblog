"use client";

import Google from "@/public/images/google.png";
import Github from "@/public/images/github.png";
import { Eye, EyeClosed } from "lucide-react";
import Greeting from "@/public/images/greeting.jpg";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { credentialSignUp, socialAuth } from "@/actions/handleAuth";
import { Button } from "@/components/button";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="grid xl:grid-cols-2 h-[80vh]">
      <div className="flex flex-col items-center justify-center gap-4 w-2/3 lg:w-1/2 place-self-center text-nowrap">
        <div className="flex items-center justify-center gap-4 w-full">
          <Button
            disabled={pending}
            onClick={async () => {
              setError(null);
              setPending(true);
              const error = await socialAuth("google");
              if (error) {
                setPending(false);
                setError(error);
              }
            }}
          >
            <Image src={Google} alt="Google's icon" width={16} height={16} />
            Google
          </Button>
          <Button
            onClick={async () => {
              setError(null);
              setPending(true);
              const error = await socialAuth("github");
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
          </Button>
        </div>

        <div className="flex items-center justify-evenly w-full">
          <hr className="w-1/3 border-neutral-800" />
          <h3 className="text-lg font-medium px-1.5 text-neutral-400">or</h3>
          <hr className="w-1/3 border-neutral-800" />
        </div>

        {error && (
          <div className="px-3.5 py-2 leading-tight text-pretty text-center text-red-500 bg-red-500/10 border border-red-500/50 rounded-4xl">
            {error}
          </div>
        )}

        <form
          className="flex flex-col items-center justify-center gap-4 w-full"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setPending(true);

            const { slug, email, password } = e.currentTarget;

            const error = await credentialSignUp(
              slug.value,
              email.value,
              password.value
            );
            setPending(false);
            setError(error);
          }}
        >
          <div className="relative flex flex-col gap-3 w-full">
            <input
              type="text"
              className="w-full py-2 px-3.5 leading-tight border border-neutral-800 rounded-4xl focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              id="slug"
              name="slug"
              placeholder="Username"
              required
              disabled={pending}
              maxLength={20}
            />
            <input
              type="email"
              className="w-full py-2 px-3.5 leading-tight border border-neutral-800 rounded-4xl focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              id="email"
              name="email"
              placeholder="Email"
              required
              disabled={pending}
            />
            <input
              type={showPassword ? "text" : "password"}
              className="w-full py-2 px-3.5 leading-tight border border-neutral-800 rounded-4xl focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              id="password"
              name="password"
              placeholder="Password"
              required
              disabled={pending}
              maxLength={20}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-28 -translate-y-1/6 text-neutral-500 hover:text-rose-300 cursor-pointer transition-colors duration-300"
              disabled={pending}
            >
              {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
            </button>
          </div>

          <Button disabled={pending}>
            {pending ? (
              <div className="inline-block h-5 w-5 mt-0.5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            ) : (
              "Sign up"
            )}
          </Button>
        </form>

        <div className="flex justify-center gap-1 w-full text-neutral-400">
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
        </div>
      </div>
      <div className="rounded-full rounded-tr-none overflow-hidden hidden xl:block relative">
        <Image
          src={Greeting}
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
