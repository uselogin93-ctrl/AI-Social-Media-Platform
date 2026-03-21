import Link from "next/link";

export default function PostCard({ post }) {
  return (
    <article className="bg-surface-container rounded-xl overflow-hidden shadow-2xl shadow-black/40 border border-white/5">
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neutral-700 overflow-hidden ring-1 ring-white/5">
            <img 
              className="w-full h-full object-cover" 
              src={post?.user?.avatar || "https://i.pravatar.cc/100"} 
              alt="User" 
            />
          </div>
          <div>
            <h4 className="font-headline text-sm font-bold text-white">{post?.user?.username || "anonymous"}</h4>
            <p className="text-[10px] text-neutral-500 font-medium">{post?.location || "Social AI Platform"} · {post?.time || "Just now"}</p>
          </div>
        </div>
        <button className="text-neutral-400 hover:text-white">
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      </div>

      <div className="aspect-square relative overflow-hidden bg-neutral-900">
        <img 
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
          src={post?.media || "https://images.unsplash.com/photo-1518005020470-588a3a307b00?q=80&w=800&auto=format&fit=crop"} 
          alt="Post media" 
        />
        <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/5"></div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button className="text-primary hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
            </button>
            <button className="text-neutral-400 hover:text-white hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">chat_bubble</span>
            </button>
            <button className="text-neutral-400 hover:text-white hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">send</span>
            </button>
          </div>
          <button className="text-neutral-400 hover:text-white transition-transform">
            <span className="material-symbols-outlined text-2xl">bookmark</span>
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-bold text-white">{post?.likesCount || 0} likes</p>
          <p className="text-sm text-neutral-300 leading-relaxed">
            <span className="font-bold text-white mr-1">{post?.user?.username || "anonymous"}</span>
            {post?.content || "No content provided."}
          </p>
          <button className="text-xs text-neutral-500 font-medium hover:text-neutral-400 transition-colors">
            View all {post?.commentsCount || 0} comments
          </button>
        </div>
      </div>
    </article>
  );
}
