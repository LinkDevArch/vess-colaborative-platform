import { Plus } from "lucide-react";

export function CreateProjectButton() {
    return (
        <button
            className="flex items-center gap-2 bg-transparent hover:bg-slate-100 text-slate-700 font-medium py-2 px-4 rounded-lg transition-all border border-slate-200 hover:border-slate-300"
            aria-label="Create a new project"
        >
            <Plus size={18} />
            <span>New Project</span>
        </button>
    );
}
