import { createClient } from "@/utils/supabase/server";
import { TaskList } from "@/components/dashboard/tasks/task-list";
import { CreateTaskModal } from "@/components/dashboard/tasks/create-task-modal";
import { KanbanBoard } from "@/components/dashboard/tasks/board/kanban-board";
import { ViewToggle } from "@/components/dashboard/tasks/view-toggle";
import { TaskDetailsModal } from "@/components/dashboard/tasks/task-details-modal";
import { redirect } from "next/navigation";

export default async function TasksPage(props: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ view?: string; task?: string }>;
}) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const supabase = await createClient();
    const { id } = params;
    const view = searchParams.view || 'list';
    const taskId = searchParams.task;

    // Get Current User
    const { data: { user } } = await supabase.auth.getUser();

    // Parallel Fetching: Tasks AND Members (for the modal)
    const [tasksResult, membersResult] = await Promise.all([
        supabase
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
            .eq('project_id', id)
            .order('created_at', { ascending: false }),

        supabase
            .from('project_members')
            .select(`
        user_id,
        profiles (
           id,
           full_name,
           avatar_url
        )
      `)
            .eq('project_id', id)
    ]);

    const tasks = tasksResult.data || [];
    const members = (membersResult.data || [])
        .map(m => m.profiles)
        .filter(Boolean) as any[];

    if (tasksResult.error) console.error("Error fetching tasks:", tasksResult.error);

    const selectedTask = taskId ? tasks.find(t => t.id === taskId) : null;

    // Close modal function (server-side navigation)
    async function closeTaskModal() {
        "use server";
        redirect(`/dashboard/projects/${id}/tasks?view=${view}`);
    }

    return (
        <div className="px-4 md:px-6 flex flex-col relative min-h-full pb-20">
            {selectedTask && (
                <TaskDetailsModal
                    task={selectedTask}
                    currentUserId={user?.id || ''}
                    projectId={id}
                    onClose={closeTaskModal}
                />
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shrink-0">
                <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Tasks</h2>
                    <ViewToggle baseUrl={`/dashboard/projects/${id}/tasks`} />
                </div>
                <div className="w-full sm:w-auto">
                    <CreateTaskModal projectId={id} members={members} />
                </div>
            </div>

            <div className="flex-1 min-h-0">
                {view === 'board' ? (
                    <KanbanBoard
                        tasks={tasks as any}
                        currentUserId={user?.id || ''}
                    />
                ) : (
                    <TaskList
                        tasks={tasks as any}
                        currentUserId={user?.id || ''}
                    />
                )}
            </div>
        </div>
    );
}
