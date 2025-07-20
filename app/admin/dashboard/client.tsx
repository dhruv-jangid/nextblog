"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/context/toastProvider";
import { useAlertDialog } from "@/context/alertProvider";
import { deleteUserByAdmin } from "@/actions/handleAdmin";

export const DeleteUserBtn = ({ userId }: { userId: string }) => {
  const { show } = useAlertDialog();
  const [loading, setLoading] = useState(false);
  const { toast, success, error: errorToast } = useToast();

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
          onConfirm: async () => {
            setLoading(true);
            try {
              toast({ title: "Deleting..." });
              await deleteUserByAdmin({ userId });
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
          },
        })
      }
    >
      <Trash2 size={18} />
    </Button>
  );
};
