"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { 
  Users, 
  Search, 
  Shield, 
  UserCircle, 
  GraduationCap,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { backendRequest } from "@/lib/backend-client";
import { format } from "date-fns";

interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
  avatarUrl: string | null;
  createdAt: string;
  _count: {
    enrollments: number;
  };
}

const ROLE_CONFIG = {
  STUDENT: { label: "Student", color: "text-blue-400", bg: "bg-blue-400/10", icon: GraduationCap },
  INSTRUCTOR: { label: "Instructor", color: "text-violet-400", bg: "bg-violet-400/10", icon: UserCircle },
  ADMIN: { label: "Admin", color: "text-emerald-400", bg: "bg-emerald-400/10", icon: Shield },
};

export default function UserManagementPage() {
  const { user: currentUser } = useUser();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await backendRequest<{ ok: boolean; items: UserProfile[] }>("/admin/users", {
        clerkUserId: currentUser?.id,
      });
      if (res.ok) setUsers(res.items);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    if (currentUser?.id) fetchUsers();
  }, [currentUser?.id, fetchUsers]);

  const updateRole = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    try {
      const res = await backendRequest<{ ok: boolean }> (`/admin/users/${userId}/role`, {
        method: "PATCH",
        clerkUserId: currentUser?.id,
        body: { role: newRole },
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole as any } : u));
      }
    } catch (err) {
      console.error("Failed to update role:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-violet-600 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)]">
              <Users className="text-white size-5" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              User Management
            </h1>
          </div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
            Manage permissions and roles for your community
          </p>
        </div>

        <div className="relative group max-w-sm w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-violet-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/5 focus:border-violet-500/50 rounded-2xl pl-12 pr-6 py-3.5 text-sm text-white placeholder-gray-600 transition-all outline-none"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white/5 border border-white/5 rounded-[32px] overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">User Profile</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Current Role</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Enrollments</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Joined Date</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <Loader2 className="w-8 h-8 text-violet-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Synchronizing User Data...</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <AlertCircle className="w-8 h-8 text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">No users found matching your search</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, idx) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 overflow-hidden ring-2 ring-transparent group-hover:ring-violet-500/30 transition-all">
                          {u.avatarUrl ? (
                            <img src={u.avatarUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <UserCircle className="text-gray-600" size={24} />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-black text-white">{u.fullName || "Unnamed User"}</p>
                          <p className="text-xs text-gray-500 font-medium">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/5 ${ROLE_CONFIG[u.role].bg} ${ROLE_CONFIG[u.role].color}`}>
                        {(() => {
                           const Icon = ROLE_CONFIG[u.role].icon;
                           return <Icon size={14} />;
                        })()}
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {ROLE_CONFIG[u.role].label}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                         <BookOpen size={14} className="text-gray-600" />
                         <span className="text-sm font-bold text-gray-300">{u._count.enrollments}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Calendar size={14} />
                        <span className="text-xs font-medium">{format(new Date(u.createdAt), 'MMM dd, yyyy')}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {updatingId === u.id ? (
                           <Loader2 className="w-4 h-4 text-violet-500 animate-spin" />
                        ) : (
                          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
                            {["STUDENT", "INSTRUCTOR", "ADMIN"].map((r) => (
                              <button
                                key={r}
                                onClick={() => updateRole(u.id, r)}
                                disabled={u.role === r}
                                className={`
                                  px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all
                                  ${u.role === r 
                                    ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20" 
                                    : "text-gray-600 hover:text-gray-300 hover:bg-white/5"}
                                `}
                              >
                                {r.slice(0, 3)}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="flex items-center justify-between px-8 text-gray-600">
         <p className="text-[10px] font-bold uppercase tracking-widest">Showing {filteredUsers.length} total users</p>
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500" />
               <span className="text-[10px] font-bold uppercase tracking-widest">Admin Control Active</span>
            </div>
         </div>
      </div>
    </div>
  );
}
