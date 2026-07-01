import { useState, useEffect } from "react";
import { User, AdminStats } from "../types";
import { apiRequest } from "../utils/api";
import AdminStatsPanel from "../components/AdminStatsPanel";
import { ShieldAlert, Users, FileText, Settings, ArrowRight, BookOpen, Layers } from "lucide-react";

interface AdminDashboardViewProps {
  currentUser: User | null;
  onNavigate: (page: any) => void;
  onAddToast: (text: string, type: "success" | "error") => void;
}

export default function AdminDashboardView({ currentUser, onNavigate, onAddToast }: AdminDashboardViewProps) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser || currentUser.role !== "ADMIN") return;

    async function loadStats() {
      setLoading(true);
      try {
        const data = await apiRequest("/admin/stats");
        setStats(data);
      } catch (err) {
        console.error("Error loading admin stats", err);
        onAddToast("Failed to fetch administrative statistics.", "error");
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [currentUser]);

  if (!currentUser || currentUser.role !== "ADMIN") {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
          <ShieldAlert className="w-6 h-6 text-rose-500" /> Access Denied
        </h3>
        <p className="text-sm text-gray-500 mt-2">Only system administrators can access this view dashboard.</p>
        <button onClick={() => onNavigate("home")} className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-xl">
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div id="admin-dashboard" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left space-y-10 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="border-b border-gray-150 dark:border-gray-900 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
          <Settings className="w-7 h-7 text-indigo-600 animate-spin-slow" /> Administrator Console
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitor system metrics, manage database contents, promote authors, and perform moderate tasks.
        </p>
      </div>

      {/* Admin Stats Bento Block */}
      {loading ? (
        <div className="h-96 bg-gray-100 dark:bg-gray-900 rounded-3xl animate-pulse" />
      ) : (
        stats && <AdminStatsPanel stats={stats} />
      )}

      {/* Quick Administration Controls Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-500" /> Global Management Tools
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Manage Users Card */}
          <div className="bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-900 p-6 rounded-2xl shadow-sm space-y-4 hover:border-indigo-100 dark:hover:border-indigo-900 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-gray-900 dark:text-white text-base">User Directory & Roles</h4>
                <p className="text-xs text-gray-500">Manage registered accounts, change roles (USER/ADMIN), or remove members.</p>
              </div>
            </div>
            
            <button
              id="admin-manage-users-btn"
              onClick={() => onNavigate("admin-users")}
              className="w-full flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-900 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 text-xs font-bold text-gray-700 dark:text-gray-300 rounded-xl cursor-pointer transition-colors"
            >
              <span>Manage User Directory</span>
              <ArrowRight className="w-4 h-4 text-indigo-600" />
            </button>
          </div>

          {/* Manage Posts Card */}
          <div className="bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-900 p-6 rounded-2xl shadow-sm space-y-4 hover:border-indigo-100 dark:hover:border-indigo-900 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 rounded-xl">
                <FileText className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-gray-900 dark:text-white text-base">Global Content Moderation</h4>
                <p className="text-xs text-gray-500">Review all published articles across domains and delete content violating policies.</p>
              </div>
            </div>

            <button
              id="admin-manage-posts-btn"
              onClick={() => onNavigate("admin-posts")}
              className="w-full flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-900 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 text-xs font-bold text-gray-700 dark:text-gray-300 rounded-xl cursor-pointer transition-colors"
            >
              <span>Manage Articles & Publications</span>
              <ArrowRight className="w-4 h-4 text-indigo-600" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
