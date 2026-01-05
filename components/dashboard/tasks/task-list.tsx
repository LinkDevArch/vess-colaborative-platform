'use client';

import { useState } from "react";
import { CheckSquare, Filter } from "lucide-react";
import { TaskCard } from "./task-card";
import { useRouter, useSearchParams } from "next/navigation";

interface Task {
    id: string;
    project_id: string;
    title: string;
    description?: string;
    status: 'todo' | 'in_progress' | 'done';
    due_date?: string;
    assignee_id?: string;
    assignee?: {
        full_name?: string | null;
        avatar_url?: string | null;
    };
}

interface TaskListProps {
    tasks: Task[];
    currentUserId: string;
    hideFilter?: boolean;
}

export function TaskList({ tasks, currentUserId, hideFilter = false }: TaskListProps) {
    const [filter, setFilter] = useState<'all' | 'mine'>('all');
    const router = useRouter();
    const searchParams = useSearchParams();

    const filteredTasks = tasks.filter(task => {
        if (hideFilter) return true; // If filter hidden, show all (pre-filtered by parent)
        if (filter === 'mine') {
            return task.assignee_id === currentUserId;
        }
        return true;
    });

    const handleTaskClick = (taskId: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('task', taskId);
        router.push(`?${params.toString()}`);
    };

    return (
        <div>
            {/* Filter Controls */}
            {!hideFilter && (
                <div className="flex items-center justify-between mb-6">
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            All Tasks
                        </button>
                        <button
                            onClick={() => setFilter('mine')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'mine' ? 'bg-white text-[#3B8E8E] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            My Tasks
                        </button>
                    </div>
                    <div className="text-sm text-slate-400">
                        {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
                    </div>
                </div>
            )}

            {/* Grid */}
            {filteredTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                    <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                        <Filter className="text-slate-300" size={24} />
                    </div>
                    <p className="text-slate-500 font-medium">No tasks found</p>
                    {filter === 'mine' && <p className="text-slate-400 text-sm">Try switching to "All Tasks"</p>}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredTasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onClick={() => handleTaskClick(task.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
