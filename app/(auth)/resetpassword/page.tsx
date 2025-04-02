"use client";

import { resetPassword } from "@/actions/handleAuth";
import { Button } from "@/components/button";
import { notFound, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const token = searchParams.get("token");
  if (!token) notFound();

  return (
    <div className="flex flex-col h-[70dvh] justify-center gap-1 w-1/3 mx-auto">
      {error && (
        <div className="mx-auto bg-red-500/5 text-red-500 leading-tight border border-red-500/10 rounded-4xl py-2 px-4 tracking-tight mb-1.5">
          {error.charAt(0).toUpperCase() + error.slice(1)}
        </div>
      )}
      <input
        type="password"
        className="w-full py-2 px-3.5 leading-tight border border-neutral-800 rounded-4xl focus:outline-hidden mb-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
        id="password"
        name="password"
        placeholder="Enter new password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={pending}
        required
      />
      <Button
        onClick={async () => {
          setError(null);
          setPending(true);
          const error = await resetPassword(password, token);
          setPending(false);
          setError(error);
        }}
      >
        Change password
      </Button>
      <p className="text-neutral-500 text-center mt-12 text-sm">
        *Token is valid for 1 hour only*
      </p>
    </div>
  );
}
