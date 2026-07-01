import React, { useState, useEffect } from "react";
import { Comment, User } from "../types";
import { apiRequest } from "../utils/api";
import { Reply, Edit2, Trash2, Send, X, CornerDownRight, Check, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CommentSectionProps {
  postId: string;
  currentUser: User | null;
  onNavigateToLogin: () => void;
  onAddToast: (text: string, type: "success" | "error") => void;
}

interface CommentNode extends Comment {
  replies: CommentNode[];
}

export default function CommentSection({
  postId,
  currentUser,
  onNavigateToLogin,
  onAddToast
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Input states
  const [newCommentText, setNewCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Editing and replying states
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState("");
  
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null);
  const [replyCommentText, setReplyCommentText] = useState("");

  const fetchComments = async () => {
    setLoading(true);
    try {
      const data = await apiRequest(`/comments/post/${postId}`);
      setComments(data);
      setError(null);
    } catch (err: any) {
      setError("Failed to load comments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  // Recursively build comment tree
  const buildCommentTree = (flatList: Comment[]): CommentNode[] => {
    const map: { [key: string]: CommentNode } = {};
    const roots: CommentNode[] = [];

    // Initialize map
    flatList.forEach((c) => {
      map[c.id] = { ...c, replies: [] };
    });

    flatList.forEach((c) => {
      const mapped = map[c.id];
      if (c.parentCommentId && map[c.parentCommentId]) {
        map[c.parentCommentId].replies.push(mapped);
      } else {
        roots.push(mapped);
      }
    });

    // Sort roots and replies by createdAt
    const sortByDate = (a: CommentNode, b: CommentNode) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

    roots.sort(sortByDate);
    const sortReplies = (node: CommentNode) => {
      node.replies.sort(sortByDate);
      node.replies.forEach(sortReplies);
    };
    roots.forEach(sortReplies);

    return roots;
  };

  // Submit root comment
  const handleSubmitRootComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!newCommentText.trim()) return;

    setSubmitting(true);
    try {
      const created = await apiRequest("/comments", "POST", {
        text: newCommentText,
        postId
      });
      setComments((prev) => [...prev, created]);
      setNewCommentText("");
      onAddToast("Comment added successfully!", "success");
    } catch (err: any) {
      onAddToast(err.message || "Failed to add comment.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Submit nested reply
  const handleSubmitReply = async (parentCommentId: string) => {
    if (!currentUser) return;
    if (!replyCommentText.trim()) return;

    try {
      const created = await apiRequest("/comments", "POST", {
        text: replyCommentText,
        postId,
        parentCommentId
      });
      setComments((prev) => [...prev, created]);
      setReplyCommentText("");
      setReplyingCommentId(null);
      onAddToast("Reply added successfully!", "success");
    } catch (err: any) {
      onAddToast(err.message || "Failed to submit reply.", "error");
    }
  };

  // Submit edit
  const handleSubmitEdit = async (commentId: string) => {
    if (!editCommentText.trim()) return;

    try {
      const updated = await apiRequest(`/comments/${commentId}`, "PUT", {
        text: editCommentText
      });
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, text: updated.text, updatedAt: updated.updatedAt } : c))
      );
      setEditingCommentId(null);
      setEditCommentText("");
      onAddToast("Comment updated successfully!", "success");
    } catch (err: any) {
      onAddToast(err.message || "Failed to update comment.", "error");
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment? This will also remove any replies under it.")) return;

    try {
      await apiRequest(`/comments/${commentId}`, "DELETE");
      // Clean up local comments state (the server also deleted replies recursively, so let's refetch or filter them out)
      // Refetching is extremely robust because it gets the exact updated state from the server
      fetchComments();
      onAddToast("Comment deleted successfully!", "success");
    } catch (err: any) {
      onAddToast(err.message || "Failed to delete comment.", "error");
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const commentTree = buildCommentTree(comments);

  // Recursive component to render a single comment node and its children
  const CommentNodeComponent = ({ node, depth = 0 }: { node: CommentNode; depth: number; key?: string }) => {
    const isEditing = editingCommentId === node.id;
    const isReplying = replyingCommentId === node.id;
    const isOwner = currentUser && node.userId === currentUser.id;
    const isAdmin = currentUser && currentUser.role === "ADMIN";

    return (
      <div id={`comment-node-${node.id}`} className="mt-5 text-left">
        <div className="flex gap-3">
          {/* Left Avatar */}
          <img
            src={node.user?.profileImage || "https://api.dicebear.com/7.x/adventurer/svg?seed=placeholder"}
            alt={node.user?.username || "user"}
            className="w-9 h-9 rounded-full object-cover bg-gray-50 flex-shrink-0"
          />

          {/* Right Core Info */}
          <div className="flex-1 bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-900 p-4 rounded-2xl relative">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {node.user?.name || "Anonymous User"}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  @{node.user?.username || "anonymous"}
                </span>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {formatDate(node.createdAt)}
              </span>
            </div>

            {/* Editing view */}
            {isEditing ? (
              <div className="space-y-2 mt-1">
                <textarea
                  id={`edit-textarea-${node.id}`}
                  value={editCommentText}
                  onChange={(e) => setEditCommentText(e.target.value)}
                  rows={2}
                  className="w-full text-sm bg-white dark:bg-gray-950 p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-gray-100"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    id={`cancel-edit-${node.id}`}
                    onClick={() => {
                      setEditingCommentId(null);
                      setEditCommentText("");
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                  <button
                    id={`save-edit-${node.id}`}
                    onClick={() => handleSubmitEdit(node.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" /> Save Changes
                  </button>
                </div>
              </div>
            ) : (
              /* Display text */
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                {node.text}
              </p>
            )}

            {/* Comment Action Links */}
            {!isEditing && currentUser && (
              <div className="flex items-center gap-4 mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-900 text-xs text-gray-500 dark:text-gray-400 font-semibold">
                <button
                  id={`reply-btn-${node.id}`}
                  onClick={() => {
                    setReplyingCommentId(isReplying ? null : node.id);
                    setReplyCommentText("");
                    setEditingCommentId(null);
                  }}
                  className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                >
                  <Reply className="w-3.5 h-3.5" /> Reply
                </button>

                {isOwner && (
                  <button
                    id={`edit-btn-${node.id}`}
                    onClick={() => {
                      setEditingCommentId(node.id);
                      setEditCommentText(node.text);
                      setReplyingCommentId(null);
                    }}
                    className="flex items-center gap-1 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                )}

                {(isOwner || isAdmin) && (
                  <button
                    id={`delete-btn-${node.id}`}
                    onClick={() => handleDeleteComment(node.id)}
                    className="flex items-center gap-1 hover:text-rose-600 dark:hover:text-rose-400 ml-auto cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Reply submission input */}
        {isReplying && (
          <div id={`reply-input-${node.id}`} className="ml-9 mt-3 flex gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex-shrink-0 flex items-center justify-center p-1">
              <CornerDownRight className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex-1 space-y-2 bg-gray-50 dark:bg-gray-900/20 p-3 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
              <textarea
                id={`reply-textarea-${node.id}`}
                placeholder={`Reply to ${node.user?.name}...`}
                value={replyCommentText}
                onChange={(e) => setReplyCommentText(e.target.value)}
                rows={2}
                className="w-full text-sm bg-white dark:bg-gray-950 p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-gray-100"
              />
              <div className="flex gap-2 justify-end">
                <button
                  id={`cancel-reply-${node.id}`}
                  onClick={() => {
                    setReplyingCommentId(null);
                    setReplyCommentText("");
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
                <button
                  id={`submit-reply-${node.id}`}
                  onClick={() => handleSubmitReply(node.id)}
                  disabled={!replyCommentText.trim()}
                  className="flex items-center gap-1 px-3.5 py-1.5 text-xs text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 rounded-lg cursor-pointer transition-colors"
                >
                  <Send className="w-3.5 h-3.5" /> Post Reply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recursive Children rendering */}
        {node.replies && node.replies.length > 0 && (
          <div className="ml-4 md:ml-9 pl-4 border-l border-gray-150 dark:border-gray-800/80 space-y-4">
            {node.replies.map((reply) => (
              <CommentNodeComponent key={reply.id} node={reply} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div id="comments-section" className="mt-12 border-t border-gray-100 dark:border-gray-900 pt-10">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6 text-left">
        Discussion
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400">
          {comments.length}
        </span>
      </h3>

      {/* Write core/root Comment */}
      {currentUser ? (
        <form id="root-comment-form" onSubmit={handleSubmitRootComment} className="space-y-3 text-left">
          <div className="flex gap-3">
            <img
              src={currentUser.profileImage}
              alt={currentUser.username}
              className="w-10 h-10 rounded-full object-cover bg-gray-50 flex-shrink-0"
            />
            <div className="flex-1 relative">
              <textarea
                id="root-comment-textarea"
                placeholder="Share your thoughts on this article..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                rows={3}
                required
                className="w-full text-sm bg-white dark:bg-gray-950 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 dark:text-gray-100 transition-shadow shadow-sm"
              />
              <div className="flex justify-end mt-2">
                <button
                  id="submit-root-comment-btn"
                  type="submit"
                  disabled={submitting || !newCommentText.trim()}
                  className="flex items-center gap-1.5 px-4 h-10 bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/10 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div id="signin-wall" className="p-6 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/20 text-center flex flex-col items-center max-w-lg mx-auto">
          <AlertCircle className="w-8 h-8 text-indigo-500 mb-2" />
          <h4 className="font-bold text-gray-900 dark:text-white text-base">Join the Discussion</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">
            Logged-in members can share responses, ask questions, and reply to others.
          </p>
          <button
            id="comment-login-redirect"
            onClick={onNavigateToLogin}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
          >
            Sign In to Comment
          </button>
        </div>
      )}

      {/* Loading & Empty State */}
      {loading ? (
        <div id="comments-loader" className="flex items-center justify-center py-10">
          <div className="w-6 h-6 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
        </div>
      ) : error ? (
        <div id="comments-error" className="py-6 text-sm text-rose-500 dark:text-rose-400 text-center font-medium">
          {error}
        </div>
      ) : commentTree.length === 0 ? (
        <div id="comments-empty" className="py-12 text-sm text-gray-400 dark:text-gray-600 text-center">
          No comments yet. Be the first to start the conversation!
        </div>
      ) : (
        /* Comment Tree list */
        <div id="comments-list" className="space-y-4 mb-10">
          {commentTree.map((rootNode) => (
            <CommentNodeComponent key={rootNode.id} node={rootNode} depth={0} />
          ))}
        </div>
      )}
    </div>
  );
}
