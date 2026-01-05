import { createClient } from "@/utils/supabase/server";
import { TaskList } from "@/components/dashboard/tasks/task-list";
import { KanbanBoard } from "@/components/dashboard/tasks/board/kanban-board";
import { ViewToggle } from "@/components/dashboard/tasks/view-toggle";
import { TaskDetailsModal } from "@/components/dashboard/tasks/task-details-modal";
import { redirect } from "next/navigation";

export default async function MyTasksPage(props: {
    searchParams: Promise<{ view?: string; task?: string }>;
}) {
    const searchParams = await props.searchParams;
    const supabase = await createClient();
    const view = searchParams.view || 'list';
    const taskId = searchParams.task;

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // Fetch ALL tasks assigned to me across ALL projects
    const { data: tasks, error } = await supabase
        .from('tasks')
        .select(`
            id,
            project_id,
            title,
            description,
            status,
            due_date,
            assignee_id,
            created_at,
            created_by,
            assignee:profiles!tasks_assignee_id_fkey (
                full_name,
                avatar_url
            )
        `)
        .eq('assignee_id', user.id)
        // .neq('status', 'done') // Removing filter as per user request (User wants to see Done tasks in Kanban)
        .order('due_date', { ascending: true });

    // Also need project members? For the modal? 
    // The Modal needs `members` to assign people. 
    // For "My Tasks" view spanning multiple projects, we can't easily fetch ALL members of ALL projects efficiently without a join.
    // However, usually "My Tasks" is for personal work. Changing assignee might not be primary use case.
    // Or we can fetch specific project members when task is opened? 
    // The Modal currently takes `members` as prop.
    // I'll leave members empty for now or fetch members of the current task's project if task is selected?

    let members: any[] = [];
    let selectedTask: any = null;

    if (taskId && tasks) {
        selectedTask = tasks.find((t: any) => t.id === taskId);
        if (selectedTask) {
            // Fetch members for this specific project so the modal works
            const { data: projectMembers } = await supabase
                .from('project_members')
                .select(`
                    user_id,
                    profiles (
                        id,
                        full_name,
                        avatar_url
                    )
                `)
                .eq('project_id', selectedTask.project_id);

            members = (projectMembers || []).map((m: any) => m.profiles).filter(Boolean);
        }
    }

    // Close modal function (server-side navigation)
    async function closeTaskModal() {
        "use server";
        redirect(`/dashboard/tasks?view=${view}`);
    }

    return (
        <div className="px-4 md:px-6 h-[calc(100vh-100px)] flex flex-col relative">
            {selectedTask && (
                <TaskDetailsModal
                    task={selectedTask}
                    currentUserId={user.id}
                    projectId={selectedTask.project_id}
                    onClose={closeTaskModal}
                // members={members} // TaskDetailsModal doesn't use members for creating tasks, maybe for assigning? 
                // Wait, TaskDetailsModal doesn't have assignee editing yet? It's read only for now in current implementation.
                />
            )}

            <div className="flex items-center justify-between mb-6 shrink-0 pt-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-slate-800">My Tasks</h2>
                    <ViewToggle baseUrl="/dashboard/tasks" />
                </div>
            </div>

            <div className="flex-1 min-h-0">
                {view === 'board' ? (
                    <p className="text-slate-400 italic">Kanban view is project-specific. Switch to List view for aggregated tasks.</p>
                    // OR we can implement Kanban if columns are generic.
                    // The KanbanBoard needs `updateTaskStatus`. It should work.
                    // But statuses are fixed.
                    // Let's try rendering KanbanBoard.
                    /*
                   <KanbanBoard
                       tasks={tasks as any}
                       currentUserId={user.id}
                   />
                   */
                ) : (
                    <TaskList
                        tasks={tasks as any}
                        currentUserId={user.id}
                        hideFilter={true}
                    />
                )}
                {view === 'board' && (
                    <KanbanBoard
                        tasks={tasks as any}
                        currentUserId={user.id}
                    />
                )}
            </div>
        </div>
    );
}