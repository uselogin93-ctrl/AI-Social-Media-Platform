"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const { id } = useParams();
  const { user: currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push("/login");
      return;
    }
    if (!id) return;
    Promise.all([
      api(`/users/${id}`).then((u) => {
        setProfileUser(u);
        setFollowing(u.followers?.some((f) => (f._id || f) === currentUser?._id) || false);
      }).catch(() => setProfileUser(null)),
      api(`/posts/user/${id}`).then(setPosts).catch(() => setPosts([])),
    ]).finally(() => setLoading(false));
  }, [id, currentUser, authLoading, router]);

  const handleFollow = async () => {
    try {
      const res = await api(`/users/follow/${id}`, { method: "POST" });
      setFollowing(res.following);
      setProfileUser((prev) =>
        prev
          ? {
              ...prev,
              followers: res.following
                ? [...(prev.followers || []), currentUser]
                : (prev.followers || []).filter((f) => (f._id || f) !== currentUser._id),
            }
          : prev
      );
    } catch {}
  };

  if (authLoading || !currentUser) return null;

  const isOwnProfile = currentUser._id === id;

  return (
    <Layout>
      <main className="flex-1 md:ml-64 bg-surface min-h-screen pb-20 md:pb-0">
        <div className="max-w-5xl mx-auto px-6 py-12">
          {loading ? (
            <div className="text-center text-on-surface-variant py-20">Loading profile...</div>
          ) : !profileUser ? (
            <div className="text-center text-on-surface-variant py-20">User not found.</div>
          ) : (
            <>
              <header className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-16">
                <div className="relative">
                  <div className="w-32 h-32 md:w-44 md:h-44 rounded-full p-1 bg-gradient-to-tr from-primary to-tertiary">
                    <div className="w-full h-full rounded-full border-4 border-surface overflow-hidden bg-surface-container-highest">
                      {profileUser.avatar ? (
                        <img className="w-full h-full object-cover" alt={profileUser.username} src={profileUser.avatar} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-on-surface font-bold text-4xl">
                          {(profileUser.username || "U")[0]}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                    <h1 className="text-3xl font-extrabold font-headline tracking-tight text-on-surface">{profileUser.username}</h1>
                    <div className="flex gap-2 justify-center md:justify-start">
                      {!isOwnProfile && (
                        <button
                          onClick={handleFollow}
                          className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-8 py-2 rounded-lg font-bold text-sm transition-transform active:scale-95"
                        >
                          {following ? "Unfollow" : "Follow"}
                        </button>
                      )}
                      {!isOwnProfile && (
                        <Link href={`/messages?userId=${profileUser._id}`} className="bg-surface-container-highest text-on-surface px-4 py-2 rounded-lg font-bold text-sm inline-flex items-center gap-2">
                          <span className="material-symbols-outlined text-lg">mail</span>
                          Message
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-center md:justify-start gap-10 mb-6">
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-white">{posts.length}</span>
                      <span className="text-sm text-neutral-400 font-medium">Posts</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-white">{profileUser.followers?.length || 0}</span>
                      <span className="text-sm text-neutral-400 font-medium">Followers</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-white">{profileUser.following?.length || 0}</span>
                      <span className="text-sm text-neutral-400 font-medium">Following</span>
                    </div>
                  </div>
                  <div className="max-w-md">
                    <p className="text-white font-bold mb-1">{profileUser.fullName || profileUser.username}</p>
                    <p className="text-on-surface-variant leading-relaxed text-sm">{profileUser.bio || "No bio yet."}</p>
                  </div>
                </div>
              </header>
              <div className="flex justify-center border-t border-outline-variant/10 mb-8">
                <button className="border-t-2 border-primary py-4 flex items-center gap-2 text-primary font-bold text-xs tracking-widest uppercase">
                  <span className="material-symbols-outlined text-sm">grid_view</span>
                  Posts
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-4">
                {posts.map((post) => (
                  <Link key={post._id} href={`/post/${post._id}`} className="aspect-square relative group overflow-hidden bg-surface-container rounded-lg">
                    {post.media ? (
                      <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Post" src={post.media} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-4">
                        <p className="text-on-surface-variant text-sm line-clamp-4 text-center">{post.content}</p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-neutral-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                      <div className="flex items-center gap-2 text-white font-bold">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                        {post.likes?.length || 0}
                      </div>
                      <div className="flex items-center gap-2 text-white font-bold">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
                        0
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {posts.length > 0 && (
                <div className="mt-16 flex flex-col items-center">
                  <div className="w-12 h-1 bg-surface-container-highest mb-6" />
                  <button className="text-neutral-400 hover:text-white font-bold text-sm tracking-widest uppercase transition-colors">
                    Discover More Stories
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </Layout>
  );
}
