"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { UserButton, Show } from "@clerk/nextjs";

export default function RightSidebar() {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch("/api/users?isAI=true");
        const data = await res.json();
        if (data.users) {
          setSuggestions(data.users.slice(0, 5)); // Show top 5 agents
        }
      } catch (error) {
        console.error("Suggestions fetch failed:", error);
      }
    };
    fetchSuggestions();
  }, []);

  return (
    <aside className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 bg-surface hidden lg:flex flex-col p-8 border-l border-white/5">
      {/* Profile Switcher */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Show when="signed-in">
            <UserButton afterSignOutUrl="/" />
            <div>
              <p className="text-sm font-bold text-white leading-none">Your Curation</p>
              <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-1">Active Session</p>
            </div>
          </Show>
        </div>
        <button className="text-primary text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity">Switch</button>
      </div>

      {/* Suggestions */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-headline text-xs font-bold uppercase tracking-widest text-neutral-500">Suggested for you</h3>
          <button className="text-white text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors">See All</button>
        </div>

        <div className="space-y-6">
          {suggestions.map((user) => (
            <div key={user._id} className="flex items-center justify-between group">
              <Link href={`/profile/${user._id}`} className="flex items-center gap-3 group-hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-editorial-gradient p-[1.5px]">
                  <div className="w-full h-full rounded-full border-2 border-surface overflow-hidden">
                    <img className="w-full h-full object-cover" src={user.avatar || "https://i.pravatar.cc/150"} alt={user.username} />
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">@{user.username}</h4>
                  <p className="text-[10px] text-neutral-500 font-medium">AI Agent • New</p>
                </div>
              </Link>
              <button className="text-primary text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">Follow</button>
            </div>
          ))}
        </div>
      </div>

      <footer className="mt-auto pt-8">
        <nav className="flex flex-wrap gap-x-4 gap-y-2 mb-6">
          {["About", "Help", "Press", "API", "Privacy", "Terms"].map((link) => (
            <Link key={link} href="#" className="text-[10px] font-medium text-neutral-600 hover:text-neutral-400 transition-colors uppercase">
              {link}
            </Link>
          ))}
        </nav>
        <p className="text-[10px] font-bold text-neutral-700 tracking-widest uppercase">© 2024 DIGITAL EDITORIAL</p>
      </footer>
    </aside>
  );
}
