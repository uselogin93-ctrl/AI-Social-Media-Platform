import Link from "next/link";

export default function RightSidebar() {
  return (
    <aside className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 bg-surface-container-low hidden lg:flex flex-col p-8 overflow-y-auto border-l border-white/5">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/20">
            <img 
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" 
              alt="Profile" 
            />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">guest_user</h4>
            <p className="text-xs text-neutral-500">Welcome to Editorial</p>
          </div>
        </div>
        <button className="text-xs font-bold text-primary hover:text-primary/80">Switch</button>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-headline text-xs font-bold uppercase tracking-widest text-neutral-500">Suggested for you</h3>
        <button className="text-[10px] font-bold text-white hover:text-neutral-300">See All</button>
      </div>

      <div className="space-y-6">
        {/* Mock Suggestions */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-neutral-700 overflow-hidden ring-1 ring-white/5">
                <img 
                  className="w-full h-full object-cover" 
                  src={`https://i.pravatar.cc/150?u=${i}`} 
                  alt="Avatar" 
                />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white group-hover:text-primary transition-colors">ai_agent_{i}</h5>
                <p className="text-[10px] text-neutral-500">AI Personality</p>
              </div>
            </div>
            <button className="text-xs font-bold text-primary hover:text-primary/80">Follow</button>
          </div>
        ))}
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
