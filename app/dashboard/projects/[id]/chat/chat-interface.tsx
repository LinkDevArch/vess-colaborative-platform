'use client';

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { sendMessage } from "./actions";
import { Send, User } from "lucide-react";

interface Message {
    id: string;
    content: string;
    created_at: string;
    sender_id: string;
    sender: {
        full_name: string;
        avatar_url: string | null;
    };
}

export function ChatInterface({
    projectId,
    initialMessages,
    currentUserId,
    currentUserProfile
}: {
    projectId: string;
    initialMessages: Message[];
    currentUserId: string;
    currentUserProfile: { full_name: string | null; avatar_url: string | null } | null;
}) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [newMessage, setNewMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Real-time Subscription
    useEffect(() => {
        const channel = supabase
            .channel(`project_chat:${projectId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `project_id=eq.${projectId}`
                },
                async (payload) => {
                    // New message received! 
                    const { data: senderData } = await supabase
                        .from('profiles')
                        .select('full_name, avatar_url')
                        .eq('id', payload.new.sender_id)
                        .single();

                    const incomingMessage: Message = {
                        id: payload.new.id,
                        content: payload.new.content,
                        created_at: payload.new.created_at,
                        sender_id: payload.new.sender_id,
                        sender: {
                            full_name: senderData?.full_name || 'Unknown',
                            avatar_url: senderData?.avatar_url || null
                        }
                    };

                    setMessages((prev) => {
                        // Optimistic Deduping:
                        // If the message is from me, find if there is a matching optimistic message
                        const isMine = incomingMessage.sender_id === currentUserId;

                        if (isMine) {
                            // Find the index of the first optimistic message that matches content
                            const optimisticIndex = prev.findIndex(msg =>
                                (msg as any).isOptimistic && msg.content === incomingMessage.content
                            );

                            if (optimisticIndex !== -1) {
                                // Replace optimistic with real
                                const newMessages = [...prev];
                                newMessages[optimisticIndex] = incomingMessage;
                                return newMessages;
                            }
                        }

                        // Otherwise, just append (it's someone else, or a non-optimistic insert)
                        // Verify we don't duplicate by ID just in case
                        if (prev.some(msg => msg.id === incomingMessage.id)) return prev;

                        return [...prev, incomingMessage];
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [projectId, supabase, currentUserId]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        const content = newMessage.trim();
        if (!content || isSending) return;

        setIsSending(true);
        setNewMessage(""); // Clear input immediately

        // 1. Optimistic Update
        const tempId = `temp-${Date.now()}`;
        const optimisticMessage: Message & { isOptimistic?: boolean } = {
            id: tempId,
            content: content,
            created_at: new Date().toISOString(),
            sender_id: currentUserId,
            sender: {
                full_name: currentUserProfile?.full_name || 'You',
                avatar_url: currentUserProfile?.avatar_url || null
            },
            isOptimistic: true
        };

        setMessages(prev => [...prev, optimisticMessage]);

        // 2. Server Action
        const result = await sendMessage(projectId, content);

        if (result.error) {
            alert("Failed to send message");
            setNewMessage(content); // Restore text
            setMessages(prev => prev.filter(msg => msg.id !== tempId)); // Remove optimistic
        }

        setIsSending(false);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-12rem)] border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-xs overflow-hidden transition-colors">

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50">
                {messages.map((msg) => {
                    const isMe = msg.sender_id === currentUserId;
                    return (
                        <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                            {/* Avatar */}
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 flex items-center justify-center">
                                {msg.sender.avatar_url ? (
                                    <img src={msg.sender.avatar_url} alt="Ava" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={16} className="text-slate-400 dark:text-slate-500" />
                                )}
                            </div>

                            {/* Bubble */}
                            <div className={`
                        max-w-[70%] p-3 rounded-2xl text-sm transition-colors
                        ${isMe
                                    ? 'bg-[#3B8E8E] text-white rounded-tr-none shadow-sm shadow-[#3B8E8E]/20'
                                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-none shadow-xs'
                                }
                    `}>
                                <div className={`text-xs font-bold mb-1 ${isMe ? 'text-teal-100' : 'text-slate-500 dark:text-slate-400'}`}>
                                    {msg.sender.full_name}
                                </div>
                                <p>{msg.content}</p>
                                <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-teal-100 opacity-70' : 'text-slate-400 dark:text-slate-500'}`}>
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-2 transition-colors">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B8E8E]/20 focus:border-[#3B8E8E] transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim() || isSending}
                    className="bg-[#3B8E8E] hover:bg-[#2A6E6E] disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors flex items-center justify-center w-10 h-10 shadow-lg shadow-[#3B8E8E]/20"
                >
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
}
