"use client";

import {
  nameValidator,
  getFirstZodError,
  usernameValidator,
} from "@/lib/schemas/shared";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ZodError } from "zod";
import { useState } from "react";
import type { Session } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/context/toastProvider";
import { signOutCurrent } from "@/actions/handleAuth";
import { useAlertDialog } from "@/context/alertProvider";
import { changeName, changeUsername } from "@/actions/handleUser";

export const Profile = ({ user }: { user: Session["user"] }) => {
  const [data, setData] = useState({
    username: user.username!,
    name: user.name,
  });
  const { show } = useAlertDialog();
  const [loading, setLoading] = useState(false);
  const { success, error: errorToast } = useToast();

  return (
    <div className="flex flex-col gap-12 justify-center mx-12 lg:mx-64 text-lg pt-12 min-h-[70dvh]">
      <div className="flex flex-col gap-1.5">
        <span>
          <span className="font-semibold">Username -</span> {user.username}
        </span>
        <Dialog>
          <DialogTrigger className="self-start">
            <div className="bg-accent-foreground text-accent text-sm px-3.5 py-2 rounded-2xl cursor-pointer hover:opacity-90">
              Change Username
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Username</DialogTitle>
            </DialogHeader>
            <Input
              type="text"
              id="username"
              name="username"
              placeholder="Username"
              maxLength={30}
              disabled={loading}
              value={data.username}
              onChange={(e) =>
                setData({ ...data, username: e.currentTarget.value })
              }
            />
            <DialogFooter>
              <Button
                disabled={loading}
                className="text-base py-5 px-6"
                onClick={async () => {
                  setLoading(true);
                  try {
                    usernameValidator.parse(data.username);

                    await changeUsername({ newUsername: data.username });
                    success({ title: "Username changed" });
                  } catch (error) {
                    if (error instanceof ZodError) {
                      errorToast({ title: getFirstZodError(error) });
                    } else if (error instanceof Error) {
                      errorToast({ title: error.message });
                    } else {
                      errorToast({ title: "Something went wrong" });
                    }
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                Change
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col gap-1.5">
        <span>
          <span className="font-semibold">Name -</span> {user.name}
        </span>
        <Dialog>
          <DialogTrigger className="self-start">
            <div className="bg-accent-foreground text-accent text-sm px-3.5 py-2 rounded-2xl cursor-pointer hover:opacity-90">
              Change Name
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Name</DialogTitle>
            </DialogHeader>
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              maxLength={50}
              disabled={loading}
              value={data.name}
              onChange={(e) =>
                setData({ ...data, name: e.currentTarget.value })
              }
            />
            <DialogFooter>
              <Button
                disabled={loading}
                className="text-base py-5 px-6"
                onClick={async () => {
                  setLoading(true);
                  try {
                    nameValidator.parse(data.username);

                    await changeName({ newName: data.name });
                    success({ title: "Name changed" });
                  } catch (error) {
                    if (error instanceof ZodError) {
                      errorToast({ title: getFirstZodError(error) });
                    } else if (error instanceof Error) {
                      errorToast({ title: error.message });
                    } else {
                      errorToast({ title: "Something went wrong" });
                    }
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                Change
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col gap-1.5">
        <span>
          <span className="font-semibold">Logout from current device</span>
        </span>
        <Button
          variant="destructive"
          className="w-fit"
          onClick={() =>
            show({
              actionLabel: "Logout",
              description: "This will only logout from current device.",
              onConfirm: async () => {
                await signOutCurrent();
              },
            })
          }
        >
          Logout
        </Button>
      </div>
    </div>
  );
};
