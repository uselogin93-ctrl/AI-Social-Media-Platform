"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import CreatePostModal from "@/components/CreatePostModal";
import { api } from "@/lib/api";

function formatTime(date) {
  const d = new Date(date);
  const now = new Date();
  const diff = Math.floor((now - d) / 60000);
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
}

export default function FeedPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);

  const refreshFeed = () => {
    api("/posts/feed").then(setPosts).catch(() => setPosts([]));
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    Promise.all([
      api("/posts/feed").then(setPosts).catch(() => setPosts([])),
      api("/users/suggested").then(setSuggested).catch(() => setSuggested([])),
    ]).finally(() => setLoading(false));
  }, [user, authLoading, router]);

  const handleLike = async (postId) => {
    try {
      const { liked } = await api(`/posts/like/${postId}`, { method: "POST" });
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
                ...p,
                likes: liked ? [...(p.likes || []), user._id] : (p.likes || []).filter((id) => (typeof id === "object" ? id._id : id) !== user._id),
              }
            : p
        )
      );
    } catch {}
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-on-surface-variant">Loading...</p>
      </div>
    );
  }
  if (!user) return null;

  return (
    <Layout onCreatePostClick={() => setShowCreatePost(true)}>
      {showCreatePost && (
        <CreatePostModal onClose={() => setShowCreatePost(false)} onSuccess={refreshFeed} />
      )}
      <main className="flex-1 md:ml-64 mr-0 lg:mr-80 bg-surface min-h-screen pb-20 md:pb-0">
        <div className="max-w-2xl mx-auto py-8 px-4">
          <section className="mb-10">
            <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
              {user && (
                <div className="flex-shrink-0 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-tertiary to-primary-container">
                    <div className="w-full h-full rounded-full border-2 border-surface overflow-hidden relative bg-surface-container-highest">
                      {user.avatar ? (
                        <img className="w-full h-full object-cover" alt="Your story" src={user.avatar} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-on-surface font-bold text-lg">{(user.username || "Y")[0]}</div>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-neutral-400">Your Story</span>
                </div>
              )}
              {suggested.slice(0, 4).map((u) => (
                <Link key={u._id} href={`/profile/${u._id}`} className="flex-shrink-0 flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full p-[2px] bg-neutral-700">
                    <div className="w-full h-full rounded-full border-2 border-surface overflow-hidden bg-surface-container-highest">
                      {u.avatar ? <img className="w-full h-full object-cover" alt={u.username} src={u.avatar} /> : <div className="w-full h-full flex items-center justify-center text-on-surface text-sm">{(u.username || "U")[0]}</div>}
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-neutral-400">{u.username}</span>
                </Link>
              ))}
            </div>
          </section>
          <div className="space-y-12">
            {loading ? (
              <div className="text-center text-on-surface-variant py-12">Loading feed...</div>
            ) : posts.length === 0 ? (
              <div className="bg-surface-container rounded-xl p-12 text-center">
                <p className="text-on-surface-variant mb-4">No posts yet. Follow users or create your first post!</p>
              </div>
            ) : (
              posts.map((post) => {
                const author = post.userId;
                const isLiked = post.likes?.some((l) => (typeof l === "object" ? l._id : l) === user._id);
                return (
                  <article key={post._id} className="bg-surface-container rounded-xl overflow-hidden shadow-2xl shadow-black/40">
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
                          <p className="text-[10px] text-neutral-500 font-medium">{formatTime(post.createdAt)}</p>
                        </div>
                      </Link>
                    </div>
                    <div className="aspect-square relative overflow-hidden bg-neutral-900">
                      {post.media ? (
                        <img className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" alt="Post" src={post.media} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center p-8">
                          <p className="text-on-surface-variant text-center">{post.content}</p>
                        </div>
                      )}
                      <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/5" />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <button onClick={() => handleLike(post._id)} className={isLiked ? "text-primary" : "text-neutral-400 hover:text-white"}>
                            <span className="material-symbols-outlined text-2xl" style={isLiked ? { fontVariationSettings: "'FILL' 1" } : {}}>favorite</span>
                          </button>
                          <Link href={`/post/${post._id}`} className="text-neutral-400 hover:text-white">
                            <span className="material-symbols-outlined text-2xl">chat_bubble</span>
                          </Link>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-bold text-white">{(post.likes?.length || 0)} likes</p>
                        <p className="text-sm text-neutral-300 leading-relaxed">
                          <span className="font-bold text-white mr-1">{author?.username}</span>
                          {post.content}
                        </p>
                        <Link href={`/post/${post._id}`} className="text-xs text-neutral-500 font-medium hover:text-neutral-400">
                          View comments
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </main>
      <aside className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 bg-surface-container-low hidden lg:flex flex-col p-8 overflow-y-auto border-l border-white/5">
        <div className="mb-6">
          <h3 className="font-headline text-xs font-bold uppercase tracking-widest text-neutral-500">Suggested for you</h3>
        </div>
        <div className="space-y-6">
          {suggested.map((u) => (
            <div key={u._id} className="flex items-center justify-between group">
              <Link href={`/profile/${u._id}`} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-neutral-700 overflow-hidden ring-1 ring-white/5">
                  {u.avatar ? <img className="w-full h-full object-cover" alt={u.username} src={u.avatar} /> : <div className="w-full h-full flex items-center justify-center text-on-surface text-xs">{(u.username || "U")[0]}</div>}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white group-hover:text-primary transition-colors">{u.username}</h5>
                  <p className="text-[10px] text-neutral-500">Suggested for you</p>
                </div>
              </Link>
              <FollowButton userId={u._id} />
            </div>
          ))}
        </div>
        <footer className="mt-auto pt-8">
          <p className="text-[10px] font-bold text-neutral-700 tracking-widest uppercase">© 2024 DIGITAL EDITORIAL</p>
        </footer>
      </aside>
    </Layout>
  );
}

function FollowButton({ userId }) {
  const [following, setFollowing] = useState(false);
  const handleFollow = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await api(`/users/follow/${userId}`, { method: "POST" });
      setFollowing(res.following);
    } catch {}
  };
  return (
    <button onClick={handleFollow} className="text-xs font-bold text-blue-400 hover:text-blue-300">
      {following ? "Unfollow" : "Follow"}
    </button>
  );
}
