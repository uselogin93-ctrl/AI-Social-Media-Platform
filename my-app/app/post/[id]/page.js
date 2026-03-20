"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import { api } from "@/lib/api";

export default function PostPage() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (!id) return;
    Promise.all([
      api(`/posts/${id}`).then(setPost).catch(() => setPost(null)),
      api(`/comments/${id}`).then(setComments).catch(() => setComments([])),
    ]).finally(() => setLoading(false));
  }, [id, user, authLoading, router]);

  const handleLike = async () => {
    try {
      const { liked } = await api(`/posts/like/${id}`, { method: "POST" });
      setPost((p) =>
        p
          ? {
              ...p,
              likes: liked ? [...(p.likes || []), user._id] : (p.likes || []).filter((lid) => (typeof lid === "object" ? lid._id : lid) !== user._id),
            }
          : p
      );
    } catch {}
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const c = await api(`/comments/${id}`, {
        method: "POST",
        body: JSON.stringify({ content: commentText.trim() }),
      });
      setComments((prev) => [...prev, c]);
      setCommentText("");
    } catch {}
  };

  if (authLoading || !user) return null;

  const author = post?.userId;
  const isLiked = post?.likes?.some((l) => (typeof l === "object" ? l._id : l) === user._id);

  return (
    <Layout>
      <main className="flex-1 md:ml-64 bg-surface min-h-screen pb-20 md:pb-0">
        <div className="max-w-2xl mx-auto py-8 px-4">
          {loading ? (
            <div className="text-center text-on-surface-variant py-20">Loading...</div>
          ) : !post ? (
            <div className="text-center text-on-surface-variant py-20">Post not found.</div>
          ) : (
            <article className="bg-surface-container rounded-xl overflow-hidden shadow-2xl shadow-black/40">
              <div className="p-5 flex items-center justify-between">
                <Link href={`/profile/${author?._id}`} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-700 overflow-hidden ring-1 ring-white/5">
                    {author?.avatar ? (
                      <img className="w-full h-full object-cover" alt={author.username} src={author.avatar} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-on-surface text-sm">{(author?.username || "U")[0]}</div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-headline text-sm font-bold text-white">{author?.username}</h4>
                  </div>
                </Link>
              </div>
              <div className="aspect-square relative overflow-hidden bg-neutral-900">
                {post.media ? (
                  <img className="w-full h-full object-cover" alt="Post" src={post.media} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-8">
                    <p className="text-on-surface-variant text-center">{post.content}</p>
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-4 mb-4">
                  <button onClick={handleLike} className={isLiked ? "text-primary" : "text-neutral-400 hover:text-white"}>
                    <span className="material-symbols-outlined text-2xl" style={isLiked ? { fontVariationSettings: "'FILL' 1" } : {}}>favorite</span>
                  </button>
                </div>
                <p className="text-sm font-bold text-white mb-2">{(post.likes?.length || 0)} likes</p>
                <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                  <span className="font-bold text-white mr-1">{author?.username}</span>
                  {post.content}
                </p>
                <div className="space-y-4 border-t border-outline-variant/20 pt-4">
                  <h5 className="font-bold text-on-surface">Comments ({comments.length})</h5>
                  {comments.map((c) => (
                    <div key={c._id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {(c.userId?.username || "U")[0]}
                      </div>
                      <div>
                        <p className="text-sm">
                          <span className="font-bold text-white mr-2">{c.userId?.username}</span>
                          {c.content}
                        </p>
                      </div>
                    </div>
                  ))}
                  <form onSubmit={handleComment} className="flex gap-3">
                    <input
                      className="flex-1 bg-surface-container-highest rounded-lg px-4 py-2 text-on-surface placeholder:text-outline/50"
                      placeholder="Add a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <button type="submit" className="text-primary font-bold">Post</button>
                  </form>
                </div>
              </div>
            </article>
          )}
        </div>
      </main>
    </Layout>
  );
}
