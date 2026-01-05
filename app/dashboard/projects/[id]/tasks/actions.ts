'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/components/dashboard/notifications/notification-service";

export async function createTask(projectId: string, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'You must be logged in' };
    }

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const dueDate = formData.get('due_date') as string;
    const assigneeId = formData.get('assignee_id') as string;

    if (!title) {
        return { error: 'Title is required' };
    }

    const { error } = await supabase
        .from('tasks')
        .insert({
            project_id: projectId,
            title,
            description,
            status: 'todo',
            assignee_id: assigneeId || null,
            created_by: user.id,
            due_date: dueDate || null,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating task:", error);
        return { error: 'Failed to create task' };
    }

    // Trigger Notification
    if (assigneeId && assigneeId !== user.id) {
        // Fetch project name for the notification
        const { data: project } = await supabase.from('projects').select('name').eq('id', projectId).single();

        await createNotification({
            userId: assigneeId,
            actorId: user.id,
            type: 'task_assigned',
            title: 'New Task Assigned',
            message: `${user.user_metadata.full_name || 'Someone'} assigned you a new task in ${project?.name || 'a project'}: "${title}"`,
            link: `/dashboard/projects/${projectId}/tasks` // Can we deep link to task? Yes `?task=${taskId}` but we don't have ID returned from insert yet?
            // Upsert returns data if select is used. 
        });
    }

    revalidatePath(`/dashboard/projects/${projectId}/tasks`);
    return { success: true };
}

export async function updateTaskStatus(projectId: string, taskId: string, status: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Unauthorized' };

    const { error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', taskId)
        .eq('project_id', projectId); // Extra safety check

    if (error) {
        console.error("Error updating task:", error);
        return { error: 'Failed to update task' };
    }

    revalidatePath(`/dashboard/projects/${projectId}/tasks`);
    return { success: true };
}

export async function deleteTask(projectId: string, taskId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Unauthorized' };

    const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .eq('project_id', projectId);

    if (error) {
        console.error("Error deleting task:", error);
        return { error: 'Failed to delete task' };
    }

    revalidatePath(`/dashboard/projects/${projectId}/tasks`);
    return { success: true };
}
