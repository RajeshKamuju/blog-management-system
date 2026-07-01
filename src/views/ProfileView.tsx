import React, { useState } from "react";
import { User } from "../types";
import { apiRequest, setCurrentUser } from "../utils/api";
import { ArrowLeft, User as UserIcon, Lock, KeyRound, Mail, Sparkles, Check } from "lucide-react";

interface ProfileViewProps {
  currentUser: User | null;
  onProfileUpdate: (updated: User) => void;
  onNavigate: (page: any) => void;
  onAddToast: (text: string, type: "success" | "error") => void;
}

export default function ProfileView({
  currentUser,
  onProfileUpdate,
  onNavigate,
  onAddToast
}: ProfileViewProps) {
  const [name, setName] = useState(currentUser?.name || "");
  const [username, setUsername] = useState(currentUser?.username || "");
  const [profileImage, setProfileImage] = useState(currentUser?.profileImage || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  // Generate a fun avatar based on username using public Dicebear API
  const handleRandomizeAvatar = () => {
    const seed = Math.random().toString(36).substring(7);
    const newAvatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(seed)}`;
    setProfileImage(newAvatar);
    onAddToast("Avatar randomized! Remember to click save changes.", "success");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!name.trim() || !username.trim()) {
      onAddToast("Name and username are required.", "error");
      return;
    }

    if (password) {
      if (password.length < 6) {
        onAddToast("Password must be at least 6 characters.", "error");
        return;
      }
      if (password !== confirmPassword) {
        onAddToast("Passwords do not match.", "error");
        return;
      }
    }

    setSaving(true);
    try {
      const response = await apiRequest("/users/profile", "PUT", {
        name,
        username,
        profileImage,
        password: password || undefined
      });

      const updatedUser: User = response.user;
      setCurrentUser(updatedUser);
      onProfileUpdate(updatedUser);
      setPassword("");
      setConfirmPassword("");
      onAddToast("Profile updated successfully!", "success");
    } catch (err: any) {
      onAddToast(err.message || "Failed to update profile details.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Access Denied</h3>
        <p className="text-sm text-gray-500 mt-2">Please sign in to view your profile.</p>
        <button onClick={() => onNavigate("login")} className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-xl">
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div id="user-profile-settings" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left space-y-8 animate-in fade-in duration-300">
      {/* Back button */}
      <button
        onClick={() => onNavigate("dashboard")}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-indigo-600 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Profile Settings</h1>
        <p className="text-sm text-gray-500">Manage your avatar, public bio metrics, and account credentials.</p>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-gray-950 border border-gray-150 dark:border-gray-900 p-6 sm:p-10 rounded-3xl shadow-sm">
        
        {/* Avatar block with customization */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100 dark:border-gray-900">
          <img
            src={profileImage}
            alt={username}
            className="w-20 h-20 rounded-2xl object-cover bg-gray-50 border border-gray-150 dark:border-gray-800"
          />
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="font-bold text-gray-900 dark:text-white text-base">Account Avatar</h3>
            <p className="text-xs text-gray-500 max-w-sm">
              Use your custom photo URL, or tap to randomize a minimalist adventurer avatar.
            </p>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1">
              <button
                type="button"
                onClick={handleRandomizeAvatar}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-xl cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Randomize Avatar
              </button>
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Immutable Email */}
          <div className="space-y-1.5">
            <label className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
              Email Address <Lock className="w-3 h-3 text-gray-400" />
            </label>
            <div className="relative">
              <input
                id="profile-email"
                type="email"
                disabled
                value={currentUser.email}
                className="w-full bg-gray-50 dark:bg-gray-950/20 px-4 py-2.5 pl-10 rounded-xl border border-gray-150 dark:border-gray-900 text-sm text-gray-400 font-medium cursor-not-allowed"
              />
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Avatar URL */}
          <div className="space-y-1.5">
            <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Avatar Image URL</label>
            <input
              id="profile-image-url"
              type="text"
              required
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              className="w-full bg-white dark:bg-gray-950 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-800 dark:text-gray-100 font-mono"
            />
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <input
                id="profile-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white dark:bg-gray-950 px-4 py-2.5 pl-10 rounded-xl border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-800 dark:text-gray-100"
              />
              <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Username</label>
            <div className="relative">
              <input
                id="profile-username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white dark:bg-gray-950 px-4 py-2.5 pl-10 rounded-xl border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-800 dark:text-gray-100"
              />
              <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Change password section */}
        <div className="border-t border-gray-100 dark:border-gray-900 pt-6 space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1.5">
            <KeyRound className="w-4 h-4 text-indigo-500" /> Update Password (Optional)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">New Password</label>
              <input
                id="profile-password"
                type="password"
                placeholder="Leave blank to keep same"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white dark:bg-gray-950 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-800 dark:text-gray-100"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Confirm New Password</label>
              <input
                id="profile-confirm-password"
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white dark:bg-gray-950 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-800 dark:text-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions row */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-900">
          <button
            type="button"
            onClick={() => onNavigate("dashboard")}
            className="px-4 py-2.5 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl text-xs font-semibold text-gray-500 cursor-pointer"
          >
            Cancel
          </button>
          
          <button
            id="profile-save-btn"
            type="submit"
            disabled={saving}
            className="flex items-center gap-1.5 px-6 h-11 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/15 cursor-pointer transition-colors"
          >
            {saving ? (
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <>
                Save Changes <Check className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
