"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import { api } from "@/lib/api";

function formatTime(date) {
  const d = new Date(date);
  const now = new Date();
  const diff = Math.floor((now - d) / 60000);
  if (diff < 60) return `${diff}m`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h`;
  if (diff < 43200) return "Yesterday";
  return `${Math.floor(diff / 1440)}d`;
}

export default function MessagesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userIdParam = searchParams.get("userId");
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    api("/messages/conversations")
      .then(setConversations)
      .catch(() => setConversations([]))
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  useEffect(() => {
    if (userIdParam && !selectedUser) {
      api(`/users/${userIdParam}`)
        .then((u) => setSelectedUser(u))
        .catch(() => {});
    }
  }, [userIdParam]);

  useEffect(() => {
    if (!selectedUser) {
      setMessages([]);
      return;
    }
    api(`/messages/${selectedUser._id}`).then(setMessages).catch(() => setMessages([]));
  }, [selectedUser]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;
    try {
      const msg = await api("/messages", {
        method: "POST",
        body: JSON.stringify({ receiverId: selectedUser._id, content: newMessage.trim() }),
      });
      setMessages((prev) => [...prev, msg]);
      setNewMessage("");
    } catch {}
  };

  if (authLoading || !user) return null;

  const displayUser = selectedUser || (conversations[0] && conversations[0].user);

  return (
    <Layout>
      <main className="md:ml-64 pt-16 h-screen flex overflow-hidden pb-16 md:pb-0">
        <section className="w-full md:w-96 flex-shrink-0 bg-surface-container-low flex flex-col">
          <div className="p-6">
            <h1 className="text-2xl font-headline font-extrabold tracking-tight mb-4">Messages</h1>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">search</span>
              <input className="w-full bg-surface-container border-none rounded-lg pl-10 pr-4 py-2 text-sm text-on-surface focus:ring-1 focus:ring-primary/30 placeholder-neutral-500" placeholder="Search conversations..." type="text" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1 px-2 pb-4">
            {loading ? (
              <div className="text-center text-on-surface-variant py-8">Loading...</div>
            ) : conversations.length === 0 ? (
              <div className="text-center text-on-surface-variant py-8">No conversations yet.</div>
            ) : (
              conversations.map(({ user: otherUser, lastMessage }) => (
                <div
                  key={otherUser._id}
                  onClick={() => setSelectedUser(otherUser)}
                  className={`p-4 rounded-xl flex items-center gap-4 cursor-pointer transition-colors ${
                    selectedUser?._id === otherUser._id ? "bg-surface-container-high" : "hover:bg-surface-container"
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-surface-container-highest overflow-hidden flex items-center justify-center text-on-surface font-bold">
                      {otherUser.avatar ? <img className="w-full h-full object-cover" alt={otherUser.username} src={otherUser.avatar} /> : (otherUser.username || "U")[0]}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-sm truncate font-headline">{otherUser.username}</h3>
                      <span className="text-[10px] text-neutral-500">{formatTime(lastMessage?.createdAt)}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant truncate">{lastMessage?.content || "No messages"}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
        <section className="hidden md:flex flex-1 flex-col bg-surface overflow-hidden">
          {displayUser ? (
            <>
              <div className="h-20 flex items-center justify-between px-8 bg-surface-container-low/50 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden flex items-center justify-center text-on-surface font-bold">
                    {displayUser.avatar ? <img className="w-full h-full object-cover" alt={displayUser.username} src={displayUser.avatar} /> : (displayUser.username || "U")[0]}
                  </div>
                  <div>
                    <h2 className="font-headline font-bold text-base leading-none">{displayUser.username}</h2>
                    <span className="text-xs text-on-surface-variant">Chat</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-6 flex flex-col">
                {messages.map((m) => {
                  const isMe = m.senderId?._id === user._id || m.senderId === user._id;
                  return (
                    <div key={m._id} className={`flex gap-4 max-w-[80%] ${isMe ? "flex-row-reverse self-end" : ""}`}>
                      <div className="space-y-1">
                        <div
                          className={`p-4 rounded-2xl text-sm leading-relaxed ${
                            isMe
                              ? "bg-gradient-to-br from-primary to-primary-container text-on-primary font-medium rounded-br-none"
                              : "bg-surface-container-high text-on-surface rounded-bl-none"
                          }`}
                        >
                          {m.content}
                        </div>
                        <span className={`text-[10px] text-neutral-500 block ${isMe ? "text-right mr-1" : "ml-1"}`}>
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <form onSubmit={handleSend} className="p-6 bg-surface-container-low/50 backdrop-blur-md">
                <div className="flex items-end gap-3 bg-surface-container p-2 rounded-2xl focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                  <textarea
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 resize-none placeholder-neutral-500 max-h-32"
                    placeholder="Type a message..."
                    rows={1}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button type="submit" className="bg-primary text-on-primary p-2 rounded-xl flex items-center justify-center hover:opacity-90 active:scale-95 transition-all">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-on-surface-variant">
              Select a conversation or start a new chat from a user profile.
            </div>
          )}
        </section>
      </main>
    </Layout>
  );
}
