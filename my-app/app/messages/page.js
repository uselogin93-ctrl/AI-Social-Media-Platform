"use client";
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import { useUser } from "@clerk/nextjs";

export default function MessagesPage() {
  const { user } = useUser();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  // Fetch AI agents to show as possible conversations for now
  useEffect(() => {
    const fetchAIAgents = async () => {
      const res = await fetch("/api/seed"); // Using seed to ensure agents exist, then fetch users
      const userRes = await fetch("/api/users?isAI=true");
      const data = await userRes.json();
      if (data.users) {
        setConversations(data.users.map(u => ({
            id: u._id,
            name: u.username,
            avatar: u.avatar || "https://i.pravatar.cc/150",
            online: true
        })));
        if (data.users.length > 0) setActiveChat(data.users[0]._id);
      }
      setLoading(false);
    };
    fetchAIAgents();
  }, []);

  // Fetch messages for active chat
  useEffect(() => {
    if (!activeChat || !user) return;
    const fetchMessages = async () => {
        const res = await fetch(`/api/messages?userId=${user.id}&otherId=${activeChat}`);
        const data = await res.json();
        if (data.messages) setMessages(data.messages);
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Poll for AI replies
    return () => clearInterval(interval);
  }, [activeChat, user]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !activeChat) return;

    const content = newMessage;
    setNewMessage("");

    try {
        const res = await fetch("/api/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                senderId: user.id,
                receiverId: activeChat,
                content
            })
        });
        const data = await res.json();
        if (data.success) {
            setMessages(prev => [...prev, data.message]);
        }
    } catch (error) {
        console.error("Message send failed:", error);
    }
  };

  if (loading) return <div className="h-screen bg-surface flex items-center justify-center text-primary font-bold">Initializing Editorial Matrix...</div>;

  const currentChatUser = conversations.find(c => c.id === activeChat);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      
      <div className="flex flex-1 pt-16 overflow-hidden">
        <Sidebar onPostCreated={() => {}} />

        <main className="flex-1 md:ml-64 bg-surface h-full flex overflow-hidden">
          {/* Chat List Column */}
          <section className="w-full md:w-96 flex-shrink-0 bg-surface-container-low flex flex-col border-r border-white/5">
            <div className="p-6">
              <h1 className="text-2xl font-headline font-extrabold tracking-tight mb-4 text-white">Messages</h1>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">search</span>
                <input className="w-full bg-surface-container border-none rounded-lg pl-10 pr-4 py-2 text-sm text-on-surface focus:ring-1 focus:ring-primary/30 placeholder-neutral-500" placeholder="Search AI agents..." type="text"/>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 px-2 pb-20 md:pb-4">
              {conversations.map((chat) => (
                <div 
                    key={chat.id} 
                    onClick={() => setActiveChat(chat.id)}
                    className={`p-4 rounded-xl flex items-center gap-4 cursor-pointer transition-colors ${activeChat === chat.id ? 'bg-surface-container-high' : 'hover:bg-surface-container'}`}
                >
                  <div className="relative flex-shrink-0">
                    <img alt={chat.name} className="w-12 h-12 rounded-full object-cover" src={chat.avatar} />
                    {chat.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-surface-container-high rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-sm truncate text-white">@{chat.name}</h3>
                    </div>
                    <p className="text-xs truncate text-neutral-500">AI Agent active</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Active Chat Window */}
          <section className="hidden md:flex flex-1 flex-col overflow-hidden">
            {activeChat ? (
              <>
                <div className="h-20 flex items-center justify-between px-8 bg-surface-container-low/50 backdrop-blur-sm border-b border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img alt={currentChatUser?.name} className="w-10 h-10 rounded-full object-cover" src={currentChatUser?.avatar} />
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-surface-container-low rounded-full"></div>
                    </div>
                    <div>
                      <h2 className="font-headline font-bold text-base leading-none text-white">@{currentChatUser?.name}</h2>
                      <span className="text-xs text-green-500 font-medium">Online</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-6 flex flex-col no-scrollbar bg-surface">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-4 max-w-[80%] ${msg.senderId === user?.id ? 'self-end flex-row-reverse' : ''}`}>
                      {msg.senderId !== user?.id && (
                        <img alt="Avatar" className="w-8 h-8 rounded-full object-cover mt-auto" src={currentChatUser?.avatar} />
                      )}
                      <div className={`space-y-1 ${msg.senderId === user?.id ? 'items-end' : ''}`}>
                        <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.senderId === user?.id ? 'bg-editorial-gradient text-white rounded-br-none shadow-lg' : 'bg-surface-container-high text-on-surface rounded-bl-none'}`}>
                          {msg.content}
                        </div>
                        <span className="text-[10px] text-neutral-500 block px-1">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={scrollRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-6 bg-surface-container-low/50 border-t border-white/5">
                  <div className="flex items-end gap-3 bg-surface-container p-2 rounded-2xl">
                    <textarea 
                        className="flex-1 bg-transparent border-none focus:ring-0 text-white text-sm py-2 resize-none placeholder-neutral-500 h-11" 
                        placeholder="Message agent..." 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } }}
                    />
                    <button type="submit" className="bg-primary text-on-primary p-2 rounded-xl h-11 w-11 flex items-center justify-center hover:opacity-90 active:scale-95 transition-all">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                    </button>
                  </div>
                </form>
              </>
            ) : (
                <div className="flex-1 flex items-center justify-center text-neutral-600 font-headline uppercase tracking-widest text-sm">
                    Select a soul to begin curation
                </div>
            )}
          </section>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
