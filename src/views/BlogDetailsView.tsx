import { useState, useEffect } from "react";
import { Post, User } from "../types";
import { apiRequest } from "../utils/api";
import CommentSection from "../components/CommentSection";
import { ArrowLeft, Clock, Heart, Share2, Copy, Calendar, Bookmark } from "lucide-react";
import { motion } from "motion/react";

interface BlogDetailsViewProps {
  postId: string;
  currentUser: User | null;
  onNavigate: (page: any, postId?: string) => void;
  onAddToast: (text: string, type: "success" | "error" | "info") => void;
}

export default function BlogDetailsView({
  postId,
  currentUser,
  onNavigate,
  onAddToast
}: BlogDetailsViewProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Like interaction states
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    async function loadPost() {
      setLoading(true);
      try {
        const data = await apiRequest(`/posts/${postId}`);
        setPost(data);
        setLikesCount(data.likesCount || 0);

        // If user is authenticated, query like status
        if (currentUser) {
          try {
            const status = await apiRequest(`/posts/${postId}/like-status`);
            setLiked(status.liked);
          } catch (err) {
            console.error("Error fetching like status", err);
          }
        }
        setError(null);
      } catch (err: any) {
        setError("Article not found or server failed to respond.");
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [postId, currentUser]);

  const handleLikeToggle = async () => {
    if (!currentUser) {
      onAddToast("Please sign in to like articles.", "error");
      onNavigate("login");
      return;
    }

    if (liking) return;
    setLiking(true);

    // Optimistic Update
    const previousLiked = liked;
    const previousCount = likesCount;
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);

    try {
      if (previousLiked) {
        const response = await apiRequest(`/posts/${postId}/unlike`, "DELETE");
        setLikesCount(response.likesCount);
        onAddToast("Post unliked.", "info");
      } else {
        const response = await apiRequest(`/posts/${postId}/like`, "POST");
        setLikesCount(response.likesCount);
        onAddToast("Post liked successfully!", "success");
      }
    } catch (err: any) {
      // Revert if API failed
      setLiked(previousLiked);
      setLikesCount(previousCount);
      onAddToast(err.message || "Failed to process like status.", "error");
    } finally {
      setLiking(false);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/#post/${postId}`;
    navigator.clipboard.writeText(url)
      .then(() => {
        onAddToast("Article link copied to clipboard!", "success");
      })
      .catch(() => {
        onAddToast("Failed to copy link.", "error");
      });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  };

  if (loading) {
    return (
      <div id="details-loader-container" className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div id="details-error-container" className="max-w-md mx-auto py-20 px-4 text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Article Not Found</h3>
        <p className="text-sm text-gray-500 mt-2">{error || "The article you are looking for does not exist or has been deleted."}</p>
        <button
          onClick={() => onNavigate("blog")}
          className="mt-6 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl cursor-pointer"
        >
          Back to Articles
        </button>
      </div>
    );
  }

  return (
    <div id={`blog-details-${post.id}`} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left space-y-8">
      {/* Back button */}
      <button
        id="back-to-articles-btn"
        onClick={() => onNavigate("blog")}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Directory
      </button>

      {/* Main Container */}
      <article className="space-y-8 bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-900 p-6 sm:p-10 rounded-3xl shadow-sm">
        {/* Header Metadata */}
        <div className="space-y-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30">
            {post.category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
            {post.title}
          </h1>

          {/* Author Card Block */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-y border-gray-100 dark:border-gray-900 py-4">
            {post.author ? (
              <div className="flex items-center gap-3">
                <img
                  src={post.author.profileImage}
                  alt={post.author.username}
                  className="w-10 h-10 rounded-full object-cover border border-gray-100 bg-gray-50"
                />
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{post.author.name}</p>
                  <p className="text-xs text-gray-500">@{post.author.username}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                  <span className="text-sm text-gray-400">?</span>
                </div>
                <span className="text-sm text-gray-400">Anonymous Author</span>
              </div>
            )}

            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 font-medium">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                {formatDate(post.createdAt)}
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                {getReadingTime(post.content)}
              </span>
            </div>
          </div>
        </div>

        {/* Big Featured Image */}
        <div className="w-full aspect-[16/9] overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-900">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Body Rendering */}
        <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed font-sans text-[15px] sm:text-[16px] space-y-6">
          {/* Since we support standard content, split by lines and render lists, headers, or paragraphs */}
          {post.content.split("\n\n").map((paragraph, index) => {
            const trimmed = paragraph.trim();
            if (trimmed.startsWith("###")) {
              return (
                <h3 key={index} className="text-xl font-bold text-gray-900 dark:text-white pt-4">
                  {trimmed.replace("###", "").trim()}
                </h3>
              );
            }
            if (trimmed.startsWith("##")) {
              return (
                <h2 key={index} className="text-2xl font-bold text-gray-900 dark:text-white pt-4 border-b border-gray-100 dark:border-gray-900 pb-2">
                  {trimmed.replace("##", "").trim()}
                </h2>
              );
            }
            if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
              return (
                <ul key={index} className="list-disc pl-5 space-y-2 mt-2">
                  {trimmed.split("\n").map((li, i) => (
                    <li key={i}>{li.replace(/^[\s-*]+/, "").trim()}</li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={index} className="whitespace-pre-line">
                {trimmed}
              </p>
            );
          })}
        </div>

        {/* Tags cloud */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-6 border-t border-gray-100 dark:border-gray-900">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-800"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Core Interactions bottom row */}
        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-900 pt-6">
          {/* Like Interaction */}
          <button
            id="details-like-btn"
            onClick={handleLikeToggle}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border cursor-pointer transition-all ${
              liked
                ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900"
                : "bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50"
            }`}
          >
            <Heart className={`w-5 h-5 transition-transform ${liked ? "scale-110 fill-rose-600" : "hover:scale-105"}`} />
            <span>{liked ? "Liked" : "Like Article"}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700" />
            <span className="font-mono">{likesCount}</span>
          </button>

          {/* Share button */}
          <div className="flex items-center gap-2">
            <button
              id="details-share-btn"
              onClick={handleCopyLink}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-500 dark:text-gray-400 cursor-pointer transition-colors"
              title="Copy Article Link"
            >
              <Copy className="w-4.5 h-4.5" />
            </button>
            <button
              id="details-bookmark-btn"
              onClick={() => onAddToast("Article bookmarked locally!", "success")}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-500 dark:text-gray-400 cursor-pointer transition-colors"
              title="Bookmark Article"
            >
              <Bookmark className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Comment system */}
        <CommentSection
          postId={post.id}
          currentUser={currentUser}
          onNavigateToLogin={() => onNavigate("login")}
          onAddToast={(txt, typ) => onAddToast(txt, typ as any)}
        />
      </article>
    </div>
  );
}
