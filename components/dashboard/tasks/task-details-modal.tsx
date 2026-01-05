'use client';

import { useState, useEffect, useRef } from "react";
import { X, Calendar, User, MessageCircle, Send, CheckCircle, Clock } from "lucide-react";
import { addComment, getComments } from "@/app/dashboard/projects/[id]/tasks/comments-actions";
import { createClient } from "@/utils/supabase/client";

interface TaskDetailsModalProps {
    task: any;
    currentUserId: string;
    onClose: () => void;
    projectId: string;
}

export function TaskDetailsModal({ task, currentUserId, onClose, projectId }: TaskDetailsModalProps) {
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const commentsEndRef = useRef<HTMLDivElement>(null);
    const [isLoadingComments, setIsLoadingComments] = useState(true);

    // Initial fetch
    useEffect(() => {
        const fetchComments = async () => {
            const data = await getComments(task.id);
            setComments(data);
            setIsLoadingComments(false);
        };
        fetchComments();

        // Realtime subscription for comments
        const supabase = createClient();
        const channel = supabase
            .channel(`comments:${task.id}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'task_comments',
                filter: `task_id=eq.${task.id}`
            }, async (payload) => {
                // If the comment is from someone else, fetch the full data (with profile)
                if (payload.new.user_id !== currentUserId) {
                    const { data, error } = await supabase
                        .from('task_comments')
                        .select(`
                        id,
                        content,
                        created_at,
                        user_id,
                        profiles (
                            full_name,
                            avatar_url
                        )
                    `)
                        .eq('id', payload.new.id)
                        .single();

                    if (data) {
                        setComments(prev => [...prev, data]);
                    }
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [task.id, currentUserId]);

    // Auto-scroll to bottom
    useEffect(() => {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [comments]);


    const handleSendComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const tempId = Math.random().toString();
        const content = newComment;

        setIsSubmitting(true);
        setNewComment("");

        // Optimistic UI updates are tricky without the profile derived state passed down
        // For simplicity in this iteration, we accept a small loading state or we fetch profile earlier.
        // But wait! server action returns the profile!

        const result = await addComment(projectId, task.id, content);

        if (result.error) {
            // handle error
        } else if (result.data) {
            setComments(prev => [...prev, result.data]);
        }

        setIsSubmitting(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Close Button (Mobile) */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 md:hidden p-2 bg-slate-100 rounded-full text-slate-500 z-10"
                >
                    <X size={20} />
                </button>

                {/* LEFT: Task Details (65%) */}
                <div className="flex-1 flex flex-col border-r border-slate-100 h-full overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 bg-slate-50/30">
                        <div className="flex items-start justify-between mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider
                                ${task.status === 'done' ? 'bg-emerald-100 text-emerald-700' :
                                    task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                        'bg-slate-100 text-slate-600'}`}>
                                {task.status.replace('_', ' ')}
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 leading-tight mb-2">
                            {task.title}
                        </h2>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="prose prose-slate max-w-none">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Description</h3>
                            <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                                {task.description || "No description provided."}
                            </div>
                        </div>

                        <hr className="my-8 border-slate-100" />

                        {/* Activity / Comments */}
                        <div>
                            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-500 uppercase tracking-wide mb-6">
                                <MessageCircle size={16} />
                                Activity
                            </h3>

                            <div className="space-y-6 mb-20">
                                {isLoadingComments ? (
                                    <div className="text-center py-4 text-slate-400 text-sm">Loading comments...</div>
                                ) : comments.length === 0 ? (
                                    <div className="text-center py-8 text-slate-400 italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                        No comments yet. Start the conversation!
                                    </div>
                                ) : (
                                    comments.map((comment) => (
                                        <div key={comment.id} className="flex gap-4 group">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0">
                                                {comment.profiles?.avatar_url ? (
                                                    <img src={comment.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-[#3B8E8E] text-white text-xs font-bold">
                                                        {comment.profiles?.full_name?.[0] || '?'}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-baseline gap-2 mb-1">
                                                    <span className="font-semibold text-slate-800 text-sm">
                                                        {comment.profiles?.full_name || 'Unknown User'}
                                                    </span>
                                                    <span className="text-xs text-slate-400">
                                                        {new Date(comment.created_at).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="text-slate-700 text-sm bg-slate-50 p-3 rounded-r-xl rounded-bl-xl inline-block border border-slate-100">
                                                    {comment.content}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={commentsEndRef} />
                            </div>
                        </div>
                    </div>

                    {/* Comment Input (Fixed Bottom) */}
                    <div className="p-4 bg-white border-t border-slate-100">
                        <form onSubmit={handleSendComment} className="flex gap-2">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                className="flex-1 px-4 py-2.5 bg-slate-50 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B8E8E]/20 focus:border-[#3B8E8E] transition-all"
                            />
                            <button
                                type="submit"
                                disabled={!newComment.trim() || isSubmitting}
                                className="p-2.5 bg-[#3B8E8E] text-white rounded-xl hover:bg-[#2A6E6E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </div>
                </div>

                {/* RIGHT: Sidebar (35%) */}
                <div className="w-full md:w-[350px] bg-slate-50/50 p-6 flex flex-col gap-6 overflow-y-auto">
                    {/* Desktop Close */}
                    <div className="hidden md:flex justify-end">
                        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-6">

                        {/* Status */}
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                                Status
                            </label>
                            <div className="flex items-center gap-2 text-slate-700 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                                {task.status === 'done' ? <CheckCircle size={18} className="text-emerald-500" /> : <Clock size={18} className="text-blue-500" />}
                                <span className="capitalize">{task.status.replace('_', ' ')}</span>
                            </div>
                        </div>

                        {/* Assignee */}
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                                Assignee
                            </label>
                            <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                                <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden">
                                    {task.assignee?.avatar_url ? (
                                        <img src={task.assignee.avatar_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600">
                                            <User size={16} />
                                        </div>
                                    )}
                                </div>
                                <span className="text-sm font-medium text-slate-700">
                                    {task.assignee?.full_name || 'Unassigned'}
                                </span>
                            </div>
                        </div>

                        {/* Due Date */}
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                                Due Date
                            </label>
                            <div className="flex items-center gap-2 text-slate-700 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                                <Calendar size={18} className="text-slate-400" />
                                <span className="text-sm">
                                    {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
