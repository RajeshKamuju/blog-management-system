import React, { useState } from "react";
import { apiRequest, setAuthToken, setCurrentUser } from "../utils/api";
import { User } from "../types";
import { KeyRound, Mail, ArrowRight, ShieldAlert, BookOpen } from "lucide-react";
import { motion } from "motion/react";

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
  onNavigate: (page: any) => void;
  onAddToast: (text: string, type: "success" | "error") => void;
}

export default function LoginView({ onLoginSuccess, onNavigate, onAddToast }: LoginViewProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiRequest("/auth/login", "POST", { email, password });
      
      // Save credentials in local storage
      setAuthToken(data.token);
      
      const loggedInUser: User = {
        id: data.id,
        name: data.name,
        username: data.username,
        email: data.email,
        role: data.role,
        profileImage: data.profileImage,
        createdAt: data.createdAt
      };
      
      setCurrentUser(loggedInUser);
      onLoginSuccess(loggedInUser);
      onAddToast(`Welcome back, ${loggedInUser.name}!`, "success");
      onNavigate("home");
    } catch (err: any) {
      setError(err.message || "Failed to log in. Please check your credentials.");
      onAddToast("Login failed. Check your password or email.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="login-view" className="min-h-[75vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-950 p-8 sm:p-10 border border-gray-150 dark:border-gray-900 rounded-3xl shadow-sm text-left space-y-6">
        
        {/* Logo and title */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 rounded-2xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Welcome to BlogSphere</h2>
          <p className="text-sm text-gray-500">Sign in to read, write, and respond to stories</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div id="login-error-alert" className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs font-semibold">
            <ShieldAlert className="w-4 h-4 text-rose-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <input
                id="login-email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white dark:bg-gray-950 px-4 py-2.5 pl-10 rounded-xl border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-800 dark:text-gray-100"
              />
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Password</label>
              <a href="#" onClick={(e) => { e.preventDefault(); onAddToast("Demo password for admin: adminpassword | user: password123", "success"); }} className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                id="login-password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white dark:bg-gray-950 px-4 py-2.5 pl-10 rounded-xl border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-800 dark:text-gray-100"
              />
              <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-1.5 px-4 h-11 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/15 cursor-pointer transition-colors"
          >
            {loading ? (
              <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <>
                Sign In <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Redirect options */}
        <div className="text-center pt-2">
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <button
              id="login-register-redirect"
              onClick={() => onNavigate("register")}
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
