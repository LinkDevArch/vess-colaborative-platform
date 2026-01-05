import { LayoutGrid } from "lucide-react";
import { NavLinks } from "./nav-links";
import { UserProfile } from "./user-profile";
import { createClient } from "@/utils/supabase/server";

interface SidebarProps {
    user: any; // We receive just the user to avoid re-fetching auth
}

export async function Sidebar({ user }: SidebarProps) {
    // Fetch profile internally for streaming
    const supabase = await createClient();

    // This await will only block the Sidebar streaming, not the main page
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    return (
        <aside className="w-20 lg:w-64 bg-white border-r border-slate-100 flex flex-col fixed h-full transition-all duration-300 z-10 left-0 top-0">
            {/* Logo */}
            <div className="h-20 flex items-center justify-center lg:justify-start lg:px-8 border-b border-slate-50 shrink-0">
                <div className="bg-black text-white p-2 rounded-lg transition-transform hover:scale-105 cursor-pointer">
                    <LayoutGrid size={24} />
                </div>
                <span className="hidden lg:block ml-3 font-bold text-xl tracking-wide text-slate-900">VESS</span>
            </div>

            {/* Navigation - wrapper for scroll if needed */}
            <div className="flex-1 overflow-y-auto py-2">
                <NavLinks />
            </div>

            {/* Profile Section */}
            <UserProfile
                userEmail={user.email}
                fullName={profile?.full_name}
                avatarUrl={profile?.avatar_url}
            />
        </aside>
    );
}
