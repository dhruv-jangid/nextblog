"use client";

import { Button } from "@/components/button";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export function Account() {
  const [error, setError] = useState<string | null>();
  const [pending, setPending] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="space-y-6 pt-6">
      <div className="flex flex-col border border-red-500/20 rounded-2xl p-6 bg-red-500/5">
        <h3 className="text-lg font-medium text-red-500">Delete Account</h3>
        <p className="text-sm text-gray-500 mt-2">
          Once you delete your account, there is no going back. Please be
          certain.
        </p>
        <div className="mt-4 text-end">
          <Button disabled={pending} onClick={() => setShowDeleteConfirm(true)}>
            Delete Account
          </Button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#0F0F0F] p-6 rounded-2xl bg-linear-to-br from-[#191919] from-40% to-transparent max-w-sm w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete?</h2>
            <p className="mb-2">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            {error && (
              <div className="bg-red-500/5 px-4 py-3 rounded-2xl border border-red-500/20 text-lg text-red-500 mb-4">
                {error}
              </div>
            )}
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setError(null);
                }}
                disabled={pending}
              >
                Cancel
              </Button>
              <Button
                onClick={async (e) => {
                  e.preventDefault();
                  await authClient.deleteUser(
                    {
                      callbackURL: "/",
                    },
                    {
                      onRequest: () => {
                        setPending(true);
                        setError(null);
                      },
                      onSuccess: async () => {
                        setPending(false);
                        setError("Email has been sent for confirmation!");
                      },
                      onError: (ctx) => {
                        setPending(false);
                        setError(ctx.error.message);
                      },
                    }
                  );
                }}
                disabled={pending}
                className="bg-red-700 cursor-pointer text-white hover:bg-red-700/80 transition-all duration-300 px-3 py-1.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
