import { useState, useEffect } from "react";
import { User, Post } from "../types";
import { apiRequest } from "../utils/api";
import { LayoutDashboard, FileText, MessageSquare, Heart, PlusSquare, ArrowRight, UserCog, History, BookOpen } from "lucide-react";
import { motion } from "motion/react";

interface DashboardViewProps {
  currentUser: User | null;
  onNavigate: (page: any, postId?: string) => void;
  onAddToast: (text: string, type: "success" | "error") => void;
}

export default function DashboardView({ currentUser, onNavigate, onAddToast }: DashboardViewProps) {
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Local counts computed from state
  const [totalLikes, setTotalLikes] = useState(0);

  useEffect(() => {
    if (!currentUser) return;

    async function loadDashboardStats() {
      setLoading(true);
      try {
        const postsData = await apiRequest(`/posts?authorId=${currentUser.id}&sortBy=createdAt&sortDir=desc`);
        setUserPosts(postsData.content);
        
        // Sum total likes received
        const sumLikes = postsData.content.reduce((sum: number, p: Post) => sum + (p.likesCount || 0), 0);
        setTotalLikes(sumLikes);
      } catch (err) {
        console.error("Error loading dashboard stats", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardStats();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Access Denied</h3>
        <p className="text-sm text-gray-500 mt-2">Please sign in to view your user dashboard.</p>
        <button onClick={() => onNavigate("login")} className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-xl">
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div id="user-dashboard" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left space-y-10 animate-in fade-in duration-300">
      
      {/* 1. Header greeting */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-150 dark:border-gray-900 pb-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.profileImage}
            alt={currentUser.username}
            className="w-14 h-14 rounded-2xl object-cover border border-gray-200 bg-gray-50"
          />
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Welcome back, {currentUser.name}!
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Member since {new Date(currentUser.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })} • @{currentUser.username}
            </p>
          </div>
        </div>

        <button
          id="dashboard-create-btn"
          onClick={() => onNavigate("create-post")}
          className="flex items-center gap-1.5 px-4 h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/10 cursor-pointer"
        >
          <PlusSquare className="w-4 h-4" /> Write Article
        </button>
      </div>

      {/* 2. Numeric Statistics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-gray-950 p-6 rounded-2xl border border-gray-150 dark:border-gray-900 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Articles Written</span>
            <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">{userPosts.length}</h3>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 p-6 rounded-2xl border border-gray-150 dark:border-gray-900 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Likes Received</span>
            <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">{totalLikes}</h3>
          </div>
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 rounded-xl">
            <Heart className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 p-6 rounded-2xl border border-gray-150 dark:border-gray-900 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Discussion Influence</span>
            <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">Active</h3>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-xl">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Split: Quick Actions & Recent Posts list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Quick Actions */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Quick Shortcuts</h3>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => onNavigate("my-posts")}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-900 rounded-2xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:border-indigo-200 hover:text-indigo-600 dark:hover:border-indigo-950 cursor-pointer transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-500" />
                Manage Published Articles
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate("profile")}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-900 rounded-2xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:border-indigo-200 hover:text-indigo-600 dark:hover:border-indigo-950 cursor-pointer transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                <UserCog className="w-4 h-4 text-emerald-500" />
                Update Profile Settings
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate("blog")}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-900 rounded-2xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:border-indigo-200 hover:text-indigo-600 dark:hover:border-indigo-950 cursor-pointer transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                Explore Articles Directory
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right column: Recent posts authored */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-500" /> Recent Activity
            </h3>
            <button
              onClick={() => onNavigate("my-posts")}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              View All {userPosts.length} Articles
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 dark:bg-gray-900 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : userPosts.length === 0 ? (
            <div className="p-10 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-gray-950/10 text-center text-gray-400 space-y-3">
              <FileText className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-sm">You haven't written any articles yet.</p>
              <button
                onClick={() => onNavigate("create-post")}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md"
              >
                Publish Your First Post
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {userPosts.slice(0, 3).map((post) => (
                <div
                  key={post.id}
                  className="p-4 bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-900 rounded-2xl flex items-center justify-between gap-4 group hover:border-indigo-100/50 dark:hover:border-indigo-950 transition-colors"
                >
                  <div className="flex items-center gap-3 truncate">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-12 h-12 rounded-xl object-cover bg-gray-100 flex-shrink-0"
                    />
                    <div className="truncate text-left">
                      <h4
                        onClick={() => onNavigate("post-details", post.id)}
                        className="font-bold text-gray-900 dark:text-white hover:text-indigo-600 cursor-pointer truncate"
                      >
                        {post.title}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">
                        Published {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })} • {post.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      id={`edit-shortcut-${post.id}`}
                      onClick={() => onNavigate("edit-post", post.id)}
                      className="px-3 py-1.5 border border-gray-250 dark:border-gray-850 hover:bg-gray-50 dark:hover:bg-gray-900 text-xs font-bold rounded-xl text-gray-600 dark:text-gray-300 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onNavigate("post-details", post.id)}
                      className="p-1.5 rounded-xl text-gray-400 hover:text-indigo-600 cursor-pointer"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
