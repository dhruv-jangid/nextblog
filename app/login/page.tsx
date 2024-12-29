import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function Login() {
  return (
    <div className="grid grid-cols-2">
      <div className="flex flex-col items-center justify-center gap-8 w-1/2 place-self-center text-nowrap">
        <h1 className="text-3xl font-bold">Sign In to BlogLust</h1>
        <form className="flex flex-col items-center justify-center gap-6 w-full text-gray-200">
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="username" className="text-lg font-medium">
              Username
            </label>
            <input
              type="text"
              className="w-full py-1.5 px-3 border bg-transparent border-gray-500 rounded-md focus:-outline-offset-2"
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="password" className="text-lg font-medium">
              Password
            </label>
            <input
              type="password"
              className="w-full p-1.5 px-3 border bg-transparent border-gray-500 rounded-md focus:-outline-offset-2"
            />
          </div>
          <button
            type="submit"
            className="bg-[#EEEEEE] text-[#0f0f0f] text-lg font-semibold w-full px-3 py-1.5 rounded-md hover:bg-[#EEEEEE]/80 transition-all duration-300"
          >
            Login
          </button>
          <div className="grid grid-cols-4 place-items-center w-full">
            <hr className="w-full border-gray-500" />
            <h3 className="col-span-2 text-lg font-medium">Or continue with</h3>
            <hr className="w-full border-gray-500" />
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
          src="/images/login2.jpg"
          alt="The adventure begins"
          width={600}
          height={600}
          priority={true}
          sizes="(max-width: 768px) 100vw, 50vw"
          className=""
        />
      </div>
    </div>
  );
}
