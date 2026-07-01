import { useState, useEffect } from "react";
import { User, Post } from "../types";
import { apiRequest } from "../utils/api";
import { ArrowLeft, Edit2, Trash2, Eye, Plus, FileText, Search } from "lucide-react";

interface MyPostsViewProps {
  currentUser: User | null;
  onNavigate: (page: any, postId?: string) => void;
  onAddToast: (text: string, type: "success" | "error") => void;
}

export default function MyPostsView({ currentUser, onNavigate, onAddToast }: MyPostsViewProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchMyPosts = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await apiRequest(`/posts?authorId=${currentUser.id}&sortBy=createdAt&sortDir=desc`);
      setPosts(data.content);
    } catch (err) {
      console.error("Error loading my posts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, [currentUser]);

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this article? This action is permanent.")) return;

    try {
      await apiRequest(`/posts/${postId}`, "DELETE");
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      onAddToast("Article deleted successfully.", "success");
    } catch (err: any) {
      onAddToast(err.message || "Failed to delete article.", "error");
    }
  };

  const filteredPosts = posts.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Access Denied</h3>
        <p className="text-sm text-gray-500 mt-2">Please sign in to view your publications.</p>
        <button onClick={() => onNavigate("login")} className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-xl">
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div id="my-posts-container" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left space-y-8 animate-in fade-in duration-300">
      
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-150 dark:border-gray-900 pb-6">
        <div className="space-y-1">
          <button
            onClick={() => onNavigate("dashboard")}
            className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-indigo-600 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">My Articles</h1>
          <p className="text-sm text-gray-500">Edit, review, or delete publications you've authored.</p>
        </div>

        <button
          id="write-new-btn-my-posts"
          onClick={() => onNavigate("create-post")}
          className="flex items-center justify-center gap-1.5 px-4 h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/15 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Publish New Story
        </button>
      </div>

      {/* Search Filter input */}
      {posts.length > 0 && (
        <div className="relative max-w-sm">
          <input
            id="my-posts-search"
            type="text"
            placeholder="Search my posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-gray-950 px-4 py-2.5 pl-10 rounded-xl border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs text-gray-800 dark:text-gray-100"
          />
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
        </div>
      )}

      {/* Main listing display */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-150 dark:bg-gray-900 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="p-16 border border-dashed border-gray-250 dark:border-gray-850 rounded-3xl bg-gray-50/50 dark:bg-gray-950/10 text-center max-w-xl mx-auto space-y-4">
          <FileText className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">You Haven't Published Any Stories Yet</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Share your expertise, experiences, or thoughts on technology, development, or design with our global community.
          </p>
          <button
            onClick={() => onNavigate("create-post")}
            className="mt-6 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
          >
            Create Your First Article
          </button>
        </div>
      ) : filteredPosts.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-10">No matching posts found for your search criteria.</p>
      ) : (
        /* Table Layout for Desktop / List for Mobile */
        <div className="bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-900 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-150 dark:border-gray-900">
                  <th className="p-4 pl-6">Article Details</th>
                  <th className="p-4">Domain Category</th>
                  <th className="p-4">Date Published</th>
                  <th className="p-4 text-center">Likes</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-150 dark:divide-gray-900">
                {filteredPosts.map((post) => (
                  <tr key={post.id} id={`my-post-row-${post.id}`} className="hover:bg-gray-50/40 dark:hover:bg-gray-900/25 transition-colors">
                    {/* Details Column */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                        />
                        <div className="truncate max-w-sm">
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

                    {/* Category Column */}
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                        {post.category}
                      </span>
                    </td>

                    {/* Published Date */}
                    <td className="p-4 text-gray-500 text-xs">
                      {formatDate(post.createdAt)}
                    </td>

                    {/* Likes Count */}
                    <td className="p-4 text-center font-mono font-bold text-gray-700 dark:text-gray-300">
                      {post.likesCount || 0}
                    </td>

                    {/* Action buttons */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          id={`view-btn-${post.id}`}
                          onClick={() => onNavigate("post-details", post.id)}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 rounded-xl transition-colors cursor-pointer"
                          title="View Live Post"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          id={`edit-btn-${post.id}`}
                          onClick={() => onNavigate("edit-post", post.id)}
                          className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20 rounded-xl transition-colors cursor-pointer"
                          title="Modify Post"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          id={`delete-btn-${post.id}`}
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors cursor-pointer"
                          title="Delete Post"
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
