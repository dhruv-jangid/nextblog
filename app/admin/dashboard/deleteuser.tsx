"use client";

import { deleteUserByAdmin } from "@/actions/handleUser";
import { Button } from "@/components/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export const DeleteUserBtn = ({ id, name }: { id: string; name: string }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, setIsPending] = useState(false);

  return (
    <>
      <Button onClick={() => setShowConfirm(true)}>
        <Trash2 size={18} className="stroke-red-500" />
      </Button>
      {showConfirm && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-neutral-900 p-6 rounded-4xl">
            <p className="text-red-500">
              Are you sure you want to delete this user?
            </p>
            <h3 className="text-lg mb-6">{name}</h3>
            <div className="flex justify-end gap-4">
              <Button
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
                roseVariant
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  setIsPending(true);
                  await deleteUserByAdmin(id);
                  setShowConfirm(false);
                  setIsPending(false);
                }}
                disabled={isPending}
              >
                {isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
