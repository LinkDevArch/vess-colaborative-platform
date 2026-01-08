'use client';

import { useState } from "react";
import { updateProject } from "@/app/dashboard/projects/[id]/settings/actions";
import { Save, Loader2, AlertCircle, Check } from "lucide-react";

interface ProjectDetailsFormProps {
    projectId: string;
    initialName: string;
    initialColor: string;
}

const COLORS = [
    { name: 'Teal', hex: '#14b8a6', className: 'bg-teal-500' },
    { name: 'Blue', hex: '#3b82f6', className: 'bg-blue-500' },
    { name: 'Indigo', hex: '#6366f1', className: 'bg-indigo-500' },
    { name: 'Purple', hex: '#a855f7', className: 'bg-purple-500' },
    { name: 'Pink', hex: '#ec4899', className: 'bg-pink-500' },
    { name: 'Red', hex: '#ef4444', className: 'bg-red-500' },
    { name: 'Orange', hex: '#f97316', className: 'bg-orange-500' },
    { name: 'Emerald', hex: '#10b981', className: 'bg-emerald-500' },
];

export function ProjectDetailsForm({ projectId, initialName, initialColor }: ProjectDetailsFormProps) {
    const [name, setName] = useState(initialName);
    const [color, setColor] = useState(initialColor);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);

        const result = await updateProject(projectId, name, color);

        if (result.error) {
            setMessage({ type: 'error', text: result.error });
        } else {
            setMessage({ type: 'success', text: 'Project updated successfully' });
            // Clear success message after 3 seconds
            setTimeout(() => setMessage(null), 3000);
        }

        setIsSaving(false);
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xs border border-slate-200 dark:border-slate-800 overflow-hidden mb-8">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="font-semibold text-slate-800 dark:text-white">Project Details</h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Name Input */}
                <div>
                    <label htmlFor="projectName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Project Name
                    </label>
                    <input
                        id="projectName"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3B8E8E]/20 focus:border-[#3B8E8E] transition-all"
                        placeholder="My Awesome Project"
                        required
                    />
                </div>

                {/* Color Picker */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Project Color
                    </label>
                    <div className="flex flex-wrap gap-3">
                        {COLORS.map((c) => (
                            <button
                                key={c.hex}
                                type="button"
                                onClick={() => setColor(c.hex)}
                                className={`w-8 h-8 rounded-full ${c.className} transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3B8E8E] flex items-center justify-center
                                    ${color === c.hex ? 'ring-2 ring-offset-2 dark:ring-offset-slate-900 ring-slate-400 scale-110' : ''}
                                `}
                                title={c.name}
                            >
                                {color === c.hex && <Check size={14} className="text-white" />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Feedback Message */}
                {message && (
                    <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                        }`}>
                        {message.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
                        {message.text}
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-[#3B8E8E] hover:bg-[#2A6E6E] text-white px-6 py-2 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
