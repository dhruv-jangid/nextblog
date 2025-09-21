"use client";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ZodError } from "zod";
import { useState } from "react";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { emailSchema } from "@/lib/schemas/auth";
import { getFirstZodError } from "@/lib/schemas/other";

export const ForgetPassword = ({
  loading,
  setLoading,
}: {
  loading: boolean;
  setLoading: (v: boolean) => void;
}) => {
  const [email, setEmail] = useState("");

  const forgetPassword = async () => {
    setLoading(true);
    try {
      emailSchema.parse(email);

      const { error } = await authClient.forgetPassword({
        email,
        redirectTo: "/resetpassword",
      });
      if (error) {
        throw new Error(error.message);
      }

      toast.success("Check your email for password reset link");
    } catch (error) {
      if (error instanceof ZodError) {
        toast.info(getFirstZodError(error));
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
      setEmail("");
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="text-sm text-muted-foreground underline underline-offset-4 cursor-pointer">
        Forget password?
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter your registered email</DialogTitle>
          <DialogDescription>
            A reset password link will be sent to this email
          </DialogDescription>
        </DialogHeader>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          autoFocus
          maxLength={255}
          disabled={loading}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
        <DialogFooter>
          <Button
            type="button"
            disabled={loading || !email.trim()}
            onClick={forgetPassword}
          >
            Verify <Mail className="-ml-0.5" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
