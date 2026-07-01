import { useState, useEffect } from "react";
import { Post, CategoryStats } from "../types";
import { apiRequest } from "../utils/api";
import BlogCard from "../components/BlogCard";
import { ArrowRight, Terminal, Palette, Laptop, Sparkles, Compass, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

interface HomeViewProps {
  onNavigate: (page: any, postId?: string) => void;
  onAddToast: (text: string, type: "success" | "error") => void;
}

export default function HomeView({ onNavigate, onAddToast }: HomeViewProps) {
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<CategoryStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        // Fetch posts with limit of 4
        const postsData = await apiRequest("/posts?page=0&size=4&sortBy=createdAt&sortDir=desc");
        const posts: Post[] = postsData.content;
        
        if (posts.length > 0) {
          setFeaturedPost(posts[0]);
          setRecentPosts(posts.slice(1));
        }

        // Fetch categories counts
        const cats: CategoryStats[] = await apiRequest("/categories");
        setCategories(cats);
      } catch (err: any) {
        console.error("Error loading home data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const getCategoryIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "technology":
        return <Laptop className="w-5 h-5 text-blue-500" />;
      case "programming":
        return <Terminal className="w-5 h-5 text-emerald-500" />;
      case "design":
        return <Palette className="w-5 h-5 text-purple-500" />;
      default:
        return <Compass className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <div id="home-view" className="space-y-20 pb-20">
      {/* 1. Gorgeous Hero Banner */}
      <section className="relative overflow-hidden bg-white dark:bg-gray-950 pt-20 pb-16 transition-colors duration-300">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.08),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 max-w-4xl mx-auto"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30">
              <Sparkles className="w-3.5 h-3.5" /> Introducing BlogSphere Full-Stack
            </span>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.1]">
              Share Your Insights. <br className="hidden sm:inline" />
              Empower the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-400">Developer</span> Community.
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              A high-performance blog platform engineered with React, Spring Boot, MySQL, and JWT Authentication. Clean design paired with robust full-stack architecture.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button
                id="hero-browse-btn"
                onClick={() => onNavigate("blog")}
                className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/20 cursor-pointer flex items-center gap-2 group transition-all duration-300"
              >
                Explore Articles
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                id="hero-write-btn"
                onClick={() => onNavigate("create-post")}
                className="px-6 py-3.5 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
              >
                Write an Article
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Categories Slider */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Popular Domains</h2>
          <p className="text-sm text-gray-400">Browse structured categories with real-time statistics</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 dark:bg-gray-900 rounded-2xl animate-pulse" />
            ))
          ) : categories.length === 0 ? (
            <p className="col-span-full text-center text-sm text-gray-400">No categories found.</p>
          ) : (
            categories.map((cat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02, y: -2 }}
                onClick={() => onNavigate("blog")}
                className="flex items-center gap-4 p-5 bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-900 rounded-2xl cursor-pointer text-left group hover:border-indigo-100 dark:hover:border-indigo-950 transition-all duration-300"
              >
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/20 transition-colors">
                  {getCategoryIcon(cat.name)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">{cat.count} {cat.count === 1 ? 'Article' : 'Articles'}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* 3. Featured Post Section */}
      {featuredPost && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-150 dark:border-gray-900 pb-4 mb-8 text-left">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Story</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl dark:shadow-none transition-all duration-500">
            <div className="lg:col-span-7 h-64 lg:h-[400px] overflow-hidden bg-gray-50 dark:bg-gray-900 cursor-pointer" onClick={() => onNavigate("post-details", featuredPost.id)}>
              <img
                src={featuredPost.featuredImage}
                alt={featuredPost.title}
                className="w-full h-full object-cover hover:scale-102 transition-transform duration-700"
              />
            </div>
            
            <div className="lg:col-span-5 p-6 lg:p-10 text-left space-y-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30">
                {featuredPost.category}
              </span>
              <h3 
                onClick={() => onNavigate("post-details", featuredPost.id)}
                className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors leading-tight"
              >
                {featuredPost.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                {featuredPost.excerpt}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-900">
                {featuredPost.author && (
                  <div className="flex items-center gap-2.5">
                    <img
                      src={featuredPost.author.profileImage}
                      alt={featuredPost.author.username}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs font-semibold text-gray-900 dark:text-white leading-none">{featuredPost.author.name}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">@{featuredPost.author.username}</p>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={() => onNavigate("post-details", featuredPost.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer"
                >
                  Read Story <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Recent Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-gray-150 dark:border-gray-900 pb-4 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Publications</h2>
          <button
            onClick={() => onNavigate("blog")}
            className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer"
          >
            All Articles <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col h-96 bg-gray-100 dark:bg-gray-900 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : recentPosts.length === 0 ? (
          <div className="py-12 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-center text-gray-400">
            No additional articles found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <div key={post.id}>
                <BlogCard
                  post={post}
                  onClick={(postId) => onNavigate("post-details", postId)}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Sleek Technical Architecture Bento Block */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-gray-50 to-indigo-50/20 dark:from-gray-900/40 dark:to-indigo-950/10 border border-gray-150 dark:border-gray-900 rounded-3xl p-8 lg:p-12 text-left">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 mb-4">
              <ShieldCheck className="w-3.5 h-3.5" /> Core Security & Architecture
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
              A Complete Full-Stack Architecture
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">
              Engineered with enterprise patterns, this system decouples user interface execution from secure API validation services.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
            <div className="bg-white dark:bg-gray-950 p-6 rounded-2xl border border-gray-100 dark:border-gray-900/60 shadow-sm">
              <h4 className="font-bold text-gray-900 dark:text-white">Spring Boot Rest APIs</h4>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 leading-relaxed">
                Layered controller-service architecture processing JWT validated payloads under Spring Security filters.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-950 p-6 rounded-2xl border border-gray-100 dark:border-gray-900/60 shadow-sm">
              <h4 className="font-bold text-gray-900 dark:text-white">Hibernate & MySQL</h4>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 leading-relaxed">
                Structured persistent relationships Mapping Users, Articles, Likes, and recursive Comment entities efficiently.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-950 p-6 rounded-2xl border border-gray-100 dark:border-gray-900/60 shadow-sm">
              <h4 className="font-bold text-gray-900 dark:text-white">Type-Safe Client</h4>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 leading-relaxed">
                Responsive, stateful, theme-aware React SPA utilizing Tailwind UI primitives and smooth motion layouts.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
