import { useState, useEffect } from "react";
import { User } from "./types";
import { getCurrentUser, clearAuth } from "./utils/api";

// Reusable Layout Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Toast from "./components/Toast";

// Views
import HomeView from "./views/HomeView";
import BlogListView from "./views/BlogListView";
import BlogDetailsView from "./views/BlogDetailsView";
import LoginView from "./views/LoginView";
import RegisterView from "./views/RegisterView";
import AboutView from "./views/AboutView";
import DashboardView from "./views/DashboardView";
import CreatePostView from "./views/CreatePostView";
import EditPostView from "./views/EditPostView";
import MyPostsView from "./views/MyPostsView";
import ProfileView from "./views/ProfileView";
import AdminDashboardView from "./views/AdminDashboardView";
import AdminUsersView from "./views/AdminUsersView";
import AdminPostsView from "./views/AdminPostsView";

interface ToastItem {
  id: string;
  text: string;
  type: "success" | "error" | "info";
}

export default function App() {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  
  // Navigation Routing States
  const [activePage, setActivePage] = useState<string>("home");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // 1. Setup user auth & theme preferences on mount
  useEffect(() => {
    // Auth Check
    const savedUser = getCurrentUser();
    if (savedUser) {
      setCurrentUserState(savedUser);
    }

    // Theme Check
    const savedTheme = localStorage.getItem("blogsphere_theme");
    const preferDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme === "dark" || (!savedTheme && preferDark) ? "dark" : "light";
    
    setTheme(initialTheme);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // 2. Hash Router Event Listener to support native browser refresh/back/forward
  useEffect(() => {
    const parseHash = () => {
      const hash = window.location.hash || "#/home";
      
      if (hash.startsWith("#/post/")) {
        const id = hash.replace("#/post/", "");
        setActivePage("post-details");
        setSelectedPostId(id);
      } else if (hash.startsWith("#/edit-post/")) {
        const id = hash.replace("#/edit-post/", "");
        setActivePage("edit-post");
        setSelectedPostId(id);
      } else {
        const route = hash.replace("#/", "");
        setActivePage(route || "home");
        setSelectedPostId(null);
      }
    };

    // Parse initial route hash
    parseHash();

    // Listen to changes
    window.addEventListener("hashchange", parseHash);
    return () => window.removeEventListener("hashchange", parseHash);
  }, []);

  // Sync state changes back to window hash
  const navigateTo = (page: string, postId?: string) => {
    if (page === "post-details" && postId) {
      window.location.hash = `#/post/${postId}`;
    } else if (page === "edit-post" && postId) {
      window.location.hash = `#/edit-post/${postId}`;
    } else {
      window.location.hash = `#/${page}`;
    }
  };

  // Toggle Theme Utility
  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("blogsphere_theme", nextTheme);
    
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    addToast(`Switched to ${nextTheme} theme.`, "info");
  };

  // Toast Generator
  const addToast = (text: string, type: "success" | "error" | "info") => {
    const newToast: ToastItem = {
      id: Math.random().toString(36).substring(2, 9),
      text,
      type
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Handle logout
  const handleLogout = () => {
    clearAuth();
    setCurrentUserState(null);
    addToast("Logged out successfully.", "success");
    navigateTo("home");
  };

  // Render the matched View
  const renderView = () => {
    switch (activePage) {
      case "home":
        return <HomeView onNavigate={navigateTo} onAddToast={addToast} />;
      case "blog":
        return <BlogListView onNavigate={navigateTo} onAddToast={addToast} />;
      case "post-details":
        return (
          <BlogDetailsView
            postId={selectedPostId || ""}
            currentUser={currentUser}
            onNavigate={navigateTo}
            onAddToast={addToast}
          />
        );
      case "login":
        return (
          <LoginView
            onLoginSuccess={(user) => setCurrentUserState(user)}
            onNavigate={navigateTo}
            onAddToast={addToast}
          />
        );
      case "register":
        return <RegisterView onNavigate={navigateTo} onAddToast={addToast} />;
      case "about":
        return <AboutView />;
      case "dashboard":
        return (
          <DashboardView
            currentUser={currentUser}
            onNavigate={navigateTo}
            onAddToast={addToast}
          />
        );
      case "create-post":
        return (
          <CreatePostView
            currentUser={currentUser}
            onNavigate={navigateTo}
            onAddToast={addToast}
          />
        );
      case "edit-post":
        return (
          <EditPostView
            postId={selectedPostId || ""}
            currentUser={currentUser}
            onNavigate={navigateTo}
            onAddToast={addToast}
          />
        );
      case "my-posts":
        return (
          <MyPostsView
            currentUser={currentUser}
            onNavigate={navigateTo}
            onAddToast={addToast}
          />
        );
      case "profile":
        return (
          <ProfileView
            currentUser={currentUser}
            onProfileUpdate={(updated) => setCurrentUserState(updated)}
            onNavigate={navigateTo}
            onAddToast={addToast}
          />
        );
      case "admin-dashboard":
        return (
          <AdminDashboardView
            currentUser={currentUser}
            onNavigate={navigateTo}
            onAddToast={addToast}
          />
        );
      case "admin-users":
        return (
          <AdminUsersView
            currentUser={currentUser}
            onNavigate={navigateTo}
            onAddToast={addToast}
          />
        );
      case "admin-posts":
        return (
          <AdminPostsView
            currentUser={currentUser}
            onNavigate={navigateTo}
            onAddToast={addToast}
          />
        );
      default:
        return <HomeView onNavigate={navigateTo} onAddToast={addToast} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-black text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        currentRoute={activePage}
        onNavigate={navigateTo}
        darkMode={theme === "dark"}
        onToggleTheme={toggleTheme}
      />

      {/* Main Page Area */}
      <main className="flex-grow pt-16">
        {renderView()}
      </main>

      {/* Cohesive Branding Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Floating Notifications List */}
      <Toast toasts={toasts} onClose={removeToast} />
    </div>
  );
}
