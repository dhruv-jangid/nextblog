"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/providers/toastProvider";
import { useAlertDialog } from "@/components/providers/alertProvider";

export const DeleteUserBtn = ({ userId }: { userId: string }) => {
  const { show } = useAlertDialog();
  const [loading, setLoading] = useState(false);
  const { toast, success, error: errorToast } = useToast();

  const deleteUser = async () => {
    setLoading(true);
    try {
      toast({ title: "Deleting..." });
      const { error } = await authClient.admin.removeUser({ userId });
      if (error) {
        throw new Error(error.message);
      }

      success({ title: `Deleted user with id: ${userId}` });
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
    <Button
      variant="destructive"
      size="icon"
      disabled={loading}
      onClick={() =>
        show({
          title: "Delete user?",
          description: `ID: ${userId}`,
          actionLabel: "Delete",
          onConfirm: deleteUser,
        })
      }
    >
      <Trash2 size={18} />
    </Button>
  );
};
