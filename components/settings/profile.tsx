"use client";

import { changeName, changeSlug } from "@/actions/handleUser";
import { useState } from "react";
import { AtSign, User, Mail, Check, X, PenLine } from "lucide-react";

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
    <div className="w-full">
      {error && (
        <div
          className={`mb-6 px-6 py-4 rounded-4xl border transition-colors ${
            error.success
              ? "border-green-500/20 bg-green-500/5 text-green-500"
              : "border-red-500/20 bg-red-500/5 text-red-500"
          }`}
        >
          <p>{error.message}</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="p-4 rounded-4xl border border-neutral-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AtSign
                size={36}
                className="rounded-full text-sky-400 bg-sky-500/10 p-2"
              />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-neutral-400">
                  Username
                </h3>
                {editingField === "username" ? (
                  <input
                    type="text"
                    value={tempUsername}
                    onChange={(e) => setTempUsername(e.target.value)}
                    spellCheck="false"
                    autoFocus
                    className="text-rose-300 border-b border-neutral-600 w-32 focus:outline-none"
                    maxLength={16}
                  />
                ) : (
                  <p className="text-base font-medium">{data.slug}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {editingField === "username" ? (
                <>
                  <X
                    size={20}
                    onClick={() => {
                      setEditingField(null);
                      setTempUsername(data.slug);
                      setError(null);
                    }}
                    className="text-red-500 hover:text-red-800 cursor-pointer transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    onClick={async () => {
                      setError(null);
                      setIsPending(true);
                      const result = await changeSlug(tempUsername);
                      setEditingField(null);
                      setError(result);
                      setIsPending(false);
                    }}
                    className="mr-2.5 text-green-500 hover:text-green-300 cursor-pointer transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={
                      isPending ||
                      data.slug === tempUsername ||
                      tempUsername.length < 4
                    }
                  >
                    <Check size={20} />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setEditingField("username");
                    setError(null);
                  }}
                  className="mr-2.5 text-rose-300 hover:text-neutral-200 transition-colors cursor-pointer duration-300"
                  disabled={isPending}
                >
                  <PenLine size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-4xl border border-neutral-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User
                size={36}
                className="rounded-full text-purple-400 bg-purple-500/10 p-2"
              />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-neutral-400">
                  Display Name
                </h3>
                {editingField === "displayName" ? (
                  <input
                    type="text"
                    value={tempDisplayName}
                    onChange={(e) => setTempDisplayName(e.target.value)}
                    spellCheck="false"
                    autoFocus
                    className="text-rose-300 border-b border-neutral-600 w-32 focus:outline-none"
                    maxLength={30}
                  />
                ) : (
                  <p className="text-base font-medium">{data.name}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {editingField === "displayName" ? (
                <>
                  <X
                    size={20}
                    onClick={() => {
                      setEditingField(null);
                      setTempDisplayName(data.name);
                      setError(null);
                    }}
                    className="text-red-500 hover:text-red-800 cursor-pointer transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    onClick={async () => {
                      setError(null);
                      setIsPending(true);
                      const result = await changeName(tempDisplayName);
                      setEditingField(null);
                      setError(result);
                      setIsPending(false);
                    }}
                    className="mr-2.5 text-green-500 hover:text-green-300 cursor-pointer transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={isPending || data.name === tempDisplayName}
                  >
                    <Check size={20} />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setEditingField("displayName");
                    setError(null);
                  }}
                  className="mr-2.5 text-rose-300 hover:text-neutral-200 transition-colors duration-300 cursor-pointer"
                  disabled={isPending}
                >
                  <PenLine size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-4xl border border-neutral-700 opacity-60 cursor-not-allowed">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-green-500/10 text-green-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-neutral-400">Email</h3>
              <p className="text-base font-medium">{data.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
