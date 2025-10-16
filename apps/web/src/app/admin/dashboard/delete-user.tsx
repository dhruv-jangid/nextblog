"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useAlertDialog } from "@/components/providers/alertProvider";

export const DeleteUserBtn = ({ userId }: { userId: string }) => {
  const { show } = useAlertDialog();
  const [loading, setLoading] = useState(false);

  const deleteUserAdmin = async () => {
    setLoading(true);
    const toastId = toast.loading("Deleting...");
    try {
      const { error } = await authClient.admin.removeUser({ userId });
      if (error) {
        throw new Error(error.message);
      }

      toast.success(`Deleted user with id: ${userId}`);
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
    <Button
      variant="destructive"
      size="icon"
      disabled={loading}
      onClick={() =>
        show({
          title: "Delete user?",
          description: `ID: ${userId}`,
          actionLabel: "Delete",
          onConfirm: deleteUserAdmin,
        })
      }
    >
      <Trash2 size={18} />
    </Button>
  );
};
