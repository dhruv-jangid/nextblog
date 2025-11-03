"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export const Logout = () => {
  const router = useRouter();

  const signOut = async () => {
    try {
      await authClient.signOut({}, { throw: true });

      router.push("/signin");
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <Button variant="destructive" className="w-fit" onClick={() => signOut()}>
      Logout
    </Button>
  );
};
