import Link from "next/link";
import { Clock, CheckCircle, Calendar, ArrowRight } from "lucide-react";

interface TaskDisplay {
    id: string;
    title: string;
    project_id: string;
    project_name: string;
    due_date?: string;
    status: string;
}

export function TaskOverviewCard({ task }: { task: TaskDisplay }) {
    const isOverdue = task.due_date && new Date(task.due_date) < new Date();

    return (
        <Link
            href={`/dashboard/projects/${task.project_id}/tasks?task=${task.id}`}
            className="block group bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200"
        >
            <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-100 dark:border-slate-700 truncate max-w-[100px] sm:max-w-xs">
                    {task.project_name}
                </span>
                {task.due_date && (
                    <div className={`flex items-center gap-1 text-xs font-medium ${isOverdue ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'}`}>
                        <Calendar size={12} />
                        {new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                )}
            </div>

            <h3 className="text-slate-800 dark:text-slate-100 font-semibold mb-3 group-hover:text-[#3B8E8E] dark:group-hover:text-[#3B8E8E] transition-colors line-clamp-2">
                {task.title}
            </h3>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                    {task.status === 'in_progress' ? (
                        <Clock size={14} className="text-blue-500" />
                    ) : (
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                    )}
                    <span className="capitalize">{task.status.replace('_', ' ')}</span>
                </div>
                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-[#3B8E8E]" />
            </div>
        </Link>
    );
}
