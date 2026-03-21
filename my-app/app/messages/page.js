import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";

const MOCK_CHATS = [
  {
    id: 1,
    user: {
      name: "Julian Vane",
      username: "julian_v",
      avatar: "https://i.pravatar.cc/150?u=jv",
      online: true,
    },
    lastMessage: "The editorial layout looks stunning! When can we launch?",
    time: "2m",
    unread: true,
  },
  {
    id: 2,
    user: {
      name: "Sarah Jenkins",
      username: "sarah_j",
      avatar: "https://i.pravatar.cc/150?u=sj",
      online: false,
    },
    lastMessage: "Did you see the latest photography series?",
    time: "1h",
    unread: false,
  }
];

export default function MessagesPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      
      <div className="flex flex-1 pt-16 overflow-hidden">
        <Sidebar />

        <main className="flex-1 md:ml-64 bg-surface h-full flex overflow-hidden">
          {/* Chat List Column */}
          <section className="w-full md:w-96 flex-shrink-0 bg-surface-container-low flex flex-col border-r border-white/5">
            <div className="p-6">
              <h1 className="text-2xl font-headline font-extrabold tracking-tight mb-4 text-white">Messages</h1>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">search</span>
                <input 
                  className="w-full bg-surface-container border-none rounded-lg pl-10 pr-4 py-2 text-sm text-on-surface focus:ring-1 focus:ring-primary/30 placeholder-neutral-500" 
                  placeholder="Search conversations..." 
                  type="text"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 px-2 pb-20 md:pb-4">
              {MOCK_CHATS.map((chat) => (
                <div key={chat.id} className={`p-4 rounded-xl flex items-center gap-4 cursor-pointer transition-colors ${chat.id === 1 ? 'bg-surface-container-high' : 'hover:bg-surface-container'}`}>
                  <div className="relative flex-shrink-0">
                    <img alt={chat.user.name} className="w-12 h-12 rounded-full object-cover" src={chat.user.avatar} />
                    {chat.user.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-surface-container-high rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-sm truncate text-white">{chat.user.name}</h3>
                      <span className={`text-[10px] font-bold ${chat.unread ? 'text-primary' : 'text-neutral-500'}`}>{chat.time}</span>
                    </div>
                    <p className={`text-xs truncate ${chat.unread ? 'text-on-surface' : 'text-neutral-500'}`}>{chat.lastMessage}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Active Chat Window */}
          <section className="hidden md:flex flex-1 flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="h-20 flex items-center justify-between px-8 bg-surface-container-low/50 backdrop-blur-sm border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img alt="Julian Vane" className="w-10 h-10 rounded-full object-cover" src="https://i.pravatar.cc/150?u=jv" />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-surface-container-low rounded-full"></div>
                </div>
                <div>
                  <h2 className="font-headline font-bold text-base leading-none text-white text-white">Julian Vane</h2>
                  <span className="text-xs text-green-500 font-medium">Online now</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-neutral-400">
                <span className="material-symbols-outlined hover:text-white cursor-pointer">videocam</span>
                <span className="material-symbols-outlined hover:text-white cursor-pointer">call</span>
                <span className="material-symbols-outlined hover:text-white cursor-pointer">more_vert</span>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 flex flex-col no-scrollbar">
              <div className="flex justify-center">
                <span className="bg-surface-container-highest/50 px-3 py-1 rounded-full text-[10px] text-neutral-400 font-bold tracking-widest uppercase">Today</span>
              </div>
              
              {/* Message Received */}
              <div className="flex gap-4 max-w-[80%]">
                <img alt="Julian" className="w-8 h-8 rounded-full object-cover mt-auto" src="https://i.pravatar.cc/150?u=jv" />
                <div className="space-y-1">
                  <div className="bg-surface-container-high p-4 rounded-2xl rounded-bl-none text-sm leading-relaxed text-on-surface">
                    Hey! I just reviewed the latest draft of the Digital Editorial concept. The use of tonal layering instead of borders is a game-changer.
                  </div>
                  <span className="text-[10px] text-neutral-500 block ml-1">10:24 AM</span>
                </div>
              </div>

              {/* Message Sent */}
              <div className="flex flex-row-reverse gap-4 max-w-[80%] self-end">
                <div className="space-y-1 items-end flex flex-col">
                  <div className="bg-editorial-gradient p-4 rounded-2xl rounded-br-none text-sm leading-relaxed text-on-primary font-medium shadow-lg shadow-primary/10">
                    Thanks Julian! I'm glad you like the "No-Line" rule. I felt the UI needed more breathing room for the photography.
                  </div>
                  <div className="flex items-center gap-1 mr-1">
                    <span className="text-[10px] text-neutral-500">10:26 AM</span>
                    <span className="material-symbols-outlined text-[10px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>done_all</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-6 bg-surface-container-low/50 backdrop-blur-md border-t border-white/5">
              <div className="flex items-end gap-3 bg-surface-container p-2 rounded-2xl focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                <button className="p-2 text-neutral-400 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">add_circle</span>
                </button>
                <textarea 
                  className="flex-1 bg-transparent border-none focus:ring-0 text-white text-sm py-2 resize-none placeholder-neutral-500 max-h-32" 
                  placeholder="Type a message..." 
                  rows="1"
                ></textarea>
                <div className="flex items-center gap-1">
                  <button className="p-2 text-neutral-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">mood</span>
                  </button>
                  <button className="bg-primary text-on-primary p-2 rounded-xl flex items-center justify-center hover:opacity-90 active:scale-95 transition-all ml-1">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
