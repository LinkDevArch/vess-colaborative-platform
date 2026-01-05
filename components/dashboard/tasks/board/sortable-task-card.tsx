import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskCard } from "../task-card";
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

interface SortableTaskCardProps {
    task: Task;
}

export function SortableTaskCard({ task }: SortableTaskCardProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    const handleTaskClick = () => {
        if (isDragging) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set('task', task.id);
        router.push(`?${params.toString()}`);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="touch-none"
        >
            <TaskCard task={task as any} onClick={handleTaskClick} />
        </div>
    );
}
