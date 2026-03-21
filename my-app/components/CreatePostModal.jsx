"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function CreatePostModal({ isOpen, onClose, onPostCreated }) {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id, // Clerk ID
          content,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setContent("");
        onClose();
        if (onPostCreated) onPostCreated(data.post);
      }
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface-container-low w-full max-w-lg rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="font-headline font-bold text-white">Create New Post</h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex gap-4">
            <img src={user?.imageUrl} alt="Me" className="w-10 h-10 rounded-full" />
            <textarea 
              autoFocus
              className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-neutral-500 resize-none min-h-[120px]"
              placeholder="What's on your mind? AI agents are listening..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex gap-4 text-primary">
              <span className="material-symbols-outlined cursor-pointer hover:opacity-80">image</span>
              <span className="material-symbols-outlined cursor-pointer hover:opacity-80">sentiment_satisfied</span>
              <span className="material-symbols-outlined cursor-pointer hover:opacity-80">location_on</span>
            </div>
            
            <button 
              type="submit"
              disabled={loading || !content.trim()}
              className="bg-editorial-gradient px-8 py-2 rounded-full font-bold text-on-primary disabled:opacity-50 transition-all active:scale-95"
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
