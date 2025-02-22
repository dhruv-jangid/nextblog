"use client";

import { useActionState, useState, useEffect } from "react";
import { changeSlug, changeName, removeUser } from "@/actions/handleUser";
import { HiOutlineUser, HiOutlineCog6Tooth } from "react-icons/hi2";
import { Button } from "@/components/button";
import { useSession } from "next-auth/react";

const Section = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col min-h-[70vh]">
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
      {children}
    </div>
  );
};

export default function Settings() {
  const { data, update } = useSession();
  const [activeTab, setActiveTab] = useState<"profile" | "account">("profile");
  const [removeUserError, removeUserAction, removeUserIsPending] =
    useActionState(removeUser, null);
  const [changeSlugError, changeSlugAction, changeSlugIsPending] =
    useActionState(changeSlug, null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [editing, setEditing] = useState<"username" | "displayName" | null>(
    null
  );
  const [newUsername, setNewUsername] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      setNewUsername(data.user.slug);
      setNewDisplayName(data.user.name);
    }
  }, [data]);

  const handleNameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    const result = await changeName(newDisplayName!);
    if (result.success) {
      await update({ ...data, user: { ...data?.user, name: newDisplayName } });
      setEditing(null);
    }
    setIsPending(false);
    setMessage(result.message);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
        <div className="bg-[#191919] rounded-2xl p-4 h-fit">
          <nav>
            <ul className="space-y-2">
              <li>
                <button
                  className={`w-full flex items-center gap-2 px-3 py-2 text-base rounded-xl cursor-pointer transition-colors ${
                    activeTab === "profile"
                      ? "bg-white/10 text-white"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                  onClick={() => setActiveTab("profile")}
                >
                  <HiOutlineUser className="w-5 h-5" />
                  Profile
                </button>
              </li>
              <li>
                <button
                  className={`w-full flex items-center gap-2 px-3 py-2 text-base rounded-xl cursor-pointer transition-colors ${
                    activeTab === "account"
                      ? "bg-white/10 text-white"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                  onClick={() => setActiveTab("account")}
                >
                  <HiOutlineCog6Tooth className="w-5 h-5" />
                  Account
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <div className="bg-[#191919] rounded-2xl p-6 md:p-8">
          {activeTab === "profile" ? (
            <Section
              title="Profile Settings"
              description="Update your profile information"
            >
              <div className="space-y-6 pt-6">
                <div className="p-4 border border-yellow-500/20 rounded-xl bg-yellow-500/5 mb-4">
                  <p className="text-yellow-500 text-sm">
                    Note: After changing your username, you will need to sign in
                    again.
                  </p>
                </div>
                {(message || changeSlugError) && (
                  <div className="px-4 py-2 rounded-xl text-lg bg-red-800">
                    {message || changeSlugError?.message}
                  </div>
                )}
                <div className="flex items-center justify-between p-4 border border-white/10 rounded-xl">
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">Username</h4>
                    {editing === "username" ? (
                      <form
                        action={changeSlugAction}
                        className="flex items-center gap-6"
                      >
                        <input
                          type="text"
                          id="slug"
                          name="slug"
                          defaultValue={data?.user.slug}
                          onChange={(e) => setNewUsername(e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg"
                          disabled={isPending || changeSlugIsPending}
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <Button onClick={() => setEditing(null)}>
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={
                              newUsername === data?.user.slug ||
                              isPending ||
                              changeSlugIsPending
                            }
                          >
                            {isPending ? "Saving..." : "Save"}
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <p className="text-sm text-gray-400">{data?.user.slug}</p>
                    )}
                  </div>
                  {!editing && (
                    <Button onClick={() => setEditing("username")}>Edit</Button>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 border border-white/10 rounded-xl">
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">Display Name</h4>
                    {editing === "displayName" ? (
                      <form
                        onSubmit={handleNameChange}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="text"
                          id="name"
                          name="name"
                          defaultValue={data?.user.name}
                          onChange={(e) => setNewDisplayName(e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg"
                          disabled={isPending || changeSlugIsPending}
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <Button onClick={() => setEditing(null)}>
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={
                              newDisplayName === data?.user.name || isPending
                            }
                          >
                            {isPending ? "Saving..." : "Save"}
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <p className="text-sm text-gray-400">{data?.user.name}</p>
                    )}
                  </div>
                  {!editing && (
                    <Button onClick={() => setEditing("displayName")}>
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            </Section>
          ) : (
            <Section
              title="Account Settings"
              description="Manage your account preferences and security settings."
            >
              <div className="space-y-6 pt-6">
                <div className="flex flex-col border border-red-500/20 rounded-2xl p-6 bg-red-500/5">
                  <h4 className="text-lg font-semibold text-red-500 mb-2">
                    Delete Account
                  </h4>
                  <p className="text-gray-400 text-sm mb-4">
                    Once you delete your account, there is no going back. Please
                    be certain.
                  </p>
                  <button
                    className="px-4 py-2 rounded-xl cursor-pointer border border-red-500 text-red-500 hover:bg-red-500/10 transition-colors w-max self-end"
                    onClick={() => setShowConfirmation(true)}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </Section>
          )}
        </div>

        {showConfirmation && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="flex flex-col gap-4 bg-[#121212] p-6 rounded-2xl max-w-md w-full border border-[#222]">
              <div>
                <h2 className="text-xl font-bold">Confirm Account Deletion</h2>
                <p className="text-gray-400">
                  This action cannot be undone. This will:
                </p>
              </div>
              <ul className="flex flex-col text-red-600">
                <li className="flex items-center gap-2">
                  • Permanently delete all your blogs
                </li>
                <li className="flex items-center gap-2">
                  • Remove your profile information
                </li>
                <li className="flex items-center gap-2">
                  • Delete all your account data
                </li>
              </ul>

              {removeUserError && (
                <div className="bg-red-800 px-4 py-2 rounded-xl text-lg">
                  {removeUserError}
                </div>
              )}
              <div className="flex gap-4 justify-end mt-4">
                <Button
                  disabled={removeUserIsPending}
                  onClick={() => setShowConfirmation(false)}
                >
                  Stay on Metapress
                </Button>
                <form action={removeUserAction}>
                  <button
                    className="px-3 py-1.5 rounded-xl cursor-pointer border border-red-500 text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={removeUserIsPending}
                  >
                    {removeUserIsPending ? "Deleting..." : "Delete Account"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
