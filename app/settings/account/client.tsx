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
import { Button } from "@/components/ui/button";
import { deleteUser } from "@/actions/handleUser";
import { useToast } from "@/context/toastProvider";

export function Account() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { success, error: errorToast } = useToast();

  return (
    <div className="flex flex-col gap-12 justify-center mx-12 lg:mx-64 text-lg pt-12 min-h-[70dvh]">
      <div className="flex flex-col gap-4">
        <span className="font-semibold text-red-500 text-3xl">Danger Zone</span>
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
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              maxLength={255}
              disabled={loading}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
            <DialogFooter>
              <Button
                disabled={loading}
                className="text-base py-5 px-6"
                onClick={async () => {
                  setLoading(true);
                  try {
                    await deleteUser({ password });

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
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
