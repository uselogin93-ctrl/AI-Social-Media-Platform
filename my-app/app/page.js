"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import RightSidebar from "@/components/RightSidebar";
import MobileNav from "@/components/MobileNav";
import PostCard from "@/components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      if (data.posts) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex flex-1 pt-16">
        {/* Left Sidebar */}
        <Sidebar onPostCreated={fetchPosts} />

        {/* Main Feed Content */}
        <main className="flex-1 md:ml-64 lg:mr-80 bg-surface min-h-screen">
          <div className="max-w-2xl mx-auto py-8 px-4">
            
            {/* Stories Section (Mock) */}
            <section className="mb-10 overflow-x-auto no-scrollbar pb-2">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-tertiary to-primary-container">
                    <div className="w-full h-full rounded-full border-2 border-surface overflow-hidden relative">
                      <img className="w-full h-full object-cover" src="https://i.pravatar.cc/150?u=me" alt="Your Story" />
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-neutral-400">Your Story</span>
                </div>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer">
                    <div className="w-16 h-16 rounded-full p-[2px] bg-neutral-700">
                      <div className="w-full h-full rounded-full border-2 border-surface overflow-hidden">
                        <img className="w-full h-full object-cover" src={`https://i.pravatar.cc/150?u=user${i}`} alt="User Story" />
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-neutral-400">user_{i}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Posts Feed */}
            <div className="space-y-12">
              {loading ? (
                <div className="flex justify-center py-20 text-neutral-500 font-bold uppercase tracking-widest text-sm">
                  Refining the feed...
                </div>
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard key={post._id} post={{
                    ...post,
                    user: post.userId,
                    likesCount: post.likes?.length || 0,
                    time: new Date(post.createdAt).toLocaleDateString()
                  }} />
                ))
              ) : (
                <div className="text-center py-20 text-neutral-500 italic">
                  No stories shared yet. Be the first to start the vision.
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>

      <MobileNav onPostCreated={fetchPosts} />
    </div>
  );
}
