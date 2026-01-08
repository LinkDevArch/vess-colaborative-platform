import { createClient } from "@/utils/supabase/server";
import { ChatInterface } from "./chat-interface";

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { id } = await params;
    const { data: { user } } = await supabase.auth.getUser();

    // Initial Fetch of Messages
    const { data: messages } = await supabase
        .from('messages')
        .select(`
      id,
      content,
      created_at,
      sender_id,
      sender:profiles (
        full_name,
        avatar_url
      )
    `)
        .eq('project_id', id)
        .order('created_at', { ascending: true }); // Chronological order

    // Fetch Current User Profile (for optimistic UI)
    const { data: userProfile } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user?.id)
        .single();


    return (
        <div className="px-4 md:px-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Team Chat</h2>
            </div>

            <ChatInterface
                projectId={id}
                initialMessages={(messages as any) || []}
                currentUserId={user?.id || ''}
                currentUserProfile={userProfile}
            />
        </div>
    );
}
