import { Post } from "../types";
import { Clock, Heart, MessageSquare, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface BlogCardProps {
  post: Post;
  onClick: (postId: string) => void;
  onTagClick?: (tag: string) => void;
}

export default function BlogCard({ post, onClick, onTagClick }: BlogCardProps) {
  // Approximate reading time helper
  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "technology":
        return "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200/50 dark:border-blue-900/30";
      case "programming":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-900/30";
      case "design":
        return "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200/50 dark:border-purple-900/30";
      case "travel":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/50 dark:border-amber-900/30";
      default:
        return "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200/50 dark:border-indigo-900/30";
    }
  };

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  return (
    <motion.article
      id={`blog-card-${post.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col bg-white dark:bg-gray-950 rounded-2xl border border-gray-150 dark:border-gray-900 overflow-hidden shadow-sm hover:shadow-xl dark:shadow-none hover:border-indigo-100 dark:hover:border-indigo-950 transition-all duration-300 group h-full"
    >
      {/* Featured Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-900 cursor-pointer" onClick={() => onClick(post.id)}>
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Category Badge overlay */}
        <div className="absolute top-4 left-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(post.category)} shadow-sm backdrop-blur-md bg-white/70 dark:bg-black/40`}>
            {post.category}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          {/* Metadata */}
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium">
            <span>{formattedDate}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {getReadingTime(post.content)}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 cursor-pointer transition-colors" onClick={() => onClick(post.id)}>
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Tag Badges */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {post.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onTagClick) onTagClick(tag);
                  }}
                  className="text-xs px-2.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400 border border-transparent dark:border-gray-800 transition-colors cursor-pointer"
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer info: Author, Comments, Likes */}
        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-900 mt-6 pt-4">
          {post.author ? (
            <div className="flex items-center gap-2.5">
              <img
                src={post.author.profileImage}
                alt={post.author.username}
                className="w-8 h-8 rounded-full object-cover bg-gray-50"
              />
              <div className="text-left">
                <p className="text-xs font-semibold text-gray-900 dark:text-white leading-none">{post.author.name}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">@{post.author.username}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <span className="text-xs text-gray-400">?</span>
              </div>
              <span className="text-xs text-gray-400">Anonymous</span>
            </div>
          )}

          {/* Likes & Comments stats */}
          <div className="flex items-center gap-3.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
            <span className="flex items-center gap-1.5" title="Likes">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500/10" />
              {post.likesCount}
            </span>
            <span className="flex items-center gap-1.5" title="Comments">
              <MessageSquare className="w-4 h-4 text-indigo-500" />
              {/* Note: backend hydration will supply counts, but for now we'll just show comments or standard counter if mapped */}
              {/* Since comment list is fetched async, we show a read details button which is standard */}
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
