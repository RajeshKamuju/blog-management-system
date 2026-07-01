import { useState, useEffect } from "react";
import { User } from "../types";
import { apiRequest } from "../utils/api";
import { ArrowLeft, UserCheck, Shield, Trash2, Search, ArrowUpDown } from "lucide-react";

interface AdminUsersViewProps {
  currentUser: User | null;
  onNavigate: (page: any) => void;
  onAddToast: (text: string, type: "success" | "error") => void;
}

export default function AdminUsersView({ currentUser, onNavigate, onAddToast }: AdminUsersViewProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await apiRequest("/admin/users");
      setUsers(data);
    } catch (err) {
      console.error("Error loading admin users", err);
      onAddToast("Failed to retrieve system user accounts.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser || currentUser.role !== "ADMIN") return;
    fetchUsers();
  }, [currentUser]);

  const handleRoleToggle = async (targetUser: User) => {
    if (targetUser.id === currentUser?.id) {
      onAddToast("You cannot revoke your own admin permissions.", "error");
      return;
    }

    const nextRole = targetUser.role === "ADMIN" ? "USER" : "ADMIN";
    if (!confirm(`Are you sure you want to change @${targetUser.username}'s role to ${nextRole}?`)) return;

    setUpdatingId(targetUser.id);
    try {
      await apiRequest(`/admin/users/${targetUser.id}/role`, "PUT", { role: nextRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, role: nextRole } : u))
      );
      onAddToast(`Role updated successfully for @${targetUser.username}.`, "success");
    } catch (err: any) {
      onAddToast(err.message || "Failed to update role status.", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = async (targetUser: User) => {
    if (targetUser.id === currentUser?.id) {
      onAddToast("You cannot delete your own admin account.", "error");
      return;
    }

    if (
      !confirm(
        `CRITICAL WARNING:\nAre you sure you want to delete user @${targetUser.username} (${targetUser.name})?\n\nThis will permanently delete their account AND cascade-delete all posts, comments, and likes they've submitted. This cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await apiRequest(`/admin/users/${targetUser.id}`, "DELETE");
      setUsers((prev) => prev.filter((u) => u.id !== targetUser.id));
      onAddToast(`User account @${targetUser.username} has been deleted.`, "success");
    } catch (err: any) {
      onAddToast(err.message || "Failed to delete user account.", "error");
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  if (!currentUser || currentUser.role !== "ADMIN") {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Access Denied</h3>
        <p className="text-sm text-gray-500 mt-2">Only administrators can access user management fields.</p>
        <button onClick={() => onNavigate("home")} className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-xl">
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div id="admin-users-view" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left space-y-8 animate-in fade-in duration-300">
      
      {/* Back & header */}
      <div className="border-b border-gray-150 dark:border-gray-900 pb-6 space-y-2">
        <button
          onClick={() => onNavigate("admin-dashboard")}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-indigo-600 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admin Console
        </button>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">User Directory & Roles</h1>
        <p className="text-sm text-gray-500">View registered accounts, modify credentials role hierarchies, or terminate users.</p>
      </div>

      {/* Search filter panel */}
      {users.length > 0 && (
        <div className="relative max-w-sm">
          <input
            id="admin-user-search"
            type="text"
            placeholder="Search accounts by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-gray-950 px-4 py-2.5 pl-10 rounded-xl border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs text-gray-800 dark:text-gray-100"
          />
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
        </div>
      )}

      {/* Main Grid table */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-150 dark:bg-gray-900 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-10">No users match your filter criteria.</p>
      ) : (
        <div className="bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-900 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-150 dark:border-gray-900">
                  <th className="p-4 pl-6">Registered Member</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4">Role Permission</th>
                  <th className="p-4">Registration Date</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-150 dark:divide-gray-900">
                {filteredUsers.map((user) => {
                  const isSelf = user.id === currentUser.id;
                  return (
                    <tr key={user.id} id={`user-row-${user.id}`} className="hover:bg-gray-50/40 dark:hover:bg-gray-900/25 transition-colors">
                      {/* Name/Username */}
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.profileImage}
                            alt={user.username}
                            className="w-10 h-10 rounded-xl object-cover bg-gray-50 border border-gray-150"
                          />
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white">
                              {user.name} {isSelf && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 ml-1 font-extrabold">You</span>}
                            </h4>
                            <p className="text-xs text-gray-500">@{user.username}</p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="p-4 text-gray-600 dark:text-gray-300 font-medium">
                        {user.email}
                      </td>

                      {/* Role Badge */}
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          user.role === "ADMIN"
                            ? "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/20"
                            : "bg-indigo-50 border-indigo-150 text-indigo-700 dark:bg-indigo-950/20"
                        }`}>
                          <Shield className="w-3 h-3" />
                          {user.role}
                        </span>
                      </td>

                      {/* Created At */}
                      <td className="p-4 text-gray-500 text-xs">
                        {formatDate(user.createdAt)}
                      </td>

                      {/* Admin Actions column */}
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            id={`role-btn-${user.id}`}
                            onClick={() => handleRoleToggle(user)}
                            disabled={isSelf || updatingId === user.id}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 rounded-xl transition-colors disabled:opacity-35 cursor-pointer"
                            title="Toggle user/admin role permission"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                          
                          <button
                            id={`delete-user-${user.id}`}
                            onClick={() => handleDeleteUser(user)}
                            disabled={isSelf}
                            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors disabled:opacity-35 cursor-pointer"
                            title="Delete Account & Cascade"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
