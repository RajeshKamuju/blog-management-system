import { useState } from "react";
import { User } from "../types";
import { 
  BookOpen, 
  Menu, 
  X, 
  User as UserIcon, 
  LogOut, 
  PlusSquare, 
  LayoutDashboard, 
  FolderEdit, 
  Users, 
  FileText, 
  Sun, 
  Moon, 
  ChevronDown 
} from "lucide-react";

interface NavbarProps {
  currentUser: User | null;
  onLogout: () => void;
  currentRoute: string;
  onNavigate: (page: any, postId?: string) => void;
  darkMode: boolean;
  onToggleTheme: () => void;
}

export default function Navbar({
  currentUser,
  onLogout,
  currentRoute,
  onNavigate,
  darkMode,
  onToggleTheme
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleNavClick = (page: string, postId?: string) => {
    onNavigate(page, postId);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  const isActive = (page: string) => {
    return currentRoute === page ? "text-indigo-600 dark:text-indigo-400 font-semibold" : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400";
  };

  return (
    <nav id="app-navbar" className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              id="nav-logo"
              onClick={() => handleNavClick("home")}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-600/20 group-hover:bg-indigo-700 transition-all duration-300">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white transition-colors duration-300">
                Blog<span className="text-indigo-600 dark:text-indigo-400">Sphere</span>
              </span>
            </button>

            {/* Desktop Nav Items */}
            <div className="hidden md:flex ml-10 items-center space-x-8 text-sm font-medium">
              <button id="nav-home" onClick={() => handleNavClick("home")} className={`cursor-pointer ${isActive("home")}`}>
                Home
              </button>
              <button id="nav-blog" onClick={() => handleNavClick("blog")} className={`cursor-pointer ${isActive("blog")}`}>
                Articles
              </button>
              <button id="nav-about" onClick={() => handleNavClick("about")} className={`cursor-pointer ${isActive("about")}`}>
                About
              </button>
            </div>
          </div>

          {/* Desktop Right Side (Auth & Theme) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              id="theme-toggle"
              onClick={onToggleTheme}
              className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-500 dark:text-gray-400 cursor-pointer transition-colors"
              title="Toggle Light/Dark Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {currentUser ? (
              <div className="relative flex items-center gap-3">
                {/* Write Article Link */}
                <button
                  id="nav-write"
                  onClick={() => handleNavClick("create-post")}
                  className="flex items-center gap-1.5 px-4 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/10 cursor-pointer transition-all duration-300"
                >
                  <PlusSquare className="w-4 h-4" />
                  Write
                </button>

                {/* Profile dropdown trigger */}
                <div className="relative">
                  <button
                    id="profile-dropdown-btn"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-full border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-all"
                  >
                    <img
                      src={currentUser.profileImage}
                      alt={currentUser.username}
                      className="w-8 h-8 rounded-full object-cover bg-gray-100 border border-gray-100 dark:border-gray-800"
                    />
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setProfileDropdownOpen(false)} />
                      <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-900 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-900">
                          <p className="text-xs text-gray-400 dark:text-gray-500">Logged in as</p>
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{currentUser.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">@{currentUser.username}</p>
                          {currentUser.role === "ADMIN" && (
                            <span className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                              Administrator
                            </span>
                          )}
                        </div>

                        <button
                          id="menu-dashboard"
                          onClick={() => handleNavClick("dashboard")}
                          className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-gray-400" />
                          User Dashboard
                        </button>
                        
                        <button
                          id="menu-profile"
                          onClick={() => handleNavClick("profile")}
                          className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors"
                        >
                          <UserIcon className="w-4 h-4 text-gray-400" />
                          Profile Settings
                        </button>

                        <button
                          id="menu-my-posts"
                          onClick={() => handleNavClick("my-posts")}
                          className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors"
                        >
                          <FolderEdit className="w-4 h-4 text-gray-400" />
                          My Articles
                        </button>

                        {/* Admin Exclusive Menu section */}
                        {currentUser.role === "ADMIN" && (
                          <div className="border-t border-gray-100 dark:border-gray-900 my-1 pt-1">
                            <p className="px-4 py-1.5 text-[10px] font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
                              Admin Controls
                            </p>
                            <button
                              id="menu-admin-dashboard"
                              onClick={() => handleNavClick("admin-dashboard")}
                              className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 cursor-pointer transition-colors"
                            >
                              <LayoutDashboard className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                              Admin Dashboard
                            </button>
                            <button
                              id="menu-admin-users"
                              onClick={() => handleNavClick("admin-users")}
                              className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 cursor-pointer transition-colors"
                            >
                              <Users className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                              Manage Users
                            </button>
                            <button
                              id="menu-admin-posts"
                              onClick={() => handleNavClick("admin-posts")}
                              className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 cursor-pointer transition-colors"
                            >
                              <FileText className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                              Manage Posts
                            </button>
                          </div>
                        )}

                        <div className="border-t border-gray-100 dark:border-gray-900 my-1 pt-1">
                          <button
                            id="menu-logout"
                            onClick={() => {
                              onLogout();
                              setProfileDropdownOpen(false);
                            }}
                            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  id="nav-login"
                  onClick={() => handleNavClick("login")}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors"
                >
                  Sign In
                </button>
                <button
                  id="nav-register"
                  onClick={() => handleNavClick("register")}
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/10 cursor-pointer transition-all duration-300"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger trigger */}
          <div className="flex items-center md:hidden gap-3">
            {/* Theme Toggle Mobile */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-500 dark:text-gray-400 transition-colors"
            >
              {darkMode ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-indigo-600" />}
            </button>

            <button
              id="mobile-menu-trigger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 space-y-3 transition-colors duration-300">
          <div className="space-y-1">
            <button
              onClick={() => handleNavClick("home")}
              className={`flex w-full px-3 py-2 rounded-xl text-base font-semibold ${isActive("home")}`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick("blog")}
              className={`flex w-full px-3 py-2 rounded-xl text-base font-semibold ${isActive("blog")}`}
            >
              Articles
            </button>
            <button
              onClick={() => handleNavClick("about")}
              className={`flex w-full px-3 py-2 rounded-xl text-base font-semibold ${isActive("about")}`}
            >
              About
            </button>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 pt-3 my-2">
            {currentUser ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-1">
                  <img
                    src={currentUser.profileImage}
                    alt={currentUser.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-sm leading-none">{currentUser.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">@{currentUser.username}</p>
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <button
                    onClick={() => handleNavClick("create-post")}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl"
                  >
                    <PlusSquare className="w-4 h-4 text-indigo-500" />
                    Write New Article
                  </button>
                  <button
                    onClick={() => handleNavClick("dashboard")}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl"
                  >
                    <LayoutDashboard className="w-4 h-4 text-gray-400" />
                    User Dashboard
                  </button>
                  <button
                    onClick={() => handleNavClick("profile")}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl"
                  >
                    <UserIcon className="w-4 h-4 text-gray-400" />
                    Profile Settings
                  </button>
                  <button
                    onClick={() => handleNavClick("my-posts")}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl"
                  >
                    <FolderEdit className="w-4 h-4 text-gray-400" />
                    My Articles
                  </button>

                  {currentUser.role === "ADMIN" && (
                    <div className="pt-2">
                      <p className="px-3 py-1 text-[10px] font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
                        Admin Controls
                      </p>
                      <button
                        onClick={() => handleNavClick("admin-dashboard")}
                        className="flex w-full items-center gap-2.5 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-xl"
                      >
                        <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                        Admin Dashboard
                      </button>
                      <button
                        onClick={() => handleNavClick("admin-users")}
                        className="flex w-full items-center gap-2.5 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-xl"
                      >
                        <Users className="w-4 h-4 text-indigo-500" />
                        Manage Users
                      </button>
                      <button
                        onClick={() => handleNavClick("admin-posts")}
                        className="flex w-full items-center gap-2.5 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-xl"
                      >
                        <FileText className="w-4 h-4 text-indigo-500" />
                        Manage Posts
                      </button>
                    </div>
                  )}

                  <button
                    onClick={onLogout}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 px-3">
                <button
                  onClick={() => handleNavClick("login")}
                  className="w-full py-2.5 border border-gray-200 dark:border-gray-800 text-sm font-semibold rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavClick("register")}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold rounded-xl text-white shadow-md shadow-indigo-600/10 transition-colors"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
