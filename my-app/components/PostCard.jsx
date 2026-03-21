"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export default function PostCard({ post }) {
  const { user: clerkUser } = useUser();
  const [likes, setLikes] = useState(post.likesCount || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const { user, content, media, time, location, _id } = post;

  useEffect(() => {
    if (clerkUser && post.likes?.includes(clerkUser.id)) {
      setIsLiked(true);
    }
  }, [clerkUser, post.likes]);

  const handleLike = async () => {
    if (!clerkUser) return;
    try {
      const res = await fetch(`/api/posts/${_id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: clerkUser.id })
      });
      const data = await res.json();
      if (data.success) {
        setLikes(data.likesCount);
        setIsLiked(data.isLiked);
      }
    } catch (error) {
      console.error("Like failed:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/posts/${_id}/comment`);
      const data = await res.json();
      if (data.comments) setComments(data.comments);
    } catch (error) {
      console.error("Fetch comments failed:", error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !clerkUser) return;

    try {
      const res = await fetch(`/api/posts/${_id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: clerkUser.id, content: newComment })
      });
      const data = await res.json();
      if (data.success) {
        setNewComment("");
        fetchComments();
      }
    } catch (error) {
      console.error("Comment failed:", error);
    }
  };

  return (
    <article className="bg-surface-container rounded-xl overflow-hidden shadow-2xl shadow-black/40 border border-white/5">
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neutral-700 overflow-hidden ring-1 ring-white/5">
            <img 
              className="w-full h-full object-cover" 
              src={user?.avatar || "https://i.pravatar.cc/100"} 
              alt="User" 
            />
          </div>
          <div>
            <h4 className="font-headline text-sm font-bold text-white">@{user?.username || "anonymous"}</h4>
            <p className="text-[10px] text-neutral-500 font-medium">{location || "Social AI Platform"} · {time || "Just now"}</p>
          </div>
        </div>
      </div>

      <div className="aspect-square relative overflow-hidden bg-neutral-900 border-y border-white/5">
        <img 
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
          src={media || "https://images.unsplash.com/photo-1518005020470-588a3a307b00?q=80&w=800&auto=format&fit=crop"} 
          alt="Post media" 
        />
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button onClick={handleLike} className={`${isLiked ? 'text-primary' : 'text-neutral-400 hover:text-white'} transition-all`}>
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
            </button>
            <button onClick={() => { setShowComments(!showComments); if(!showComments) fetchComments(); }} className="text-neutral-400 hover:text-white">
              <span className="material-symbols-outlined text-2xl">chat_bubble</span>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-bold text-white">{likes} likes</p>
          <p className="text-sm text-neutral-300 leading-relaxed">
            <span className="font-bold text-white mr-1">@{user?.username || "anonymous"}</span>
            {content}
          </p>
          
          {showComments && (
            <div className="mt-4 pt-4 border-t border-white/5 space-y-4">
              {comments.map((c, i) => (
                <div key={i} className="flex gap-2 text-xs">
                  <span className="font-bold text-white text-nowrap">@{c.userId?.username}:</span>
                  <span className="text-neutral-400">{c.content}</span>
                </div>
              ))}
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input 
                  className="flex-1 bg-surface-container-highest border-none rounded-lg px-3 py-1 text-xs text-white" 
                  placeholder="Add a comment..." 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button type="submit" className="text-primary text-xs font-bold uppercase">Post</button>
              </form>
            </div>
          )}

          {!showComments && (
            <button onClick={() => { setShowComments(true); fetchComments(); }} className="text-xs text-neutral-500 font-medium hover:text-neutral-400">
              View all comments
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
