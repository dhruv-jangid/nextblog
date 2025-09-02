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
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { titleFont } from "@/lib/static/fonts";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { updateUserCache } from "@/actions/handleCache";
import { useToast } from "@/components/providers/toastProvider";
import { useAlertDialog } from "@/components/providers/alertProvider";

export const Profile = ({ user }: { user: Session["user"] }) => {
  const [data, setData] = useState({
    username: user.username!,
    name: user.name,
  });
  const router = useRouter();
  const { show } = useAlertDialog();
  const [loading, setLoading] = useState(false);
  const { success, error: errorToast } = useToast();

  const handleUser = async (change: "username" | "name") => {
    setLoading(true);
    try {
      if (change === "username") {
        usernameValidator.parse(data.username);

        const { available } = await authClient.isUsernameAvailable(
          { username: data.username },
          { throw: true }
        );
        if (!available) {
          throw new Error("Username already taken");
        }

        const { error } = await authClient.updateUser({
          username: data.username,
        });
        if (error) {
          throw new Error(error.message);
        }

        await updateUserCache();

        router.refresh();
        success({ title: "Username changed" });
      } else {
        nameValidator.parse(data.username);

        const { error } = await authClient.updateUser({ name: data.name });
        if (error) {
          throw new Error(error.message);
        }

        await updateUserCache();

        router.refresh();
        success({ title: "Name changed" });
      }
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
  };

  const signOut = async () => {
    try {
      await authClient.signOut({}, { throw: true });

      router.push("/signin");
    } catch {
      errorToast({ title: "Something went wrong" });
    }
  };

  return (
    <div className="mx-auto py-16">
      <h1
        className={`${titleFont.className} text-3xl font-medium pb-10 text-end border-b w-full px-12 lg:px-64`}
      >
        Edit Profile
      </h1>
      <div className="flex flex-col gap-12 justify-center mx-12 lg:mx-64 text-lg pt-12 min-h-[70dvh]">
        <div className="flex flex-col gap-1.5">
          <span>Username: {user.username}</span>
          <Dialog>
            <DialogTrigger className="self-start" asChild>
              <Button variant="secondary">Change Username</Button>
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
                  size="sm"
                  disabled={loading || user.username === data.username}
                  className="text-base py-5 px-6"
                  onClick={() => handleUser("username")}
                >
                  Change
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex flex-col gap-1.5">
          <span>Name: {user.name}</span>
          <Dialog>
            <DialogTrigger className="self-start" asChild>
              <Button variant="secondary">Change Name</Button>
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
                  size="sm"
                  disabled={loading || user.name === data.name}
                  className="text-base py-5 px-6"
                  onClick={() => handleUser("name")}
                >
                  Change
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex flex-col gap-1.5">
          <span>Logout from current device</span>
          <Button
            variant="destructive"
            className="w-fit"
            onClick={() =>
              show({
                actionLabel: "Logout",
                cancelLabel: "Stay Here",
                description: "This will only logout from current device.",
                onConfirm: signOut,
              })
            }
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};
