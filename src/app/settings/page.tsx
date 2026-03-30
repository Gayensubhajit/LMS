"use client";

import { useState, useEffect } from "react";
import { useUser, useClerk, SignIn } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Shield,
  CreditCard,
  Settings as SettingsIcon,
  Globe,
  Bell,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  LogOut,
  Trash2,
  Clock,
  Languages,
} from "lucide-react";
import Navbar from "@/components/lms/Navbar";
import Footer from "@/components/lms/Footer";
import {
  getUserSettings,
  updateUserSettings,
  UserSettings,
} from "@/lib/settings-api";
import { dark } from "@clerk/ui/themes";

const sidebarItems = [
  { id: "account", label: "Account", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "preferences", label: "Preferences", icon: Bell },
  { id: "billing", label: "Checkouts", icon: CreditCard },
];

export default function SettingsPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const [activeTab, setActiveTab] = useState("account");
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && user?.id) {
      loadSettings();
    }
  }, [isLoaded, user?.id]);

  async function loadSettings() {
    try {
      if (!user?.id) return;
      const data = await getUserSettings(user.id);
      setSettings(data);
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdate = async (updates: Partial<UserSettings>) => {
    if (!user?.id || !settings) return;
    setSaving(true);
    setSuccess(null);
    try {
      const res = await updateUserSettings(user.id, updates);
      if (res.ok) {
        setSettings({ ...settings, ...updates });
        setSuccess("Settings updated successfully!");
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-[#0a0a16] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-[#080a10] text-white flex items-center justify-center pt-20">
        <SignIn
          appearance={{
            theme: dark,
          }}
        />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#080812] text-white font-sans selection:bg-violet-500/30">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-3 backdrop-blur-xl sticky top-32">
              <div className="p-4 mb-2">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                  Settings Hub
                </h2>
              </div>
              <nav className="space-y-1">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                        isActive
                          ? "bg-violet-500/20 border border-violet-500/30 text-white"
                          : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          size={18}
                          className={
                            isActive
                              ? "text-violet-400"
                              : "text-gray-500 group-hover:text-gray-400"
                          }
                        />
                        <span className="text-sm font-bold tracking-tight">
                          {item.label}
                        </span>
                      </div>
                      {isActive && (
                        <motion.div
                          layoutId="activeDot"
                          className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]"
                        />
                      )}
                    </button>
                  );
                })}
              </nav>

              <div className="mt-8 pt-4 border-t border-white/5 space-y-1 px-1">
                <button
                  onClick={() => signOut({ redirectUrl: "/" })}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-bold text-sm"
                >
                  <LogOut size={18} />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <section className="flex-1">
            <AnimatePresence mode="wait">
              {activeTab === "account" && (
                <motion.div
                  key="account"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="flex justify-between items-end mb-2">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic text-white/90">
                      Account <span className="text-violet-500">Settings</span>
                    </h1>
                    {success && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20"
                      >
                        <CheckCircle2 size={14} />
                        {success}
                      </motion.div>
                    )}
                  </div>

                  {/* Profile Card */}
                  <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-3xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 via-transparent to-transparent pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row gap-10 items-start">
                      {/* Avatar Section */}
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-32 h-32 rounded-full border-4 border-violet-500/20 p-1 relative">
                          <img
                            src={user?.imageUrl}
                            alt={user?.fullName || "User"}
                            className="w-full h-full rounded-full object-cover"
                          />
                          <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-violet-500/50 transition-colors duration-500" />
                        </div>
                        <button className="text-[10px] font-black uppercase tracking-widest text-violet-400 hover:text-white transition-colors">
                          Change Photo
                        </button>
                      </div>

                      {/* Form Section */}
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            defaultValue={user?.fullName || ""}
                            onChange={(e) =>
                              handleUpdate({ fullName: e.target.value })
                            }
                            className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/5 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">
                            Email Address
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              value={
                                user?.primaryEmailAddress?.emailAddress || ""
                              }
                              readOnly
                              className="w-full bg-slate-900/20 border border-white/5 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-500 cursor-not-allowed italic"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                              <Shield
                                size={14}
                                className="text-emerald-500/40"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">
                            Timezone
                          </label>
                          <div className="relative group/input">
                            <select
                              value={settings?.timezone || "UTC"}
                              onChange={(e) =>
                                handleUpdate({ timezone: e.target.value })
                              }
                              className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-10 py-3.5 text-sm font-bold focus:outline-none focus:border-violet-500/50 transition-all appearance-none"
                            >
                              <option value="UTC">
                                UTC (Universal Coordinated Time)
                              </option>
                              <option value="IST">
                                IST (Indian Standard Time)
                              </option>
                              <option value="EST">
                                EST (Eastern Standard Time)
                              </option>
                              <option value="PST">
                                PST (Pacific Standard Time)
                              </option>
                            </select>
                            <Clock
                              size={16}
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-violet-400 transition-colors"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">
                            Preferred Language
                          </label>
                          <div className="relative group/input">
                            <select
                              value={settings?.language || "English"}
                              onChange={(e) =>
                                handleUpdate({ language: e.target.value })
                              }
                              className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-10 py-3.5 text-sm font-bold focus:outline-none focus:border-violet-500/5 transition-all appearance-none"
                            >
                              <option value="English">English</option>
                              <option value="Spanish">Español</option>
                              <option value="French">Français</option>
                              <option value="Hindi">हिन्दी</option>
                            </select>
                            <Languages
                              size={16}
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-violet-400 transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Name Verification Sync */}
                    <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-2.5 rounded-xl border ${settings?.isNameVerified ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-amber-500/10 border-amber-500/30 text-amber-400"}`}
                        >
                          {settings?.isNameVerified ? (
                            <CheckCircle2 size={20} />
                          ) : (
                            <AlertCircle size={20} />
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-black uppercase tracking-tight">
                            Verified Name for Certificates
                          </p>
                          <p className="text-xs text-gray-500 font-medium">
                            {settings?.isNameVerified
                              ? `Verified as: ${settings.verifiedName}`
                              : "Not yet verified. Certificates will use your account name."}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          (window.location.href = "/accomplishments")
                        }
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
                      >
                        Verify Identity <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Dangerous Area */}
                  <div className="pt-8">
                    <div className="bg-red-500/5 border border-red-500/20 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-sm flex flex-col md:flex-row justify-between items-center gap-8">
                      <div className="space-y-2 text-center md:text-left">
                        <h3 className="text-xl font-black uppercase tracking-tight text-red-100">
                          Deactivate Interstellar Core
                        </h3>
                        <p className="text-sm text-red-500/60 max-w-md font-medium">
                          Permanently delete your EduNova profile and all
                          acquisition logs. This action is irreversible.
                        </p>
                      </div>
                      <button className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-red-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-red-500 transition-all shadow-[0_0_20px_rgba(220,38,38,0.2)]">
                        <Trash2 size={18} />
                        Delete Account
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "security" && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                >
                  <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic text-white/90">
                    Security <span className="text-violet-500">Vault</span>
                  </h1>

                  <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <h3 className="text-lg font-black uppercase tracking-tight">
                          Two-Factor Authentication
                        </h3>
                        <p className="text-sm text-gray-500 font-medium max-w-sm">
                          Secure your educational voyages with an extra layer of
                          protection using your mobile device.
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          handleUpdate({
                            twoFactorEnabled: !settings?.twoFactorEnabled,
                          })
                        }
                        className={`relative w-16 h-8 rounded-full transition-colors duration-500 p-1 ${settings?.twoFactorEnabled ? "bg-violet-600" : "bg-white/10"}`}
                      >
                        <motion.div
                          animate={{ x: settings?.twoFactorEnabled ? 32 : 0 }}
                          className="w-6 h-6 rounded-full bg-white shadow-lg"
                        />
                      </button>
                    </div>
                  </div>

                  {/* External Accounts Placeholder */}
                  <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl space-y-8">
                    <h3 className="text-lg font-black uppercase tracking-tight">
                      Connected Nodes
                    </h3>
                    <div className="space-y-4">
                      {["Google", "Apple", "GitHub"].map((node) => (
                        <div
                          key={node}
                          className="flex items-center justify-between py-4 border-b border-white/5 last:border-0"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                              <Globe size={18} className="text-gray-400" />
                            </div>
                            <span className="font-bold tracking-tight">
                              {node}
                            </span>
                          </div>
                          <button className="text-[10px] font-black uppercase tracking-widest text-violet-400">
                            Connect
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "preferences" && (
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic text-white/90">
                    Signal <span className="text-violet-500">Filters</span>
                  </h1>

                  <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <h3 className="text-lg font-black uppercase tracking-tight">
                          Stellar Updates
                        </h3>
                        <p className="text-sm text-gray-500 font-medium max-w-sm">
                          Receive transmissions about new course releases,
                          community challenges, and mastery tips.
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          handleUpdate({
                            newsletterSubscribed:
                              !settings?.newsletterSubscribed,
                          })
                        }
                        className={`relative w-16 h-8 rounded-full transition-colors duration-500 p-1 ${settings?.newsletterSubscribed ? "bg-violet-600" : "bg-white/10"}`}
                      >
                        <motion.div
                          animate={{
                            x: settings?.newsletterSubscribed ? 32 : 0,
                          }}
                          className="w-6 h-6 rounded-full bg-white shadow-lg"
                        />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "billing" && (
                <motion.div
                  key="billing"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8"
                >
                  <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic text-white/90">
                    Acquisition <span className="text-violet-500">Logs</span>
                  </h1>

                  <div className="bg-slate-900/50 border border-white/5 border-dashed rounded-[3rem] p-20 text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/5 shadow-inner">
                      <CreditCard size={32} className="text-gray-600" />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-white/60">
                      No Active Subscriptions
                    </h3>
                    <p className="text-sm text-gray-600 font-medium max-w-xs mx-auto">
                      You haven't initiated any interstellar mastery plans yet.
                    </p>
                    <button
                      onClick={() => (window.location.href = "/pricing")}
                      className="px-8 py-4 rounded-2xl bg-violet-600/20 border border-violet-500/30 text-violet-400 font-black text-[10px] uppercase tracking-widest hover:bg-violet-500/30 transition-all"
                    >
                      Browse Stellar Plans
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
