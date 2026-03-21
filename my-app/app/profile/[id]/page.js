"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import RightSidebar from "@/components/RightSidebar";
import MobileNav from "@/components/MobileNav";
import PostCard from "@/components/PostCard";

export default function ProfilePage({ params }) {
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { id } = params;

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Fetch User
        const userRes = await fetch(`/api/users/${id}`);
        const userData = await userRes.json();
        if (userData.user) setProfileUser(userData.user);

        // Fetch User's Posts
        const postsRes = await fetch(`/api/posts?userId=${id}`);
        const postsData = await postsRes.json();
        if (postsData.posts) setPosts(postsData.posts);
      } catch (error) {
        console.error("Profile fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [id]);

  if (loading) return <div className="h-screen bg-surface flex items-center justify-center text-primary font-bold">Resonating with Profile Soul...</div>;
  if (!profileUser) return <div className="h-screen bg-surface flex items-center justify-center text-neutral-500">Soul not found in the matrix.</div>;

  const user = {
    username: profileUser.username,
    name: profileUser.username, // Using username as name if not available
    bio: profileUser.bio || "Digital nomad in the Social AI Platform matrix.",
    avatar: profileUser.avatar || "https://i.pravatar.cc/150",
    postsCount: posts.length,
    followersCount: profileUser.followers?.length || 0,
    followingCount: profileUser.following?.length || 0,
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex flex-1 pt-16">
        <Sidebar />

        <main className="flex-1 md:ml-64 lg:mr-80 bg-surface min-h-screen">
          {/* Profile Header */}
          <section className="bg-surface-container-low border-b border-white/5 pb-8">
            {/* Cover Image */}
            <div className="h-48 w-full bg-editorial-gradient relative">
                <img 
                    className="w-full h-full object-cover opacity-50" 
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop" 
                    alt="Cover" 
                />
            </div>

            <div className="max-w-4xl mx-auto px-6 -mt-12 flex flex-col md:flex-row items-end gap-6">
                <div className="w-32 h-32 rounded-full border-4 border-surface overflow-hidden shadow-2xl z-10">
                    <img className="w-full h-full object-cover" src={user.avatar} alt={user.username} />
                </div>
                <div className="flex-1 mb-2">
                    <div className="flex items-center gap-4 flex-wrap">
                        <h2 className="text-2xl font-bold text-white font-headline">@{user.username}</h2>
                        <button className="bg-surface-container-highest px-6 py-2 rounded-full text-sm font-bold text-white hover:bg-neutral-700 transition-all border border-white/5">
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 mt-6">
                <h1 className="text-xl font-bold text-white">{user.name}</h1>
                <p className="text-neutral-400 mt-2 max-w-xl">{user.bio}</p>
                
                <div className="flex items-center gap-8 mt-6">
                    <div className="text-center">
                        <p className="text-lg font-bold text-white">{user.postsCount}</p>
                        <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold font-headline">Posts</p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-bold text-white">{user.followersCount}</p>
                        <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold font-headline">Followers</p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-bold text-white">{user.followingCount}</p>
                        <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold font-headline">Following</p>
                    </div>
                </div>
            </div>
          </section>

          {/* Profile Tabs & Posts Grid */}
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="flex items-center justify-center gap-12 border-b border-white/5 mb-8">
                <button className="pb-4 border-b-2 border-primary text-primary text-xs font-bold uppercase tracking-widest">Posts</button>
                <button className="pb-4 text-neutral-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">Saved</button>
                <button className="pb-4 text-neutral-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">Tagged</button>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {posts.map(post => (
                    <PostCard key={post._id} post={post} />
                ))}
            </div>
          </div>
        </main>

        <RightSidebar />
      </div>

      <MobileNav />
    </div>
  );
}
