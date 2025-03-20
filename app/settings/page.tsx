import { Profile } from "@/components/settings/profile";
import { Account } from "@/components/settings/account";
import { UserRound, Cog } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Settings({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const activeTab = params.tab || "profile";

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 tracking-tight">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <div className="flex flex-col gap-6">
        <div className="border-b border-neutral-800">
          <nav className="flex gap-1">
            <Link
              href="settings?tab=profile"
              className={`px-6 py-3 text-base cursor-pointer transition-colors relative ${
                activeTab === "profile"
                  ? "text-rose-300 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-rose-300"
                  : "text-neutral-400 hover:text-rose-300"
              }`}
            >
              <span className="flex items-center gap-2">
                <UserRound size={20} />
                Profile
              </span>
            </Link>
            <Link
              href="settings?tab=account"
              className={`px-6 py-3 text-base cursor-pointer transition-colors relative ${
                activeTab === "account"
                  ? "text-rose-300 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-rose-300"
                  : "text-neutral-400 hover:text-rose-300"
              }`}
            >
              <span className="flex items-center gap-2">
                <Cog size={20} />
                Account
              </span>
            </Link>
          </nav>
        </div>

        <div className="bg-neutral-900 rounded-4xl p-6 md:p-8">
          {activeTab === "profile" ? (
            <Section
              title="Profile Settings"
              description="Update your profile information"
            >
              <Profile data={session.user} />
            </Section>
          ) : (
            <Section
              title="Account Settings"
              description="Manage your account preferences and security settings."
            >
              <Account />
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

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
    <div className="flex flex-col md:min-h-[70vh]">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-rose-300">{title}</h3>
        <p className="text-neutral-400">{description}</p>
      </div>
      {children}
    </div>
  );
};
