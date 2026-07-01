import React, { useState } from "react";
import { apiRequest } from "../utils/api";
import { UserPlus, Mail, User, KeyRound, ArrowRight, ShieldAlert, BookOpen } from "lucide-react";
import { motion } from "motion/react";

interface RegisterViewProps {
  onNavigate: (page: any) => void;
  onAddToast: (text: string, type: "success" | "error") => void;
}

export default function RegisterView({ onNavigate, onAddToast }: RegisterViewProps) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !username || !email || !password || !confirmPassword) {
      setError("All form fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      onAddToast("Confirm password must match.", "error");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await apiRequest("/auth/register", "POST", {
        name,
        username,
        email,
        password
      });

      onAddToast("Account registered successfully! Please sign in.", "success");
      onNavigate("login");
    } catch (err: any) {
      setError(err.message || "Registration failed. Username or email might be taken.");
      onAddToast("Registration failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="register-view" className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white dark:bg-gray-950 p-8 sm:p-10 border border-gray-150 dark:border-gray-900 rounded-3xl shadow-sm text-left space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Branding header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 rounded-2xl">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Create Your Account</h2>
          <p className="text-sm text-gray-500">Join BlogSphere and start publishing articles</p>
        </div>

        {/* Error Alert panel */}
        {error && (
          <div id="register-error-alert" className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs font-semibold">
            <ShieldAlert className="w-4 h-4 text-rose-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Registration form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <input
                id="register-name"
                type="text"
                required
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white dark:bg-gray-950 px-4 py-2.5 pl-10 rounded-xl border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-800 dark:text-gray-100"
              />
              <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Username</label>
            <div className="relative">
              <input
                id="register-username"
                type="text"
                required
                placeholder="janedoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white dark:bg-gray-950 px-4 py-2.5 pl-10 rounded-xl border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-800 dark:text-gray-100"
              />
              <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <input
                id="register-email"
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
            <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Password</label>
            <div className="relative">
              <input
                id="register-password"
                type="password"
                required
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white dark:bg-gray-950 px-4 py-2.5 pl-10 rounded-xl border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-800 dark:text-gray-100"
              />
              <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Confirm Password</label>
            <div className="relative">
              <input
                id="register-confirm-password"
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white dark:bg-gray-950 px-4 py-2.5 pl-10 rounded-xl border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-800 dark:text-gray-100"
              />
              <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <button
            id="register-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-1.5 px-4 h-11 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/15 cursor-pointer transition-colors"
          >
            {loading ? (
              <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <>
                Register Account <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Redirect choices */}
        <div className="text-center pt-2">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <button
              id="register-login-redirect"
              onClick={() => onNavigate("login")}
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
