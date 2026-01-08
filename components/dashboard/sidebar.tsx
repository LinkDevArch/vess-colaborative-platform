import { createClient } from "@/utils/supabase/server";
import { SidebarClient } from "./sidebar-client";

interface SidebarProps {
    user: any;
}

export async function Sidebar({ user }: SidebarProps) {
    const supabase = await createClient();

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    return (
        <SidebarClient
            userEmail={user.email}
            fullName={profile?.full_name}
            avatarUrl={profile?.avatar_url}
        />
    );
}
