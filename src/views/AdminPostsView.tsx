import { useState, useEffect } from "react";
import { User, Post } from "../types";
import { apiRequest } from "../utils/api";
import { ArrowLeft, Trash2, Eye, Search, SlidersHorizontal, BookOpen } from "lucide-react";

interface AdminPostsViewProps {
  currentUser: User | null;
  onNavigate: (page: any, postId?: string) => void;
  onAddToast: (text: string, type: "success" | "error") => void;
}

export default function AdminPostsView({ currentUser, onNavigate, onAddToast }: AdminPostsViewProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Pull all system posts
      const data = await apiRequest("/posts?sortBy=createdAt&sortDir=desc&size=50");
      setPosts(data.content);
    } catch (err) {
      console.error("Error fetching system posts", err);
      onAddToast("Failed to retrieve system publication entries.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser || currentUser.role !== "ADMIN") return;
    fetchPosts();
  }, [currentUser]);

  const handleDeletePost = async (post: Post) => {
    if (
      !confirm(
        `MODERATION ACTION:\nAre you sure you want to delete the article:\n"${post.title}"?\n\nThis will permanently delete it and all related comments/likes. This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await apiRequest(`/posts/${post.id}`, "DELETE");
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
      onAddToast("Article has been successfully moderated and deleted.", "success");
    } catch (err: any) {
      onAddToast(err.message || "Failed to moderate article.", "error");
    }
  };

  const filteredPosts = posts.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.author?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
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
        <p className="text-sm text-gray-500 mt-2">Only administrators can access the system moderation panel.</p>
        <button onClick={() => onNavigate("home")} className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-xl">
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div id="admin-posts-view" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="border-b border-gray-150 dark:border-gray-900 pb-6 space-y-2">
        <button
          onClick={() => onNavigate("admin-dashboard")}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-indigo-600 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admin Console
        </button>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">Global Content Moderation</h1>
        <p className="text-sm text-gray-500">Monitor all publications across BlogSphere, review author details, and delete inappropriate content.</p>
      </div>

      {/* Search Input box */}
      {posts.length > 0 && (
        <div className="relative max-w-sm">
          <input
            id="admin-post-search"
            type="text"
            placeholder="Search articles by title, author name, category..."
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
      ) : filteredPosts.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-10">No publications indexed match your search query.</p>
      ) : (
        <div className="bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-900 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-150 dark:border-gray-900">
                  <th className="p-4 pl-6">Article Information</th>
                  <th className="p-4">Author Details</th>
                  <th className="p-4">Domain Category</th>
                  <th className="p-4">Date Published</th>
                  <th className="p-4 text-center">Likes Count</th>
                  <th className="p-4 pr-6 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-150 dark:divide-gray-900">
                {filteredPosts.map((post) => (
                  <tr key={post.id} id={`admin-post-row-${post.id}`} className="hover:bg-gray-50/40 dark:hover:bg-gray-900/25 transition-colors">
                    {/* Title */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                        />
                        <div className="truncate max-w-xs">
                          <h4
                            onClick={() => onNavigate("post-details", post.id)}
                            className="font-bold text-gray-900 dark:text-white hover:text-indigo-600 hover:underline cursor-pointer truncate"
                          >
                            {post.title}
                          </h4>
                          <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">ID: {post.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Author */}
                    <td className="p-4">
                      {post.author ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={post.author.profileImage}
                            alt={post.author.username}
                            className="w-6 h-6 rounded-full object-cover border bg-gray-50"
                          />
                          <div>
                            <p className="font-semibold text-xs text-gray-800 dark:text-gray-200">{post.author.name}</p>
                            <p className="text-[10px] text-gray-400">@{post.author.username}</p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Anonymous Author</span>
                      )}
                    </td>

                    {/* Category */}
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                        {post.category}
                      </span>
                    </td>

                    {/* Date Published */}
                    <td className="p-4 text-gray-500 text-xs">
                      {formatDate(post.createdAt)}
                    </td>

                    {/* Likes */}
                    <td className="p-4 text-center font-mono font-bold text-gray-750">
                      {post.likesCount || 0}
                    </td>

                    {/* Moderation Controls */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          id={`admin-view-post-${post.id}`}
                          onClick={() => onNavigate("post-details", post.id)}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 rounded-xl transition-colors cursor-pointer"
                          title="Review Live Article"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <button
                          id={`admin-delete-post-${post.id}`}
                          onClick={() => handleDeletePost(post)}
                          className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors cursor-pointer"
                          title="Delete Violating Content"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
