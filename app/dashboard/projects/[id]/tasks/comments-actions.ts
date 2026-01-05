'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addComment(projectId: string, taskId: string, content: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Unauthorized' };

    // Optimistically returning the user profile for UI updates
    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single();

    const { data: comment, error } = await supabase
        .from('task_comments')
        .insert({
            task_id: taskId,
            user_id: user.id,
            content
        })
        .select()
        .single();

    if (error) {
        console.error("Error adding comment:", error);
        return { error: 'Failed to add comment' };
    }

    revalidatePath(`/dashboard/projects/${projectId}/tasks`);

    // Return complete comment object for UI
    return {
        data: {
            ...comment,
            user_id: user.id,
            profiles: profile // Attached for UI convenience
        }
    };
}

export async function getComments(taskId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('task_comments')
        .select(`
            id,
            content,
            created_at,
            user_id,
            profiles (
                full_name,
                avatar_url
            )
        `)
        .eq('task_id', taskId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error("Error fetching comments:", error);
        return [];
    }

    return data;
}
