'use client';

import { useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { createProject } from "@/app/dashboard/projects/actions";

// Predefined palette based on the user's image
const COLORS = [
    '#3B8E8E', // Teal (Brand)
    '#3B82F6', // Blue
    '#F59E0B', // Orange/Yellow
    '#EF4444', // Red/Salmon
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#10B981', // Green
    '#6366F1', // Indigo
];

export function CreateProjectModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError(null);

        // Append the selected color since it's state, not an input
        formData.append('color', selectedColor);

        const result = await createProject(formData);

        setIsLoading(false);

        if (result.error) {
            setError(result.error);
        } else {
            setIsOpen(false);
            // Reset form if needed, though unmounting handles it usually
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 bg-[#3B8E8E] hover:bg-[#2A6E6E] text-white font-medium py-2.5 px-5 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
                <Plus size={20} />
                <span>New Project</span>
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200 relative">

                {/* Close Button */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-slate-900 mb-6">Create New Project</h2>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form action={handleSubmit} className="space-y-6">
                    {/* Name Input */}
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-semibold text-slate-700">
                            Project Name
                        </label>
                        <input
                            required
                            type="text"
                            id="name"
                            name="name"
                            placeholder="e.g. Marketing Campaign 2026"
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3B8E8E] focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Color Picker */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">
                            Card Color
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {COLORS.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setSelectedColor(color)}
                                    className={`w-10 h-10 rounded-full transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3B8E8E] ${selectedColor === color ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : ''}`}
                                    style={{ backgroundColor: color }}
                                    aria-label={`Select color ${color}`}
                                    aria-pressed={selectedColor === color}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Description Input */}
                    <div className="space-y-2">
                        <label htmlFor="description" className="text-sm font-semibold text-slate-700">
                            Description <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={3}
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3B8E8E] focus:border-transparent transition-all resize-none"
                            placeholder="Briefly describe your project..."
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="flex-1 py-3 px-4 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 py-3 px-4 rounded-lg bg-[#3B8E8E] hover:bg-[#2A6E6E] text-white font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading && <Loader2 size={18} className="animate-spin" />}
                            {isLoading ? 'Creating...' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
