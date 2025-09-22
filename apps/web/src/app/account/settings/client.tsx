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
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { titleFont } from "@/lib/static/fonts";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { updateUserCache } from "@/actions/handle-cache";

export const AccountClient = () => {
  const [string, setString] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDeleteUser = async () => {
    setLoading(true);
    let toastId: string | number = "";
    try {
      if (string !== "DELETE") {
        throw new Error("Type DELETE");
      }

      toastId = toast.loading("Deleting...");
      const { error } = await authClient.deleteUser({ callbackURL: "/signin" });
      if (error) {
        throw new Error(error.message);
      }

      await updateUserCache();

      toast.success("Deletion confirmation email has been sent");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="mx-auto py-16">
      <h1
        className={`${titleFont.className} text-3xl font-medium pb-10 text-end border-b w-full px-12 lg:px-64`}
      >
        Account Settings
      </h1>

      <div className="flex flex-col gap-12 justify-center mx-12 lg:mx-64 text-lg pt-12 min-h-[70dvh]">
        <div className="flex flex-col gap-4">
          <span className="font-bold text-red-600 text-3xl">Danger Zone</span>
          <Dialog>
            <DialogTrigger className="self-start" asChild>
              <Button variant="destructive">Delete Account</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="text-red-600">
                <DialogTitle>Delete Account</DialogTitle>
                <DialogDescription>
                  Type &quot;DELETE&quot; to permanently delete your account.
                </DialogDescription>
              </DialogHeader>
              <Input
                type="text"
                id="confirmation"
                name="confirmation"
                maxLength={255}
                disabled={loading}
                onChange={(e) => setString(e.currentTarget.value)}
              />
              <DialogFooter>
                <Button
                  disabled={loading || string !== "DELETE"}
                  className="text-base py-5 px-6"
                  onClick={handleDeleteUser}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};
