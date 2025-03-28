"use client";

import { Button } from "@/components/button";
import { useRouter } from "next/navigation";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();
  console.log(error.message);

  return (
    <div className="h-[80dvh] flex flex-col items-center justify-center gap-6 w-1/2 mx-auto text-center">
      <p className="text-xl">
        It looks like the process took longer than expected or encountered an
        error. If it was just a delay, the issue should be resolved by now. Feel
        free to return to the Home page and try again!
      </p>
      <Button
        onClick={() => {
          router.replace("/");
        }}
        roseVariant
      >
        Return to Home
      </Button>
      <button
        className="hover:opacity-50 transition-all duration-300 cursor-pointer opacity-20"
        onClick={reset}
      >
        Try Again?
      </button>
    </div>
  );
}
