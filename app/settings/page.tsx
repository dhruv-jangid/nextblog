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
      <div className="grid grid-cols-1 md:grid-cols-[14rem_1fr] gap-8">
        <div className="bg-[#191919] rounded-2xl p-4 h-fit">
          <nav>
            <ul className="space-y-2">
              <li>
                <Link
                  href="settings?tab=profile"
                  className={`w-full flex items-center gap-2 px-3 py-2 text-base rounded-xl cursor-pointer transition-colors ${
                    activeTab === "profile"
                      ? "bg-white/10 text-white"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <UserRound className="w-5 h-5" />
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  href="settings?tab=account"
                  className={`w-full flex items-center gap-2 px-3 py-2 text-base rounded-xl cursor-pointer transition-colors ${
                    activeTab === "account"
                      ? "bg-white/10 text-white"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Cog className="w-5 h-5" />
                  Account
                </Link>
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
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
      {children}
    </div>
  );
};
