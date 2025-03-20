"use client";

import { removeUser } from "@/actions/handleUser";
import { Button } from "@/components/button";
import { useState } from "react";
import { Trash2 } from "lucide-react";

export function Account() {
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>();
  const [pending, setPending] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="px-6 py-5 rounded-4xl border border-neutral-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-red-500">Delete Account</h3>
            <p className="text-neutral-500">
              Once you delete your account, there is no going back. Please be
              certain.
            </p>
          </div>
          <Trash2
            size={18}
            onClick={() => setShowDeleteConfirm(true)}
            className="mr-1.5 text-rose-300 hover:text-neutral-200 cursor-pointer transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50">
          <div className="p-6 rounded-4xl bg-neutral-900 max-w-sm border border-neutral-800">
            <h2 className="text-xl font-semibold mb-1 text-red-800">
              Confirm Delete? 🥺
            </h2>
            <p className="mb-4">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            {error && (
              <div className="bg-red-500/5 px-4 py-2 rounded-2xl border border-red-500/20 text-lg text-red-500 mb-3 leading-tight">
                {error}
              </div>
            )}
            <input
              type="text"
              className="w-full py-1 px-0.5 border-b border-neutral-600 text-lg bg-transparent focus:outline-none mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
              id="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
              disabled={pending}
            />
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setError(null);
                  setPassword("");
                }}
                disabled={pending}
              >
                Cancel
              </Button>
              <button
                onClick={async () => {
                  setError(null);
                  setPending(true);
                  const response = await removeUser(password);
                  setError(response);
                  setPending(false);
                }}
                disabled={pending || password.trim() === ""}
                className="bg-red-800 flex items-center gap-1.5 cursor-pointer hover:bg-neutral-800 hover:text-rose-300 transition-all duration-300 px-3.5 py-2 leading-tight rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
