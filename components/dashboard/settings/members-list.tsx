'use client';

import { useState } from "react";
import { UserPlus, Trash2, User, AlertCircle, Check } from "lucide-react";
import { addMember, removeMember } from "@/app/dashboard/projects/[id]/settings/actions";

interface Member {
    user_id: string;
    profiles: {
        full_name: string;
        avatar_url: string | null;
        email: string | null;
    };
}

export function MembersList({ projectId, members, currentUserId }: { projectId: string, members: Member[], currentUserId: string }) {
    const [email, setEmail] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'error' | 'success', message: string } | null>(null);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        setFeedback(null); // Clear previous feedback

        setIsAdding(true);
        const result = await addMember(projectId, email);
        setIsAdding(false);

        if (result.error) {
            setFeedback({ type: 'error', message: result.error });
        } else {
            setEmail("");
            setFeedback({ type: 'success', message: 'User added successfully!' });
            // Auto-clear success message after 3s
            setTimeout(() => setFeedback(null), 3000);
        }
    };

    const handleRemove = async (userId: string) => {
        if (!confirm("Are you sure you want to remove this member?")) return;
        const result = await removeMember(projectId, userId);
        if (result.error) {
            alert(result.error); // Keep alert for destructive action fallback, or implement toast later
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Invite Member</h3>
                <form onSubmit={handleAdd} className="flex flex-col gap-3">
                    <div className="flex gap-2">
                        <input
                            type="email"
                            placeholder="Enter email address..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`
                                flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all
                                ${feedback?.type === 'error'
                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                    : 'border-slate-200 focus:border-[#3B8E8E] focus:ring-[#3B8E8E]/20'
                                }
                            `}
                            required
                        />
                        <button
                            type="submit"
                            disabled={isAdding}
                            className="bg-[#3B8E8E] hover:bg-[#2A6E6E] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                        >
                            <UserPlus size={18} />
                            {isAdding ? 'Adding...' : 'Add'}
                        </button>
                    </div>

                    {/* Feedback Messages */}
                    {feedback && (
                        <div className={`text-sm flex items-center gap-2 ${feedback.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                            {feedback.type === 'error' ? <AlertCircle size={14} /> : <Check size={14} />}
                            {feedback.message}
                        </div>
                    )}
                </form>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-bold text-slate-800">Project Members ({members.length})</h3>
                </div>
                <div className="divide-y divide-slate-100">
                    {members.map((member) => (
                        <div key={member.user_id} className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                                    {member.profiles.avatar_url ? (
                                        <img src={member.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="text-slate-400" size={20} />
                                    )}
                                </div>
                                <div>
                                    <div className="font-medium text-slate-900">{member.profiles.full_name}</div>
                                    <div className="text-sm text-slate-400">
                                        {member.profiles.email || 'No email visible'}
                                        {member.user_id === currentUserId && <span className="ml-2 text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-500">You</span>}
                                    </div>
                                </div>
                            </div>

                            {member.user_id !== currentUserId && (
                                <button
                                    onClick={() => handleRemove(member.user_id)}
                                    className="text-slate-300 hover:text-red-500 p-2 transition-colors"
                                    title="Remove Member"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
