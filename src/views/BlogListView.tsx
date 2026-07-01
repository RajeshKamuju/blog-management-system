import React, { useState, useEffect } from "react";
import { Post, CategoryStats } from "../types";
import { apiRequest } from "../utils/api";
import BlogCard from "../components/BlogCard";
import { Search, SlidersHorizontal, BookOpen, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

interface BlogListViewProps {
  onNavigate: (page: any, postId?: string) => void;
  onAddToast: (text: string, type: "success" | "error") => void;
}

export default function BlogListView({ onNavigate, onAddToast }: BlogListViewProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<CategoryStats[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 6;

  // Active tags gathered from posts for sidebar cloud
  const [popularTags, setPopularTags] = useState<string[]>([]);

  // Fetch categories
  useEffect(() => {
    async function loadFilters() {
      try {
        const cats = await apiRequest("/categories");
        setCategories(cats);

        const tagsData = await apiRequest("/tags");
        // Sort tags by count
        tagsData.sort((a: any, b: any) => b.count - a.count);
        setPopularTags(tagsData.slice(0, 10).map((t: any) => t.name));
      } catch (err) {
        console.error("Error loading categories or tags", err);
      }
    }
    loadFilters();
  }, []);

  // Fetch posts when dependencies change
  const fetchPosts = async () => {
    setLoading(true);
    try {
      let url = `/posts?page=${currentPage}&size=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`;
      if (selectedCategory) {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
      }
      if (selectedTag) {
        url += `&tag=${encodeURIComponent(selectedTag)}`;
      }
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }

      const data = await apiRequest(url);
      setPosts(data.content);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
    } catch (err: any) {
      onAddToast(err.message || "Failed to load articles.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage, selectedCategory, selectedTag, sortBy, sortDir]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchPosts();
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedTag("");
    setSortBy("createdAt");
    setSortDir("desc");
    setCurrentPage(0);
  };

  return (
    <div id="blog-list-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left space-y-8">
      {/* Title Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Articles Directory</h1>
        <p className="text-sm text-gray-500">Discover stories, programming tips, and design guides published on BlogSphere.</p>
      </div>

      {/* Grid containing Sidebar and Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Side Filters Sidebar (Desktop) / Dropdowns (Mobile) */}
        <div className="lg:col-span-1 space-y-6">
          {/* 1. Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              id="search-input"
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-gray-950 px-4 py-2.5 pl-10 rounded-xl border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-800 dark:text-gray-100"
            />
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
          </form>

          {/* 2. Categories List */}
          <div className="bg-white dark:bg-gray-950 p-5 rounded-2xl border border-gray-150 dark:border-gray-900 space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-sm pb-2 border-b border-gray-100 dark:border-gray-900">
              <SlidersHorizontal className="w-4 h-4 text-indigo-600" /> Categories
            </h3>
            <div className="flex flex-col gap-1.5 text-sm">
              <button
                id="cat-all-btn"
                onClick={() => { setSelectedCategory(""); setCurrentPage(0); }}
                className={`flex justify-between items-center px-3 py-2 rounded-xl cursor-pointer ${
                  !selectedCategory 
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400 font-bold" 
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900"
                }`}
              >
                <span>All Categories</span>
              </button>
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  id={`cat-btn-${cat.name}`}
                  onClick={() => { setSelectedCategory(cat.name); setSelectedTag(""); setCurrentPage(0); }}
                  className={`flex justify-between items-center px-3 py-2 rounded-xl cursor-pointer ${
                    selectedCategory === cat.name 
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400 font-bold" 
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-xs bg-gray-100 dark:bg-gray-900 px-2 py-0.5 rounded-full text-gray-500 font-medium">{cat.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Popular Tags Cloud */}
          {popularTags.length > 0 && (
            <div className="bg-white dark:bg-gray-950 p-5 rounded-2xl border border-gray-150 dark:border-gray-900 space-y-4">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm pb-2 border-b border-gray-100 dark:border-gray-900">
                Popular Tags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    id={`tag-cloud-btn-${tag}`}
                    onClick={() => { setSelectedTag(tag === selectedTag ? "" : tag); setCurrentPage(0); }}
                    className={`text-xs px-2.5 py-1 rounded-lg border cursor-pointer transition-colors ${
                      selectedTag === tag
                        ? "bg-indigo-600 border-indigo-600 text-white font-bold"
                        : "bg-gray-50 dark:bg-gray-900 border-gray-150 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-indigo-50 hover:text-indigo-600"
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 4. Sorting & Controls */}
          <div className="bg-white dark:bg-gray-950 p-5 rounded-2xl border border-gray-150 dark:border-gray-900 space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm pb-2 border-b border-gray-100 dark:border-gray-900">
              Sort Settings
            </h3>
            <div className="space-y-3 text-sm">
              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-semibold">Sort By</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setCurrentPage(0); }}
                  className="w-full bg-white dark:bg-gray-950 p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-800 dark:text-gray-100"
                >
                  <option value="createdAt">Date Published</option>
                  <option value="likesCount">Likes (Popularity)</option>
                  <option value="title">Alphabetical Title</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-semibold">Order</label>
                <div className="flex gap-2">
                  <button
                    id="sort-dir-desc"
                    onClick={() => { setSortDir("desc"); setCurrentPage(0); }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg border cursor-pointer ${
                      sortDir === "desc"
                        ? "bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/20"
                        : "border-gray-150 dark:border-gray-800 text-gray-500"
                    }`}
                  >
                    Descending
                  </button>
                  <button
                    id="sort-dir-asc"
                    onClick={() => { setSortDir("asc"); setCurrentPage(0); }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg border cursor-pointer ${
                      sortDir === "asc"
                        ? "bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/20"
                        : "border-gray-150 dark:border-gray-800 text-gray-500"
                    }`}
                  >
                    Ascending
                  </button>
                </div>
              </div>

              <button
                id="reset-filters-btn"
                onClick={handleClearFilters}
                className="w-full flex items-center justify-center gap-1.5 py-2 mt-2 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Right Side Main Post Grid */}
        <div className="lg:col-span-3 space-y-8">
          {/* Active filters summary */}
          {(selectedCategory || selectedTag || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 p-3 bg-indigo-50/50 dark:bg-indigo-950/10 rounded-2xl border border-indigo-100/30">
              <span className="text-xs text-gray-500 font-semibold">Active Criteria:</span>
              {selectedCategory && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-semibold">
                  Category: {selectedCategory}
                </span>
              )}
              {selectedTag && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-semibold">
                  Tag: #{selectedTag}
                </span>
              )}
              {searchQuery && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500 text-white font-semibold truncate max-w-xs">
                  Query: "{searchQuery}"
                </span>
              )}
              <button
                onClick={handleClearFilters}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline ml-auto"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Results Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-96 bg-gray-100 dark:bg-gray-900 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            /* Empty State UI */
            <div id="posts-empty-state" className="flex flex-col items-center justify-center py-20 px-4 border border-dashed border-gray-200 dark:border-gray-800 rounded-3xl bg-gray-50/30 dark:bg-gray-950/10 text-center max-w-xl mx-auto">
              <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Articles Match Your Filters</h3>
              <p className="text-sm text-gray-500 mt-2 max-w-sm">
                Try refining your keyword queries, choosing a different domain category, or clearing the filter cloud to load all articles.
              </p>
              <button
                id="empty-reset-btn"
                onClick={handleClearFilters}
                className="mt-6 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md cursor-pointer"
              >
                Clear Filters & Reset
              </button>
            </div>
          ) : (
            <div id="posts-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <div key={post.id}>
                  <BlogCard
                    post={post}
                    onClick={(postId) => onNavigate("post-details", postId)}
                    onTagClick={(tag) => {
                      setSelectedTag(tag);
                      setCurrentPage(0);
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div id="posts-pagination" className="flex items-center justify-between border-t border-gray-100 dark:border-gray-900 pt-6">
              <button
                id="pagination-prev"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                disabled={currentPage === 0 || loading}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 disabled:opacity-40 cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              
              <span className="text-xs text-gray-500 font-medium">
                Page <span className="font-bold text-gray-900 dark:text-white">{currentPage + 1}</span> of {totalPages}
                <span className="hidden sm:inline"> ({totalElements} total entries)</span>
              </span>

              <button
                id="pagination-next"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                disabled={currentPage >= totalPages - 1 || loading}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 disabled:opacity-40 cursor-pointer transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
