"use client";

import { useRouter } from "next/navigation";
import { mainFont, titleFont } from "@/lib/static/fonts";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <html>
      <body
        className={`${mainFont.className} min-h-[92dvh] flex flex-col items-center justify-center gap-8 w-full text-center pt-48`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="bg-rose-100 text-rose-500 rounded-full p-4">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-alert-triangle"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12" y2="17"></line>
            </svg>
          </div>
          <h1
            className={`${titleFont.className} text-3xl font-medium text-rose-500`}
          >
            Something went wrong
          </h1>
          <p className="text-base text-muted-foreground">
            We&apos;re sorry, but something went wrong.
            <br />
            Please refresh the page or return to the Home page.
            <br />
            If you continue to experience issues, please contact us.
          </p>
        </div>
        <div className="flex flex-col gap-3.5 justify-center items-center mt-1.5">
          <Button size="lg" onClick={() => router.replace("/")}>
            Return to Home
          </Button>
          <Button
            variant="outline"
            className="w-fit opacity-50"
            onClick={reset}
          >
            Try Again
          </Button>
        </div>
        <div className="mt-48 text-sm opacity-30 underline underline-offset-4 break-words">
          {error.message ?? "Something went wrong"}
        </div>
      </body>
    </html>
  );
}
