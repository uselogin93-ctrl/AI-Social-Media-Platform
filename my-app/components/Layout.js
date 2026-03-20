"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { useAuth } from "@/context/AuthContext";

export default function Layout({ children, onCreatePostClick }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    { href: "/feed", label: "Home", icon: "home" },
    { href: "/messages", label: "Messages", icon: "chat_bubble" },
    { href: user ? `/profile/${user._id}` : "/feed", label: "Profile", icon: "person" },
    { href: "/feed", label: "Search", icon: "search" },
  ];

  return (
    <div className="flex min-h-screen pt-16">
      <nav className="fixed top-0 w-full z-50 bg-neutral-900/70 backdrop-blur-md flex items-center justify-between px-6 h-16">
        <Link href="/feed" className="text-xl font-bold tracking-tighter text-white font-headline">
          Digital Editorial
        </Link>
        <div className="hidden md:flex items-center gap-8 font-plus-jakarta text-sm font-medium tracking-tight">
          <Link className={pathname === "/feed" ? "text-blue-400 font-bold" : "text-neutral-400 hover:text-white transition-colors"} href="/feed">Home</Link>
          <Link className={pathname === "/messages" ? "text-blue-400 font-bold" : "text-neutral-400 hover:text-white transition-colors"} href="/messages">Explore</Link>
          <Link className="text-neutral-400 hover:text-white transition-colors" href="/feed">Trending</Link>
        </div>
        <div className="flex items-center gap-4 text-neutral-400">
          <span className="material-symbols-outlined hover:text-white cursor-pointer">notifications</span>
          <span className="material-symbols-outlined hover:text-white cursor-pointer">settings</span>
          {user ? (
            <div className="flex items-center gap-2">
              <Link href={user._id ? `/profile/${user._id}` : "/feed"}>
                <div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden ring-1 ring-white/10">
                  {user.avatar ? (
                    <img alt="Profile" className="w-full h-full object-cover" src={user.avatar} />
                  ) : (
                    <div className="w-full h-full bg-primary-container flex items-center justify-center text-on-primary text-sm font-bold">
                      {(user.username || "U")[0].toUpperCase()}
                    </div>
                  )}
                </div>
              </Link>
              <SignOutButton>
                <button className="text-xs text-outline hover:text-on-surface">Logout</button>
              </SignOutButton>
            </div>
          ) : (
            <Link href="/login" className="text-primary font-semibold">Login</Link>
          )}
        </div>
      </nav>
      <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-neutral-800 hidden md:flex flex-col gap-2 p-4">
        <div className="mb-4 px-4">
          <h3 className="font-headline text-xs font-bold uppercase tracking-widest text-neutral-500">Navigation</h3>
          <p className="text-[10px] text-neutral-600 font-medium">Main Menu</p>
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-full font-plus-jakarta text-base font-semibold transition-all ${
                pathname === item.href || (item.label === "Profile" && pathname?.startsWith("/profile"))
                  ? "bg-blue-500/10 text-blue-400"
                  : "text-neutral-400 hover:bg-neutral-700/50 hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined" style={pathname === item.href ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => (onCreatePostClick ? onCreatePostClick() : (window.location.href = "/feed"))}
          className="mt-6 mx-2 bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary-container/20 hover:opacity-90 w-full"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Create Post
        </button>
        <div className="mt-auto flex flex-col gap-2 border-t border-neutral-700/30 pt-4">
          <a className="flex items-center gap-3 text-neutral-500 px-4 py-2 hover:text-neutral-300 transition-colors text-sm" href="#">
            <span className="material-symbols-outlined text-xl">settings</span>
            Settings
          </a>
          <a className="flex items-center gap-3 text-neutral-500 px-4 py-2 hover:text-neutral-300 transition-colors text-sm" href="#">
            <span className="material-symbols-outlined text-xl">help</span>
            Help
          </a>
        </div>
      </aside>
      {children}
      <nav className="md:hidden fixed bottom-0 w-full h-16 bg-neutral-900/90 backdrop-blur-xl flex items-center justify-around px-4 z-50 border-t border-white/5">
        <Link href="/feed" className={pathname === "/feed" ? "text-blue-400" : "text-neutral-400"}>
          <span className="material-symbols-outlined text-2xl" style={pathname === "/feed" ? { fontVariationSettings: "'FILL' 1" } : {}}>home</span>
        </Link>
        <Link href="/feed" className="text-neutral-400">
          <span className="material-symbols-outlined text-2xl">search</span>
        </Link>
        <button
          onClick={() => (onCreatePostClick ? onCreatePostClick() : (window.location.href = "/feed"))}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary-container flex items-center justify-center shadow-lg shadow-primary-container/30"
        >
          <span className="material-symbols-outlined">add</span>
        </button>
        <Link href="/messages" className={pathname === "/messages" ? "text-blue-400" : "text-neutral-400"}>
          <span className="material-symbols-outlined text-2xl" style={pathname === "/messages" ? { fontVariationSettings: "'FILL' 1" } : {}}>chat_bubble</span>
        </Link>
        <Link href={user?._id ? `/profile/${user._id}` : "/feed"} className={pathname?.startsWith("/profile") ? "text-blue-400" : "text-neutral-400"}>
          {user?.avatar ? (
            <img alt="Profile" className="w-6 h-6 rounded-full object-cover ring-1 ring-neutral-700" src={user.avatar} />
          ) : (
            <span className="material-symbols-outlined text-2xl" style={pathname?.startsWith("/profile") ? { fontVariationSettings: "'FILL' 1" } : {}}>person</span>
          )}
        </Link>
      </nav>
    </div>
  );
}
