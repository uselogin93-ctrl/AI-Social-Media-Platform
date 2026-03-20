"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function CreatePostModal({ onClose, onSuccess }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    setError("");
    try {
      await api("/posts", {
        method: "POST",
        body: JSON.stringify({ content: content.trim() }),
      });
      onSuccess?.();
      onClose();
      setContent("");
    } catch (err) {
      setError(err.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-surface-container-lowest/60 backdrop-blur-md" onClick={onClose}>
      <div className="bg-surface-bright rounded-xl w-full max-w-md shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-headline text-xl font-bold text-on-surface">Create Post</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-error text-sm mb-4">{error}</p>}
          <textarea
            className="w-full bg-surface-container rounded-lg p-4 text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/50 resize-none"
            placeholder="What's on your mind?"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="flex-1 bg-editorial-gradient text-on-primary font-bold py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? "Posting..." : "Post"}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-3 bg-surface-container text-on-surface rounded-lg">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
