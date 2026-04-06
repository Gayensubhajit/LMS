"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Users,
  Search,
  Shield,
  UserCircle,
  GraduationCap,
  Sparkles,
  AlertCircle,
  Loader2,
  Calendar,
  BookOpen,
  Mail,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { backendRequest } from "@/lib/backend-client";
import { format } from "date-fns";
import { Montserrat } from "next/font/google";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({ subsets: ["latin"] });

interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN" | "SUPER_ADMIN";
  avatarUrl: string | null;
  createdAt: string;
  _count: {
    enrollments: number;
  };
}

const ROLE_CONFIG = {
  STUDENT: {
    label: "Student",
    color: "text-blue-700 dark:text-[#b8b8ff]",
    bg: "bg-blue-400/10",
    icon: GraduationCap,
  },
  INSTRUCTOR: {
    label: "Instructor",
    color: "text-[#013a63] dark:text-[#61a5c2]",
    bg: "bg-blue-400/10",
    icon: UserCircle,
  },
  ADMIN: {
    label: "Admin",
    color: "text-[#006d77] dark:text-[#23ce6b]",
    bg: "bg-emerald-400/10",
    icon: Shield,
  },
  SUPER_ADMIN: {
    label: "Super Admin",
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-400/10",
    icon: Sparkles,
    border: "border-amber-500/50",
  },
};

