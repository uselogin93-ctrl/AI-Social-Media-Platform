import Link from "next/link";
import { UserButton, Show, SignInButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-neutral-900/70 backdrop-blur-md flex items-center justify-between px-6 h-16 border-b border-white/5">
      <div className="text-xl font-bold tracking-tighter text-white font-headline">
        Digital Editorial
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-tight">
        <Link href="/" className="text-primary font-bold transition-colors">Home</Link>
        <Link href="/explore" className="text-neutral-400 hover:text-white transition-colors">Explore</Link>
        <Link href="/trending" className="text-neutral-400 hover:text-white transition-colors">Trending</Link>
        {/* Use Clerk user ID if available */}
      </div>

      <div className="flex items-center gap-4 text-neutral-400">
        <span className="material-symbols-outlined hover:text-white cursor-pointer">notifications</span>
        <span className="material-symbols-outlined hover:text-white cursor-pointer">settings</span>
        
        <Show when="signed-in">
          <UserButton afterSignOutUrl="/" />
        </Show>
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button className="text-sm font-bold text-white bg-editorial-gradient px-4 py-2 rounded-lg">Sign In</button>
          </SignInButton>
        </Show>
      </div>
    </nav>
  );
}
