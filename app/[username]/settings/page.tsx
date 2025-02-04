"use client";

import { Button } from "@/components/button";
import { useActionState, useState } from "react";
import { deleteUser } from "@/actions/handleAuth";

function Section({ title, description, children }) {
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

  return (
    <div className="grid grid-cols-[1fr_5fr]">
      <div className="border-r border-gray-200 p-4">
        <nav>
          <ul className="space-y-2">
            <li>
              <Button
                className={`w-full justify-start cursor-pointer text-left rounded-xl py-2 px-3 ${
                  activeTab === "profile" ? "bg-gray-100 text-[#0F0F0F]" : ""
                }`}
                onClick={() => setActiveTab("profile")}
              >
                Profile
              </Button>
            </li>
            <li>
              <Button
                className={`w-full justify-start cursor-pointer text-left font-medium rounded-xl py-2 px-3 ${
                  activeTab === "account" ? "bg-gray-100 text-[#0F0F0F]" : ""
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
          />
        ) : (
          <Section
            title="Account"
            description="Manage your account settings and delete your account"
          >
            <div className="border-t pt-6">
              <h4 className="text-sm font-medium text-red-600">
                WARNING! This action is irreversible
              </h4>
              <form action={action} className="mt-4">
                <Button>Delete Account</Button>
              </form>
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}
