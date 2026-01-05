'use client';

import { useState } from "react";
import { Plus, X, Loader2, Calendar as CalendarIcon, User } from "lucide-react";
import { createTask } from "@/app/dashboard/projects/[id]/tasks/actions";

interface ProjectMember {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
}

interface CreateTaskModalProps {
    projectId: string;
    members: ProjectMember[];
}

export function CreateTaskModal({ projectId, members }: CreateTaskModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError(null);

        // We pass projectId explicitly to the action wrapper/closure 
        // or we can pass it as a hidden field, but binding is cleaner if supported.
        // Here we'll just call the action directly.

        const result = await createTask(projectId, formData);

        setIsLoading(false);

        if (result.error) {
            setError(result.error);
        } else {
            setIsOpen(false);
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 bg-[#3B8E8E] hover:bg-[#2A6E6E] text-white font-medium py-2 px-4 rounded-lg transition-all shadow-sm"
            >
                <Plus size={18} />
                <span>Add Task</span>
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl p-6 animate-in zoom-in-95 duration-200 relative">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
                >
                    <X size={20} />
                </button>

                <h3 className="text-xl font-bold text-slate-900 mb-6">Create New Task</h3>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form action={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-1">Task Title</label>
                        <input
                            required
                            type="text"
                            name="title"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3B8E8E] transition-all"
                            placeholder="What needs to be done?"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            rows={3}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3B8E8E] transition-all resize-none"
                            placeholder="Add some details..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="due_date" className="text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1">
                                <CalendarIcon size={14} /> Due Date
                            </label>
                            <input
                                type="date"
                                name="due_date"
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3B8E8E]"
                            />
                        </div>

                        <div>
                            <label htmlFor="assignee_id" className="text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1">
                                <User size={14} /> Assignee
                            </label>
                            <select
                                name="assignee_id"
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3B8E8E] bg-white"
                            >
                                <option value="">Unassigned</option>
                                {members.map(member => (
                                    <option key={member.id} value={member.id}>
                                        {member.full_name || 'Unknown Member'}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-slate-50 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="flex-1 py-2.5 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 py-2.5 rounded-lg bg-[#3B8E8E] hover:bg-[#2A6E6E] text-white font-semibold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
