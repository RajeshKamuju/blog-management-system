import React, { useState, useEffect } from "react";
import { User, Post } from "../types";
import { apiRequest } from "../utils/api";
import { ArrowLeft, Save, Sparkles, Image, Check, Trash2 } from "lucide-react";

interface EditPostViewProps {
  postId: string;
  currentUser: User | null;
  onNavigate: (page: any, postId?: string) => void;
  onAddToast: (text: string, type: "success" | "error") => void;
}

const IMAGE_PRESETS = [
  { name: "Code & Dev", url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200" },
  { name: "Workspace", url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200" },
  { name: "Minimal Design", url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1200" },
  { name: "Swiss Alps", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200" },
];

export default function EditPostView({
  postId,
  currentUser,
  onNavigate,
  onAddToast
}: EditPostViewProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Technology");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [tagInput, setTagInput] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPostData() {
      setLoading(true);
      try {
        const post: Post = await apiRequest(`/posts/${postId}`);
        
        // Authorization check
        if (!currentUser || (post.authorId !== currentUser.id && currentUser.role !== "ADMIN")) {
          setError("Access Denied. You are not authorized to edit this article.");
          return;
        }

        setTitle(post.title);
        setCategory(post.category);
        setExcerpt(post.excerpt);
        setContent(post.content);
        setFeaturedImage(post.featuredImage);
        setTagInput(post.tags.join(", "));
        setError(null);
      } catch (err: any) {
        setError("Failed to retrieve the requested article details.");
      } finally {
        setLoading(false);
      }
    }
    loadPostData();
  }, [postId, currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!title.trim() || !content.trim()) {
      onAddToast("Title and content cannot be blank.", "error");
      return;
    }

    setSaving(true);

    const tags = tagInput
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    try {
      await apiRequest(`/posts/${postId}`, "PUT", {
        title,
        content,
        excerpt: excerpt.trim() || undefined,
        featuredImage,
        category,
        tags
      });

      onAddToast("Article updated successfully!", "success");
      onNavigate("post-details", postId);
    } catch (err: any) {
      onAddToast(err.message || "Failed to save article modifications.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to permanently delete this article? This action cannot be undone.")) return;

    try {
      await apiRequest(`/posts/${postId}`, "DELETE");
      onAddToast("Article deleted successfully.", "success");
      onNavigate("dashboard");
    } catch (err: any) {
      onAddToast(err.message || "Failed to delete article.", "error");
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Access Denied</h3>
        <p className="text-sm text-gray-500 mt-2">Please sign in to modify articles.</p>
        <button onClick={() => onNavigate("login")} className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-xl">
          Sign In
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Authorisation Failure</h3>
        <p className="text-sm text-gray-500 mt-2">{error}</p>
        <button onClick={() => onNavigate("dashboard")} className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-xl">
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div id="edit-post-container" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left space-y-8 animate-in fade-in duration-300">
      
      {/* Top action row */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate("post-details", postId)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-indigo-600 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Article
        </button>

        <button
          type="button"
          id="edit-delete-btn"
          onClick={handleDelete}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 rounded-xl cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" /> Delete Article
        </button>
      </div>

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Modify Published Article</h1>
        <p className="text-sm text-gray-500">Edit the title, tags, image, or content body of your article.</p>
      </div>

      {/* Form block */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-900 p-6 sm:p-10 rounded-3xl shadow-sm">
        
        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-900 dark:text-white">Article Title</label>
          <input
            id="edit-post-title"
            type="text"
            required
            placeholder="e.g. Mastering Full-Stack React 19 Core Concepts"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white dark:bg-gray-950 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-lg text-gray-800 dark:text-gray-100"
          />
        </div>

        {/* Category & Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-900 dark:text-white">Domain Category</label>
            <select
              id="edit-post-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white dark:bg-gray-950 p-3 rounded-xl border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-800 dark:text-gray-100"
            >
              <option value="Technology">Technology</option>
              <option value="Programming">Programming</option>
              <option value="Design">Design</option>
              <option value="Travel">Travel</option>
              <option value="Lifestyle">Lifestyle</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-900 dark:text-white">Tags (Comma-separated)</label>
            <input
              id="edit-post-tags"
              type="text"
              placeholder="react, webdev, java, clean-code"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="w-full bg-white dark:bg-gray-950 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-800 dark:text-gray-100"
            />
          </div>
        </div>

        {/* Image Input & Presets */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1">
            <Image className="w-4 h-4 text-indigo-500" /> Featured Image URL
          </label>
          <input
            id="edit-post-image"
            type="url"
            required
            placeholder="https://images.unsplash.com/..."
            value={featuredImage}
            onChange={(e) => setFeaturedImage(e.target.value)}
            className="w-full bg-white dark:bg-gray-950 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-800 dark:text-gray-100 font-mono"
          />

          {/* Preset Buttons Grid */}
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Quick Presets</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {IMAGE_PRESETS.map((preset, index) => {
                const isSelected = featuredImage === preset.url;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setFeaturedImage(preset.url)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all truncate ${
                      isSelected
                        ? "bg-indigo-50 border-indigo-300 text-indigo-600 dark:bg-indigo-950/20"
                        : "bg-gray-50/50 dark:bg-gray-900 border-gray-150 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    <span className="truncate">{preset.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 flex-shrink-0 text-indigo-500" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Excerpt */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-900 dark:text-white">Short Excerpt (Optional)</label>
          <input
            id="edit-post-excerpt"
            type="text"
            placeholder="A brief summary line..."
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full bg-white dark:bg-gray-950 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-800 dark:text-gray-100"
          />
        </div>

        {/* Content body */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-900 dark:text-white">Article Content</label>
            <span className="text-[10px] bg-gray-50 dark:bg-gray-900 border border-gray-150 px-2.5 py-0.5 rounded-full text-gray-400 font-semibold flex items-center gap-0.5">
              <Sparkles className="w-3 h-3 text-indigo-500" /> Markdown Formatting Supported
            </span>
          </div>

          <textarea
            id="edit-post-content"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            className="w-full bg-white dark:bg-gray-950 p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-850 dark:text-gray-100 leading-relaxed font-sans"
          />
        </div>

        {/* Form CTA Row */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-900">
          <button
            type="button"
            onClick={() => onNavigate("post-details", postId)}
            className="px-4 py-2.5 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl text-xs font-semibold text-gray-500 cursor-pointer"
          >
            Cancel Edits
          </button>
          
          <button
            id="edit-save-submit-btn"
            type="submit"
            disabled={saving}
            className="flex items-center gap-1.5 px-6 h-11 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/15 cursor-pointer transition-colors"
          >
            {saving ? (
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <>
                Save Changes <Save className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
