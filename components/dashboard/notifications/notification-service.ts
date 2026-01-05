import { createClient } from "@/utils/supabase/server";

export async function createNotification(params: {
    userId: string;
    actorId?: string; // Who triggered it
    type: 'task_assigned' | 'task_comment' | 'project_invite' | 'info';
    title: string;
    message: string;
    link?: string;
}) {
    const supabase = await createClient();

    // Safety check: Don't notify yourself 
    // (Optional: depending on UX. Usually you don't want a notification for your own action)
    if (params.userId === params.actorId) {
        return;
    }

    try {
        const { error } = await supabase
            .from('notifications')
            .insert({
                user_id: params.userId,
                actor_id: params.actorId || null,
                type: params.type,
                title: params.title,
                message: params.message,
                link: params.link,
                is_read: false,
            });

        if (error) {
            console.error('Error creating notification:', error);
        }
    } catch (e) {
        console.error('Exception creating notification:', e);
    }
}
