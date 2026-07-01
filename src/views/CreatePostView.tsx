import React, { useState } from "react";
import { User } from "../types";
import { apiRequest } from "../utils/api";
import { ArrowLeft, BookOpen, Send, Sparkles, Image, Check } from "lucide-react";
import { motion } from "motion/react";

interface CreatePostViewProps {
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

export default function CreatePostView({ currentUser, onNavigate, onAddToast }: CreatePostViewProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Technology");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState(IMAGE_PRESETS[0].url);
  const [tagInput, setTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!title.trim() || !content.trim()) {
      onAddToast("Title and content are required fields.", "error");
      return;
    }

    setSubmitting(true);

    // Parse tag input: comma separated strings, trimmed and filtered
    const tags = tagInput
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    try {
      const created = await apiRequest("/posts", "POST", {
        title,
        content,
        excerpt: excerpt.trim() || undefined,
        featuredImage,
        category,
        tags
      });

      onAddToast("Article published successfully!", "success");
      onNavigate("post-details", created.id);
    } catch (err: any) {
      onAddToast(err.message || "Failed to publish article.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Access Denied</h3>
        <p className="text-sm text-gray-500 mt-2">Please sign in to write articles.</p>
        <button onClick={() => onNavigate("login")} className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-xl">
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div id="create-post-container" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left space-y-8 animate-in fade-in duration-300">
      
      {/* Back button */}
      <button
        onClick={() => onNavigate("dashboard")}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-indigo-600 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Write a New Article</h1>
        <p className="text-sm text-gray-500">Draft and publish your story onto the BlogSphere index.</p>
      </div>

      {/* Editor Form */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-900 p-6 sm:p-10 rounded-3xl shadow-sm">
        
        {/* Title row */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-900 dark:text-white">Article Title</label>
          <input
            id="create-post-title"
            type="text"
            required
            placeholder="e.g. Mastering Full-Stack React 19 Core Concepts"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white dark:bg-gray-950 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-lg text-gray-800 dark:text-gray-100"
          />
        </div>

        {/* Category Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-900 dark:text-white">Domain Category</label>
            <select
              id="create-post-category"
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
              id="create-post-tags"
              type="text"
              placeholder="react, webdev, java, clean-code"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="w-full bg-white dark:bg-gray-950 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-800 dark:text-gray-100"
            />
          </div>
        </div>

        {/* Featured Image URL & Presets */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1">
            <Image className="w-4 h-4 text-indigo-500" /> Featured Image URL
          </label>
          <input
            id="create-post-image"
            type="url"
            required
            placeholder="https://images.unsplash.com/..."
            value={featuredImage}
            onChange={(e) => setFeaturedImage(e.target.value)}
            className="w-full bg-white dark:bg-gray-950 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-800 dark:text-gray-100 font-mono"
          />

          {/* Preset Buttons Grid */}
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Quick Unsplash Presets</span>
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

        {/* Excerpt row */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-900 dark:text-white">Short Excerpt (Optional)</label>
          <input
            id="create-post-excerpt"
            type="text"
            placeholder="A brief 1-2 sentence summary to display on the article grids..."
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full bg-white dark:bg-gray-950 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-800 dark:text-gray-100"
          />
        </div>

        {/* Content rich text supported */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-900 dark:text-white">Article Content</label>
            <span className="text-[10px] bg-gray-50 dark:bg-gray-900 border border-gray-150 px-2.5 py-0.5 rounded-full text-gray-400 font-semibold flex items-center gap-0.5">
              <Sparkles className="w-3 h-3 text-indigo-500" /> Markdown Formatting Supported
            </span>
          </div>

          <textarea
            id="create-post-content"
            required
            placeholder={`Draft your content here...\n\nUse markdown shortcuts for layout rhythm:\n## Subheading Section\n### Minor Topic Details\n- Bullet item list point`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            className="w-full bg-white dark:bg-gray-950 p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-850 dark:text-gray-100 leading-relaxed font-sans"
          />
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-900">
          <button
            type="button"
            onClick={() => onNavigate("dashboard")}
            className="px-4 py-2.5 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl text-xs font-semibold text-gray-500 cursor-pointer"
          >
            Cancel Draft
          </button>
          
          <button
            id="publish-submit-btn"
            type="submit"
            disabled={submitting}
            className="flex items-center gap-1.5 px-6 h-11 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/15 cursor-pointer transition-colors"
          >
            {submitting ? (
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <>
                Publish Article <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
