'use client';

import { Calendar, User as UserIcon, MoreVertical, Trash2, CheckCircle, Clock, Circle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { updateTaskStatus, deleteTask } from "@/app/dashboard/projects/[id]/tasks/actions";
import { createClient } from "@/utils/supabase/client";

interface Task {
    id: string;
    project_id: string; // Needed for actions
    title: string;
    description?: string;
    status: 'todo' | 'in_progress' | 'done';
    due_date?: string;
    assignee?: {
        full_name?: string | null;
        avatar_url?: string | null;
    };
}

interface TaskCardProps {
    task: Task;
    onClick?: () => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
    const [currentStatus, setCurrentStatus] = useState(task.status);
    const [isDeleted, setIsDeleted] = useState(false);
    const [showStatusMenu, setShowStatusMenu] = useState(false);
    const [showActionsMenu, setShowActionsMenu] = useState(false);
    const statusMenuRef = useRef<HTMLDivElement>(null);
    const actionsMenuRef = useRef<HTMLDivElement>(null);

    // Close menus when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (statusMenuRef.current && !statusMenuRef.current.contains(event.target as Node)) {
                setShowStatusMenu(false);
            }
            if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target as Node)) {
                setShowActionsMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleStatusChange = async (newStatus: 'todo' | 'in_progress' | 'done') => {
        const oldStatus = currentStatus;
        setCurrentStatus(newStatus); // Optimistic Update
        setShowStatusMenu(false);

        const result = await updateTaskStatus(task.project_id, task.id, newStatus);
        if (result.error) {
            alert("Failed to update status");
            setCurrentStatus(oldStatus); // Rollback
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this task?")) return;

        setIsDeleted(true); // Optimistic Hide
        const result = await deleteTask(task.project_id, task.id);

        if (result.error) {
            alert("Failed to delete task");
            setIsDeleted(false); // Rollback
        }
    };

    if (isDeleted) return null;

    const statusConfig = {
        todo: {
            label: 'To Do',
            color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
            icon: Circle
        },
        in_progress: {
            label: 'In Progress',
            color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/30',
            icon: Clock
        },
        done: {
            label: 'Done',
            color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-900/30',
            icon: CheckCircle
        },
    };

    const StatusIcon = statusConfig[currentStatus].icon;

    return (
        <article
            onClick={onClick}
            className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-lg border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group relative cursor-pointer"
        >

            {/* Header & Status */}
            <div className="flex justify-between items-start mb-2 relative">
                <div className="relative" ref={statusMenuRef}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowStatusMenu(!showStatusMenu);
                        }}
                        className={`
                            px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold border flex items-center gap-1.5 transition-colors
                            ${statusConfig[currentStatus].color} hover:opacity-80
                        `}
                    >
                        <StatusIcon size={12} />
                        {statusConfig[currentStatus].label}
                    </button>

                    {/* Status Dropdown */}
                    {showStatusMenu && (
                        <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 z-50 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            {(Object.keys(statusConfig) as Array<keyof typeof statusConfig>).map((status) => {
                                const Icon = statusConfig[status].icon;
                                return (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusChange(status)}
                                        className={`
                                            w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700/50
                                            ${currentStatus === status ? 'text-[#3B8E8E] font-medium bg-teal-50 dark:bg-teal-900/10' : 'text-slate-600 dark:text-slate-300'}
                                        `}
                                    >
                                        <Icon size={14} />
                                        {statusConfig[status].label}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Actions Menu Trigger */}
                <div className="relative" ref={actionsMenuRef}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowActionsMenu(!showActionsMenu);
                        }}
                        className="text-slate-300 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-300 p-1 rounded-md transition-colors"
                    >
                        <MoreVertical size={16} />
                    </button>

                    {/* Actions Dropdown */}
                    {showActionsMenu && (
                        <div className="absolute top-full right-0 mt-1 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 z-50 py-1 overflow-hidden">
                            <button
                                onClick={handleDelete}
                                className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                <Trash2 size={14} />
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Task Content */}
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm sm:text-base mb-2 group-hover:text-[#3B8E8E] dark:group-hover:text-[#3B8E8E] transition-colors wrap-break-word line-clamp-2">
                {task.title}
            </h3>

            {task.description && (
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                    {task.description}
                </p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800">
                <div className="flex items-center text-slate-400 dark:text-slate-500 text-[10px] sm:text-xs">
                    {task.due_date && (
                        <>
                            <Calendar size={12} className="mr-1" />
                            {new Date(task.due_date).toLocaleDateString()}
                        </>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {task.assignee ? (
                        <>
                            <span className="text-xs text-slate-400 dark:text-slate-500 max-w-[80px] truncate hidden sm:inline">
                                {task.assignee.full_name}
                            </span>
                            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0 border border-white dark:border-slate-600 shadow-sm" title={task.assignee.full_name || 'Assignee'}>
                                {task.assignee.avatar_url ? (
                                    <img src={task.assignee.avatar_url} alt="Assignee" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-500 dark:text-slate-300">
                                        {task.assignee.full_name?.[0]}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <span className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 italic flex items-center gap-1">
                            <UserIcon size={12} /> <span className="hidden sm:inline">Unassigned</span>
                        </span>
                    )}
                </div>
            </div>
        </article>
    );
}
