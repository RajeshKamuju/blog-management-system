import { AdminStats } from "../types";
import { FileText, Users, MessageSquare, Heart, TrendingUp, BarChart3 } from "lucide-react";
import { motion } from "motion/react";

interface AdminStatsPanelProps {
  stats: AdminStats;
}

export default function AdminStatsPanel({ stats }: AdminStatsPanelProps) {
  const { summary, popularCategories, authorsStats } = stats;

  // Find max values for percentage bars calculation
  const maxCategoryLikes = Math.max(...popularCategories.map((c) => c.likes), 1);
  const maxAuthorPosts = Math.max(...authorsStats.map((a) => a.posts), 1);

  return (
    <div id="admin-stats-panel" className="space-y-8 text-left">
      {/* 4 Bento Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Posts */}
        <motion.div
          id="stat-posts"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="p-5 bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-900 rounded-2xl shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Articles</span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-none">{summary.posts}</h3>
            <p className="text-[10px] text-emerald-500 font-semibold mt-1.5 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +12% this month
            </p>
          </div>
        </motion.div>

        {/* Total Users */}
        <motion.div
          id="stat-users"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="p-5 bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-900 rounded-2xl shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Members</span>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-none">{summary.users}</h3>
            <p className="text-[10px] text-emerald-500 font-semibold mt-1.5 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +8% registrations
            </p>
          </div>
        </motion.div>

        {/* Total Comments */}
        <motion.div
          id="stat-comments"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="p-5 bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-900 rounded-2xl shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Comments</span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-none">{summary.comments}</h3>
            <p className="text-[10px] text-emerald-500 font-semibold mt-1.5 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +15% discussions
            </p>
          </div>
        </motion.div>

        {/* Total Likes */}
        <motion.div
          id="stat-likes"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="p-5 bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-900 rounded-2xl shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Platform Likes</span>
            <div className="p-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl">
              <Heart className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-none">{summary.likes}</h3>
            <p className="text-[10px] text-emerald-500 font-semibold mt-1.5 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +20% engagement
            </p>
          </div>
        </motion.div>
      </div>

      {/* Split visual data charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Popularity Bar Progress List */}
        <div className="bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-900 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-900 pb-4 mb-6">
            <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h4 className="font-bold text-gray-900 dark:text-white">Likes by Article Category</h4>
          </div>

          <div className="space-y-4">
            {popularCategories.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No category metrics captured yet.</p>
            ) : (
              popularCategories.map((cat, idx) => {
                const percent = Math.round((cat.likes / maxCategoryLikes) * 100);
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-800 dark:text-gray-200">{cat.name}</span>
                      <span className="font-mono text-gray-500 dark:text-gray-400">{cat.likes} Likes ({percent}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-900 h-2.5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.1 }}
                        className="bg-indigo-600 h-full rounded-full"
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Post Authorship Chart */}
        <div className="bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-900 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-900 pb-4 mb-6">
            <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h4 className="font-bold text-gray-900 dark:text-white">Articles Per Author Contribution</h4>
          </div>

          <div className="space-y-4">
            {authorsStats.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No author contribution statistics yet.</p>
            ) : (
              authorsStats.map((auth, idx) => {
                const percent = Math.round((auth.posts / maxAuthorPosts) * 100);
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-800 dark:text-gray-200">{auth.name}</span>
                      <span className="font-mono text-gray-500 dark:text-gray-400">{auth.posts} {auth.posts === 1 ? 'Article' : 'Articles'}</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-900 h-2.5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.1 }}
                        className="bg-emerald-500 h-full rounded-full"
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
