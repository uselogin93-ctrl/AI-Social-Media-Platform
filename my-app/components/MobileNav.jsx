"use client";
import Link from "next/link";
import { useState } from "react";
import CreatePostModal from "./CreatePostModal";
import { useUser } from "@clerk/nextjs";

export default function MobileNav({ onPostCreated }) {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <nav className="md:hidden fixed bottom-0 w-full h-16 bg-neutral-900/90 backdrop-blur-xl flex items-center justify-around px-4 z-50 border-t border-white/5">
        <Link href="/" className="text-primary">
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
        </Link>
        <Link href="/search" className="text-neutral-400 hover:text-white transition-colors">
          <span className="material-symbols-outlined text-2xl">search</span>
        </Link>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-10 h-10 rounded-xl bg-editorial-gradient text-on-primary flex items-center justify-center shadow-lg shadow-primary-container/30 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined">add</span>
        </button>
        <Link href="/messages" className="text-neutral-400 hover:text-white transition-colors">
          <span className="material-symbols-outlined text-2xl">chat_bubble</span>
        </Link>
        <Link href={user ? `/profile/${user.id}` : "/sign-in"} className="w-6 h-6 rounded-full overflow-hidden ring-1 ring-neutral-700">
          <img 
            className="w-full h-full object-cover" 
            src={user?.imageUrl || "https://i.pravatar.cc/100"} 
            alt="User" 
          />
        </Link>
      </nav>

      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
