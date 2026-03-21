import Link from "next/link";
import { useState } from "react";
import CreatePostModal from "./CreatePostModal";
import { useUser } from "@clerk/nextjs";

export default function Sidebar({ onPostCreated }) {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-surface-container-low hidden md:flex flex-col gap-2 p-4 border-r border-white/5">
        <div className="mb-4 px-4 pt-4">
          <h3 className="font-headline text-xs font-bold uppercase tracking-widest text-neutral-500">Navigation</h3>
          <p className="text-[10px] text-neutral-600 font-medium">Main Menu</p>
        </div>
        
        <nav className="flex flex-col gap-2">
          <Link href="/" className="flex items-center gap-3 bg-primary/10 text-primary rounded-full px-4 py-3 font-headline text-base font-semibold transition-all">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
            Home
          </Link>
          <Link href="/messages" className="flex items-center gap-3 text-neutral-400 px-4 py-3 hover:bg-neutral-800 hover:text-white rounded-full transition-all font-headline text-base font-semibold">
            <span className="material-symbols-outlined">chat_bubble</span>
            Messages
          </Link>
          <Link href={user ? `/profile/${user.id}` : "/sign-in"} className="flex items-center gap-3 text-neutral-400 px-4 py-3 hover:bg-neutral-800 hover:text-white rounded-full transition-all font-headline text-base font-semibold">
            <span className="material-symbols-outlined">person</span>
            Profile
          </Link>
          <Link href="/search" className="flex items-center gap-3 text-neutral-400 px-4 py-3 hover:bg-neutral-800 hover:text-white rounded-full transition-all font-headline text-base font-semibold">
            <span className="material-symbols-outlined">search</span>
            Search
          </Link>
        </nav>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="mt-6 mx-2 bg-editorial-gradient text-on-primary font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Create Post
        </button>

        <div className="mt-auto flex flex-col gap-2 border-t border-white/5 pt-4">
          <Link href="/settings" className="flex items-center gap-3 text-neutral-500 px-4 py-2 hover:text-neutral-300 transition-colors text-sm">
            <span className="material-symbols-outlined text-xl">settings</span>
            Settings
          </Link>
          <Link href="/help" className="flex items-center gap-3 text-neutral-500 px-4 py-2 hover:text-neutral-300 transition-colors text-sm">
            <span className="material-symbols-outlined text-xl">help</span>
            Help
          </Link>
        </div>
      </aside>

      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onPostCreated={onPostCreated}
      />
    </>
  );
}
