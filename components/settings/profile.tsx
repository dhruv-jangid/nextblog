"use client";

import { changeName, changeSlug } from "@/actions/handleUser";
import { Button } from "@/components/button";
import { useState } from "react";

export const Profile = ({
  data,
}: {
  data: {
    id: string;
    email: string;
    emailVerified: boolean;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    image?: string | null;
    role: string;
    slug: string;
  };
}) => {
  const [editingField, setEditingField] = useState<
    "username" | "displayName" | null
  >(null);
  const [tempUsername, setTempUsername] = useState(data.slug);
  const [tempDisplayName, setTempDisplayName] = useState(data.name);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  return (
    <div className="space-y-6 pt-6">
      {error && (
        <div
          className={`px-4 py-3 border rounded-xl mb-4 ${
            error.success
              ? "border-green-500/20 bg-green-500/5"
              : "border-red-500/20 bg-red-500/5"
          }`}
        >
          <p className={error.success ? "text-green-500" : "text-red-500"}>
            {error.message}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex-1 mr-4">
          {editingField !== "username" && (
            <h3 className="text-lg font-medium">Username</h3>
          )}
          {editingField === "username" ? (
            <input
              type="text"
              value={tempUsername}
              onChange={(e) => setTempUsername(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 bg-transparent"
            />
          ) : (
            <p className="text-sm text-gray-500">{data.slug}</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          {editingField === "username" ? (
            <>
              <Button
                onClick={() => {
                  setError(null);
                  setEditingField(null);
                  setTempUsername(data.slug);
                  setTempDisplayName(data.name);
                }}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                disabled={isPending || data.slug === tempUsername}
                onClick={async () => {
                  setError(null);
                  setIsPending(true);
                  const result = await changeSlug(tempUsername);
                  setEditingField(null);
                  setError(result);
                  setIsPending(false);
                }}
              >
                Save
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                setError(null);
                setEditingField("username");
              }}
              disabled={isPending}
            >
              Change
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1 mr-4">
          {editingField !== "displayName" && (
            <h3 className="text-lg font-medium">Display Name</h3>
          )}
          {editingField === "displayName" ? (
            <input
              type="text"
              value={tempDisplayName}
              onChange={(e) => setTempDisplayName(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 bg-transparent"
            />
          ) : (
            <p className="text-sm text-gray-500">{data.name}</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          {editingField === "displayName" ? (
            <>
              <Button
                onClick={() => {
                  setError(null);
                  setEditingField(null);
                  setTempUsername(data.slug);
                  setTempDisplayName(data.name);
                }}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  setError(null);
                  setIsPending(true);
                  const result = await changeName(tempDisplayName);
                  setEditingField(null);
                  setError(result);
                  setIsPending(false);
                }}
                disabled={isPending || data.name === tempDisplayName}
              >
                Save
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                setError(null);
                setEditingField("displayName");
              }}
              disabled={isPending}
            >
              Change
            </Button>
          )}
        </div>
      </div>
      <div className="cursor-not-allowed opacity-50 flex flex-col">
        <h3 className="text-lg font-medium">Email</h3>
        <p className="text-sm">{data.email}</p>
      </div>
    </div>
  );
};
