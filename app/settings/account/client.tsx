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
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { titleFont } from "@/lib/static/fonts";
import { Button } from "@/components/ui/button";
import { useToast } from "@/context/toastProvider";
import { updateUserCache } from "@/actions/handleCache";

export const Account = () => {
  const [string, setString] = useState("");
  const [loading, setLoading] = useState(false);
  const { success, error: errorToast } = useToast();

  const handleDeleteUser = async () => {
    setLoading(true);
    try {
      if (string !== "DELETE") {
        throw new Error("Type DELETE");
      }

      const { error } = await authClient.deleteUser({ callbackURL: "/signin" });
      if (error) {
        throw new Error(error.message);
      }

      await updateUserCache();

      success({
        title: "Deletion confirmation email has been sent",
      });
    } catch (error) {
      if (error instanceof Error) {
        errorToast({ title: error.message });
      } else {
        errorToast({ title: "Something went wrong" });
      }
    } finally {
      setLoading(false);
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
          <span className="font-semibold text-red-500 text-3xl">
            Danger Zone
          </span>
          <Dialog>
            <DialogTrigger className="self-start">
              <div className="bg-accent-foreground text-accent text-sm px-3.5 py-2 rounded-2xl cursor-pointer hover:opacity-90">
                Delete Account
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="text-red-500">
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
