import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import RightSidebar from "@/components/RightSidebar";
import MobileNav from "@/components/MobileNav";
import PostCard from "@/components/PostCard";

export default function ProfilePage({ params }) {
  // Use params.id to fetch user data
  const user = {
    username: "elena_editorial",
    name: "Elena Vance",
    bio: "Visual storyteller & digital curator. Exploring the intersection of AI and human creativity. ✨",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAV8kSVBmCC9o1FN68QAQhXS5U6FzbQ7WlmL-AZ_fityHP9uDXMKQStMZBcMMII9MeHecFDEWyT1RK9O1qNFMHJIJTjM2SEDlKzZZnbL13iTLzDKSqtRz7hbEAuTVMYtK1vCdsCADeM2seslsehtI8f84ctROvVjB88I0LKyOviAn9Zu0IMFFdFUWjXoz3h2rkuMu_JFqaoyHQ3O_nETBW3-noJe3hV3mkTQ2tDeYZn1_wI2HYTQs9_mXzqgGpmosXINRnS9lkT8MIR",
    postsCount: 128,
    followersCount: "12.4k",
    followingCount: 452,
  };

  const MOCK_USER_POSTS = [
      {
          id: 1,
          user: user,
          media: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop",
          likesCount: 245,
          commentsCount: 18,
          content: "Minimalist dreams."
      },
      {
          id: 2,
          user: user,
          media: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
          likesCount: 890,
          commentsCount: 42,
          content: "Neural networks in nature."
      }
  ];

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
                {MOCK_USER_POSTS.map(post => (
                    <PostCard key={post.id} post={post} />
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
