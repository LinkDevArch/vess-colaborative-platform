import Link from "next/link";
import { FolderKanban } from "lucide-react";

interface ProjectDisplay {
    id: string;
    name: string;
    color: string;
    updated_at: string;
}

export function ProjectQuickLink({ project }: { project: ProjectDisplay }) {
    return (
        <Link
            href={`/dashboard/projects/${project.id}/tasks`}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 group transition-colors border border-transparent hover:border-slate-100"
        >
            <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0"
                style={{ backgroundColor: project.color || '#3B8E8E' }}
            >
                <FolderKanban size={18} />
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="font-medium text-slate-700 truncate group-hover:text-slate-900">
                    {project.name}
                </h4>
                <p className="text-xs text-slate-400">
                    Updated {new Date(project.updated_at).toLocaleDateString()}
                </p>
            </div>
        </Link>
    );
}
