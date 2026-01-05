'use client';

import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    defaultDropAnimationSideEffects,
    DropAnimation
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useState, useEffect } from "react";
import { KanbanColumn } from "./kanban-column";
import { SortableTaskCard } from "./sortable-task-card";
import { TaskCard } from "../task-card";
import { updateTaskStatus } from "@/app/dashboard/projects/[id]/tasks/actions";

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

interface KanbanBoardProps {
    tasks: Task[];
    currentUserId: string;
}

const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: '0.5',
            },
        },
    }),
};

export function KanbanBoard({ tasks: initialTasks }: KanbanBoardProps) {
    // Optimistic State
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [activeId, setActiveId] = useState<string | null>(null);

    // Sync if server data changes
    useEffect(() => {
        setTasks(initialTasks);
    }, [initialTasks]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Avoid accidental drags
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Columns Derived State
    const todoTasks = tasks.filter(t => t.status === 'todo');
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
    const doneTasks = tasks.filter(t => t.status === 'done');

    const findTask = (id: string) => tasks.find(t => t.id === id);

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string);
    }

    function handleDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const activeTask = findTask(activeId as string);
        const overTask = findTask(overId as string);

        if (!activeTask) return;

        // Dropping over a Column (Empty or not)
        const isOverColumn = ['todo', 'in_progress', 'done'].includes(overId as string);

        // Scenario 1: Dragging over a different column container
        if (isOverColumn) {
            const newStatus = overId as Task['status'];
            if (activeTask.status !== newStatus) {
                setTasks((prev) => {
                    const activeIndex = prev.findIndex((t) => t.id === activeId);
                    const newTasks = [...prev];
                    newTasks[activeIndex] = { ...newTasks[activeIndex], status: newStatus };
                    return newTasks;
                });
            }
        }
        // Scenario 2: Dragging over another Task in a DIFFERENT column
        else if (overTask && activeTask.status !== overTask.status) {
            setTasks((prev) => {
                const activeIndex = prev.findIndex((t) => t.id === activeId);
                const overIndex = prev.findIndex((t) => t.id === overId);

                const newTasks = [...prev];
                // Change status to match the task we are hovering over
                newTasks[activeIndex] = { ...newTasks[activeIndex], status: overTask.status };

                // Simple reorder logic for now (just append or move)
                return arrayMove(newTasks, activeIndex, overIndex);
            });
        }
    }

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        const activeId = active.id as string;

        setActiveId(null);

        if (!over) return;

        const activeTask = tasks.find(t => t.id === activeId);
        if (!activeTask) return;

        // Determine final status based on where it was dropped
        // Logic handled in DragOver updates state optimistically
        // Here we just persist to DB

        // Note: The 'tasks' state is ALREADY updated by handleDragOver for cross-column moves
        // We just need to persist the final state of the active task

        // But what if we just reordered within the same column?
        // dnd-kit requires arrayMove for that if we want persistence of order
        // For now, we only care about STATUS persistence.

        try {
            await updateTaskStatus(activeTask.project_id, activeTask.id, activeTask.status);
        } catch (error) {
            console.error("Failed to update task status:", error);
            // Revert state would go here in a production app
        }
    }

    const activeTask = activeId ? findTask(activeId) : null;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex h-[calc(100vh-220px)] overflow-x-auto gap-6 pb-4 items-start">
                <KanbanColumn
                    id="todo"
                    title="To Do"
                    tasks={todoTasks}
                    color="bg-slate-400"
                />
                <KanbanColumn
                    id="in_progress"
                    title="In Progress"
                    tasks={inProgressTasks}
                    color="bg-blue-500"
                />
                <KanbanColumn
                    id="done"
                    title="Done"
                    tasks={doneTasks}
                    color="bg-emerald-500"
                />
            </div>

            <DragOverlay dropAnimation={dropAnimation}>
                {activeTask ? (
                    <div className="rotate-2 cursor-grabbing opacity-90 scale-105">
                        <TaskCard task={activeTask} />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
