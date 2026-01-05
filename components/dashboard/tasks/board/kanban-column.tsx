'use client';

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableTaskCard } from "./sortable-task-card";
import { MoreHorizontal, Plus } from "lucide-react";

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

interface KanbanColumnProps {
    id: 'todo' | 'in_progress' | 'done';
    title: string;
    tasks: Task[];
    color: string;
}

export function KanbanColumn({ id, title, tasks, color }: KanbanColumnProps) {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div className="flex flex-col h-full bg-slate-50/50 rounded-xl border border-slate-200/60 min-w-[300px]">
            {/* Header */}
            <div className="p-3 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${color}`} />
                    <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">
                        {title}
                    </h3>
                    <span className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full font-medium">
                        {tasks.length}
                    </span>
                </div>
                <button className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100">
                    <MoreHorizontal size={16} />
                </button>
            </div>

            {/* Droppable Area */}
            <div
                ref={setNodeRef}
                className="flex-1 p-3 space-y-3 overflow-y-auto min-h-[150px]"
            >
                <SortableContext
                    items={tasks.map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {tasks.map(task => (
                        <SortableTaskCard key={task.id} task={task} />
                    ))}
                </SortableContext>

                {tasks.length === 0 && (
                    <div className="h-24 border-2 border-dashed border-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-sm italic">
                        No tasks
                    </div>
                )}
            </div>

            {/* Footer Action */}
            <div className="p-3 pt-0">
                <button className="w-full py-2 flex items-center justify-center gap-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100/80 rounded-lg text-sm transition-colors border border-transparent hover:border-slate-200 border-dashed">
                    <Plus size={16} />
                    Add Task
                </button>
            </div>
        </div>
    );
}
