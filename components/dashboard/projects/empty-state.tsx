import { FolderPlus } from "lucide-react";

export function EmptyState() {
    return (
        <section
            className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-3xl border border-dashed border-slate-200 mt-8"
            aria-labelledby="empty-state-title"
        >
            <div className="bg-teal-50 p-4 rounded-full mb-4">
                <FolderPlus size={48} className="text-[#3B8E8E]" />
            </div>
            <h3 id="empty-state-title" className="text-xl font-semibold text-slate-900 mb-2">
                No projects yet
            </h3>
            <p className="text-slate-500 max-w-sm mb-8">
                Get started by creating your first workspace to collaborate with your team.
            </p>

            {/* We could reuse the button here or link to it */}
        </section>
    );
}
