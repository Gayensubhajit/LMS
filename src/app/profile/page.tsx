"use client";

// Force recompile to fix potential 404 issue.

import { useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  ArrowLeft,
  X,
  User,
  ShoppingBag,
  Settings,
  Globe,
  ChevronRight,
  Bell,
  Award,
  HelpCircle,
  LogOut,
} from "lucide-react";
import Navbar from "@/components/lms/Navbar";
import Footer from "@/components/lms/Footer";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const avatarUrl = user?.imageUrl;
  const initials = user
    ? (user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? "") ||
      user.emailAddresses[0]?.emailAddress[0]?.toUpperCase() ||
      "?"
    : "";

  const accountItems = [
    { label: "Profile", href: "/profile/edit", icon: User },
    { label: "My Purchases", href: "/my-courses", icon: ShoppingBag },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  const accountItems2 = [
    { label: "Updates", href: "/updates", icon: Bell },
    { label: "Accomplishments", href: "/accomplishments", icon: Award },
    { label: "Help Center", href: "/support", icon: HelpCircle },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 md:pt-24 pb-16">
        <div className="max-w-xl mx-auto px-5">
          {/* Back / Close header */}
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="p-1 text-gray-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* User avatar + info */}
          {isLoaded && user && (
            <div className="flex items-center gap-4 mb-8">
              <div
                className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center border-2 border-violet-500/40"
                style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)" }}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={initials}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-lg font-bold">
                    {initials}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-lg font-bold text-white truncate">
                  {user.fullName ??
                    user.emailAddresses[0]?.emailAddress.split("@")[0]}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {user.emailAddresses[0]?.emailAddress}
                </p>
              </div>
            </div>
          )}

          {/* Your Account heading */}
          <h1 className="text-2xl font-bold text-white mb-6">Your Account</h1>

          {/* Divider */}
          <div
            className="h-px w-full mb-2"
            style={{ background: "rgba(124,58,237,0.2)" }}
          />

          {/* Account menu items */}
          <div className="space-y-0">
            {accountItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-4 py-4 text-gray-300 hover:text-white transition-colors group"
                  style={{
                    borderBottom: "1px solid rgba(124,58,237,0.1)",
                  }}
                >
                  <Icon
                    size={20}
                    className="text-gray-500 group-hover:text-violet-400 transition-colors flex-shrink-0"
                  />
                  <span className="text-[15px] font-medium flex-1">
                    {item.label}
                  </span>
                  <ChevronRight
                    size={16}
                    className="text-gray-600 group-hover:text-gray-400 transition-colors"
                  />
                </a>
              );
            })}

            {/* Preferred Language */}
            <button
              type="button"
              className="w-full flex items-center gap-4 py-4 text-gray-300 hover:text-white transition-colors group"
              style={{
                borderBottom: "1px solid rgba(124,58,237,0.1)",
              }}
            >
              <Globe
                size={20}
                className="text-gray-500 group-hover:text-violet-400 transition-colors flex-shrink-0"
              />
              <span className="text-[15px] font-medium flex-1 text-left">
                Preferred language: English
              </span>
              <ChevronRight
                size={16}
                className="text-gray-600 group-hover:text-gray-400 transition-colors"
              />
            </button>

            {accountItems2.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-4 py-4 text-gray-300 hover:text-white transition-colors group"
                  style={{
                    borderBottom: "1px solid rgba(124,58,237,0.1)",
                  }}
                >
                  <Icon
                    size={20}
                    className="text-gray-500 group-hover:text-violet-400 transition-colors flex-shrink-0"
                  />
                  <span className="text-[15px] font-medium flex-1">
                    {item.label}
                  </span>
                  <ChevronRight
                    size={16}
                    className="text-gray-600 group-hover:text-gray-400 transition-colors"
                  />
                </a>
              );
            })}

            {/* Log Out */}
            <button
              type="button"
              onClick={() => void signOut({ redirectUrl: "/" })}
              className="w-full flex items-center gap-4 py-4 text-red-400 hover:text-red-300 transition-colors group"
            >
              <LogOut
                size={20}
                className="flex-shrink-0"
              />
              <span className="text-[15px] font-medium">Log Out</span>
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
