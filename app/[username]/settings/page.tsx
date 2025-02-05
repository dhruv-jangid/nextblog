"use client";

import { Button } from "@/components/button";
import { useActionState, useState } from "react";
import { deleteUser } from "@/actions/handleAuth";
import Form from "next/form";

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
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      {children}
    </div>
  );
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState<"profile" | "account">("profile");
  const [state, action, isPending] = useActionState(deleteUser, null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  return (
    <>
      <div className="grid grid-cols-[1fr_5fr]">
        <div className="border-r border-gray-200 p-4">
          <nav>
            <ul className="space-y-2">
              <li>
                <Button
                  className={`w-full justify-start cursor-pointer text-left rounded-xl py-2 px-3 ${
                    activeTab === "profile" ? "outline outline-[#EEEEEE]" : ""
                  }`}
                  onClick={() => setActiveTab("profile")}
                >
                  Profile
                </Button>
              </li>
              <li>
                <Button
                  className={`w-full justify-start cursor-pointer text-left font-medium rounded-xl py-2 px-3 ${
                    activeTab === "account" ? "outline outline-[#EEEEEE]" : ""
                  }`}
                  onClick={() => setActiveTab("account")}
                >
                  Account
                </Button>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex-1 p-6">
          {activeTab === "profile" ? (
            <Section
              title="Profile Settings"
              description="Manage your profile information"
            >
              <div className="border-t pt-6">
                <h2>Profile Information</h2>
              </div>
            </Section>
          ) : (
            <Section
              title="Account"
              description="Manage your account settings and delete your account"
            >
              <div className="border-t pt-6">
                {state && <h2>{state}</h2>}
                <h4 className="text-sm font-medium text-red-600 mb-2">
                  WARNING! This action is irreversible
                </h4>
                <Button onClick={() => setShowConfirmation(true)}>
                  Delete Account
                </Button>
              </div>
            </Section>
          )}
        </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-[#0F0F0F] p-6 rounded-2xl bg-linear-to-br from-[#191919] from-40% to-transparent max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">
              Confirm Account Deletion
            </h2>
            <div className="text-red-600 mb-4 font-normal">
              <div className="text-gray-600 mb-1 font-medium">
                Deleting your account will remove :
              </div>
              <div>All your blogs</div>
              <div>Your profile information</div>
              <div>Your account settings</div>
            </div>

            <div className="flex gap-4">
              <Button
                className="bg-gray-200 cursor-pointer text-gray-800 hover:bg-gray-300 transition-all duration-300 px-4 py-2 rounded-xl"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </Button>
              <Form action={action}>
                <Button className="bg-red-600 cursor-pointer text-white hover:bg-red-600/80 transition-all duration-300 px-4 py-2 rounded-xl">
                  {isPending ? "Deleting..." : "Delete Account"}
                </Button>
              </Form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
