import Link from "next/link";

export default function Navbar() {
  return (
    <div className="text-2xl flex justify-between items-center px-8 py-6 sticky top-0 z-50 backdrop-blur-lg rounded-b-2xl">
      <h1 className="font-semibold text-2xl">BlogLust</h1>
      <div className="flex gap-8 items-center text-xl">
        <Link href="/">Home</Link>
        <Link href="/blogs">Blogs</Link>
        <Link href="/contact">Contact</Link>
        <Link
          href="/login"
          className="bg-[#EEEEEE] text-black px-3 py-1 rounded-lg"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
