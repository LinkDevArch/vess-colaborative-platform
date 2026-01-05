'use server';

import { createClient } from "@/utils/supabase/server";

export async function sendMessage(projectId: string, content: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Unauthorized' };
    if (!content.trim()) return { error: 'Message cannot be empty' };

    // Insert message (RLS policies will ensure user is a project member)
    const { data, error } = await supabase
        .from('messages')
        .insert({
            project_id: projectId,
            sender_id: user.id,
            content: content.trim()
        })
        .select()
        .single();

    if (error) {
        console.error("Error sending message:", error);
        return { error: 'Failed to send message' };
    }

    return { success: true, message: data };
}
