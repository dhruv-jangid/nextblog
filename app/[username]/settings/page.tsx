"use client";

import { useActionState, useState } from "react";
import { removeUser } from "@/actions/handleUser";
import { HiOutlineUser, HiOutlineCog6Tooth } from "react-icons/hi2";
import { Button } from "@/components/button";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
      {children}
    </div>
  );
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState<"profile" | "account">("profile");
  const [error, action, isPending] = useActionState(removeUser, null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
        <div className="bg-[#121212] rounded-2xl p-4 h-fit">
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

        <div className="bg-[#121212] rounded-2xl p-6 md:p-8">
          {activeTab === "profile" ? (
            <Section
              title="Profile Settings"
              description="Update your profile information and customize how others see you."
            >
              <div className="space-y-6">
                <div className="grid gap-6 pt-6">
                  {/* Profile settings form to be implemented */}
                  <p className="text-gray-400">
                    Profile settings coming soon...
                  </p>
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

            {error && (
              <div className="bg-red-800 px-4 py-2 rounded-xl text-lg">
                {error}
              </div>
            )}
            <div className="flex gap-4 justify-end mt-4">
              <Button
                disabled={isPending}
                onClick={() => setShowConfirmation(false)}
              >
                Stay on Metapress
              </Button>
              <form action={action}>
                <button
                  className="px-3 py-1.5 rounded-xl cursor-pointer border border-red-500 text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isPending}
                >
                  {isPending ? "Deleting..." : "Delete Account"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
