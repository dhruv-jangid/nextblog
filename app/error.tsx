"use client";

import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  console.log(error);
  console.log(error.message);

  return (
    <div className="h-[80dvh] text-xl flex flex-col items-center justify-center gap-6 w-1/2 mx-auto text-center">
      <p>
        It looks like the process took longer than expected or encountered an
        error. If it was just a delay, the issue should be resolved by now. Feel
        free to return to the Home page and try again!
      </p>
      <Link
        href="/"
        className="px-6 py-2 text-lg bg-white text-gray-900 rounded-2xl hover:bg-white/80 transition-all duration-300"
        replace
      >
        Return to Home
      </Link>
      <button
        className="text-lg hover:opacity-50 transition-all duration-300 cursor-pointer opacity-20"
        onClick={reset}
      >
        Try Again?
      </button>
    </div>
  );
}