export default function UserManagementPage() {
  const { user: currentUser } = useUser();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      const [usersRes, meRes] = await Promise.all([
        backendRequest<{ ok: boolean; items: UserProfile[] }>("/admin/users", {
          clerkUserId: currentUser?.id,
        }),
        backendRequest<{ ok: boolean; item: { role: string } }>("/users/me", {
          clerkUserId: currentUser?.id,
        }),
      ]);

      if (usersRes.ok) setUsers(usersRes.items);
      if (meRes.ok) setCurrentRole(meRes.item.role);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    if (currentUser?.id) fetchUsers();
  }, [currentUser?.id, fetchUsers]);

  const updateRole = async (userId: string, newRole: string) => {
    if (updatingId) return;
    setUpdatingId(userId);
    try {
      const res = await backendRequest<{ ok: boolean }>(
        `/admin/users/${userId}/role`,
        {
          method: "PATCH",
          clerkUserId: currentUser?.id,
          body: { role: newRole },
        },
      );
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, role: newRole as any } : u,
          ),
        );
      }
    } catch (err) {
      console.error("Failed to update role:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (u) =>
          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [users, searchQuery],
  );

  const canManage = (targetUser: UserProfile) => {
    if (currentRole === "SUPER_ADMIN") return true;
    if (currentRole === "ADMIN") {
      // Admin cannot manage Super Admin or other Admins (optional choice)
      return targetUser.role === "STUDENT" || targetUser.role === "INSTRUCTOR";
    }
    return false;
  };

  return (
    <div className="space-y-6 lg:space-y-10 pb-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-[0_10px_20px_rgba(37,99,235,0.2)] dark:shadow-[0_0_20px_rgba(59,130,246,0.4)]">
              <Users className="text-white size-5" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-slate-700 dark:text-white tracking-tight">
              User Management
            </h1>
          </div>
          <p className="text-slate-500 dark:text-gray-500 font-bold uppercase tracking-widest text-[10px]">
            Manage permissions and roles for your community
          </p>
        </div>

        <div className="relative group w-full lg:max-w-sm">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-500 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 focus:border-blue-500/50 dark:focus:border-blue-500/50 rounded-2xl pl-12 pr-6 py-3 lg:py-3.5 text-sm text-slate-700 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 transition-all outline-none shadow-sm dark:shadow-none"
          />
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="py-24 text-center">
          <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-500 dark:text-gray-500 font-bold uppercase tracking-widest text-[10px]">
            Synchronizing Security Layers...
          </p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="py-24 text-center bg-white dark:bg-white/5 rounded-[40px] border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
          <AlertCircle className="w-12 h-12 text-slate-300 dark:text-gray-700 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-gray-500 font-bold uppercase tracking-widest text-[10px]">
            No users found matching your search
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Card View (shown below 1024px) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
            {filteredUsers.map((u, idx) => (
              <motion.div
                key={u.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-6 rounded-[32px] bg-white dark:bg-white/5 border transition-all flex flex-col gap-6 shadow-sm dark:shadow-none ${u.role === "SUPER_ADMIN" ? "border-amber-500/30 bg-amber-50 dark:bg-amber-500/[0.03]" : "border-slate-200 dark:border-white/5"}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center bg-slate-50 dark:bg-white/5 overflow-hidden">
                      {u.avatarUrl ? (
                        <img
                          src={u.avatarUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserCircle
                          className="text-slate-400 dark:text-gray-600"
                          size={32}
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-slate-700 dark:text-white truncate`}>
                        {u.fullName || "Unnamed User"}
                      </p>
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-gray-500">
                        <Mail size={12} />
                        <p className="text-xs font-medium truncate">
                          {u.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${ROLE_CONFIG[u.role].bg} ${ROLE_CONFIG[u.role].color}`}
                  >
                    {(() => {
                      const Icon = ROLE_CONFIG[u.role].icon;
                      return <Icon size={12} />;
                    })()}
                    {ROLE_CONFIG[u.role].label}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-gray-500 mb-1">
                      <BookOpen size={12} />
                      <span className="text-[9px] font-black uppercase tracking-widest">
                        Learning
                      </span>
                    </div>
                    <p className="text-lg font-black text-slate-700 dark:text-white">
                      {u._count.enrollments}{" "}
                      <span className="text-[10px] text-slate-400 dark:text-gray-500 font-bold uppercase">
                        Courses
                      </span>
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-gray-500 mb-1">
                      <Calendar size={12} />
                      <span className="text-[9px] font-black uppercase tracking-widest">
                        Joined
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-700 dark:text-white">
                      {format(new Date(u.createdAt), "MMM yyyy")}
                    </p>
                  </div>
                </div>

                {canManage(u) && (
                  <div className="pt-2 border-t border-white/5">
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(ROLE_CONFIG).map((r) => {
                        const isCurrent = u.role === r;
                        const isSuper = r === "SUPER_ADMIN";
                        // Only Super Admin can promote someone else to Super Admin
                        if (isSuper && currentRole !== "SUPER_ADMIN")
                          return null;

                        return (
                          <button
                            key={r}
                            disabled={isCurrent || updatingId === u.id}
                            onClick={() => updateRole(u.id, r)}
                            className={`
                                flex-1 py-3 rounded-2xl text-[9px] font-black uppercase tracking-[0.1em] transition-all
                                ${
                                  isCurrent
                                    ? "bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30"
                                    : "bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-gray-400 hover:text-slate-700 dark:hover:text-white border border-slate-200 dark:border-white/5"
                                }
                              `}
                          >
                            {ROLE_CONFIG[r as keyof typeof ROLE_CONFIG].label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Desktop Table View (shown above 1024px) */}
          <div className="hidden lg:block bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg overflow-hidden backdrop-blur-3xl shadow-md dark:shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse user-table-custom-scrollbar">
                <thead>
                  <tr className="font-serif border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/2">
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 dark:text-gray-500 uppercase tracking-[0.2em]">
                      Profile Identity
                    </th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 dark:text-gray-500 uppercase tracking-[0.2em]">
                      Security Tier
                    </th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 dark:text-gray-500 uppercase tracking-[0.2em]">
                      Usage
                    </th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 dark:text-gray-500 uppercase tracking-[0.2em]">
                      Membership
                    </th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 dark:text-gray-500 uppercase tracking-[0.2em] text-right">
                      Access Control
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {filteredUsers.map((u, idx) => (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className={`group transition-all ${u.role === "SUPER_ADMIN" ? "bg-amber-500/[0.02]" : "hover:bg-white/[0.02]"}`}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-11 h-11 rounded-2xl border transition-all flex items-center justify-center bg-slate-50 dark:bg-[#0d0d1f] overflow-hidden ${u.role === "SUPER_ADMIN" ? "border-amber-500/50 shadow-[0_5px_15px_rgba(245,158,11,0.15)] dark:shadow-[0_0_15px_rgba(245,158,11,0.2)]" : "border-slate-200 dark:border-white/10"}`}
                          >
                            {u.avatarUrl ? (
                              <img
                                src={u.avatarUrl}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : u.role === "SUPER_ADMIN" ? (
                              <Sparkles className="text-amber-500" size={24} />
                            ) : (
                              <UserCircle
                                className="text-slate-400 dark:text-gray-600"
                                size={24}
                              />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-700 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                              {u.fullName || "Incognito"}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-gray-600 font-bold tracking-tight">
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div
                          className={`inline-flex items-center text-center gap-1.5 px-4 py-2 rounded-2xl border bg-slate-50 dark:bg-transparent dark:border-white/15 border-slate-500/25 ${u.role === "SUPER_ADMIN" ? "border-amber-200 dark:border-amber-500/50" : ""} ${ROLE_CONFIG[u.role].bg} ${ROLE_CONFIG[u.role].color}`}
                        >
                          {(() => {
                            const Icon = ROLE_CONFIG[u.role].icon;
                            return <Icon size={14} />;
                          })()}
                          <span
                            className={`${montserrat.className} text-[10px] font-bold uppercase tracking-[0.2em]`}
                          >
                            {ROLE_CONFIG[u.role].label}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="bg-slate-50 dark:bg-white/5 h-10 w-10 rounded-xl flex items-center justify-center border border-slate-200 dark:border-white/5">
                            <BookOpen
                              size={16}
                              className="text-slate-400 dark:text-gray-500"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-700 dark:text-white">
                              {u._count.enrollments}
                            </p>
                            <p className="text-[9px] text-slate-500 dark:text-gray-600 font-black uppercase">
                              Courses
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3 text-gray-500">
                          <Calendar size={16} />
                          <span className="text-xs font-bold uppercase tracking-widest">
                            {format(new Date(u.createdAt), "MMM yyyy")}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end">
                          {updatingId === u.id ? (
                            <Loader2 className="w-5 h-5 text-violet-500 animate-spin" />
                          ) : canManage(u) ? (
                            <div className="flex items-center gap-1.5 p-1.5 bg-white/[0.03] rounded-2xl border border-white/5">
                              {Object.keys(ROLE_CONFIG).map((roleKey) => {
                                const r = roleKey as keyof typeof ROLE_CONFIG;
                                const isSuper = r === "SUPER_ADMIN";
                                if (isSuper && currentRole !== "SUPER_ADMIN")
                                  return null;

                                return (
                                  <button
                                    key={r}
                                    onClick={() => updateRole(u.id, r)}
                                    disabled={u.role === r}
                                    title={`Promote to ${ROLE_CONFIG[r].label}`}
                                    className={`
                                       px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-sm dark:shadow-none
                                       ${
                                         u.role === r
                                           ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                                           : "text-slate-500 dark:text-gray-600 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-transparent"
                                       }
                                     `}
                                  >
                                    {r === "SUPER_ADMIN"
                                      ? "SUP"
                                      : r.slice(0, 3)}
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-gray-700 px-4">
                              <Shield size={14} />
                              <span className="text-[9px] font-black uppercase tracking-widest">
                                Protected Tier
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Footer Meta */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 lg:px-8 text-gray-600 border-t border-white/5 pt-8 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-violet-600 animate-pulse" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">
            {filteredUsers.length} Directory Records Active
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield size={12} className="text-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              End-to-End Encryption
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
