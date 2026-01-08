import { Sidebar } from "@/components/dashboard/sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SidebarProvider } from "@/components/dashboard/sidebar-provider";
import { DashboardMain } from "@/components/dashboard/dashboard-main";
import { NotificationsProvider } from "@/components/dashboard/notifications/notifications-provider";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Extra safety check (middleware handles this mainly)
    if (!user) {
        redirect("/login");
    }

    return (
        <NotificationsProvider user={user}>
            <SidebarProvider>
                <div className="flex min-h-screen bg-[#F4F9FA] dark:bg-slate-950 transition-colors duration-300">
                    <Sidebar user={user} />

                    {/* Main Content Area handled by Client Component for margin transitions */}
                    <DashboardMain>
                        {children}
                    </DashboardMain>
                </div>
            </SidebarProvider>
        </NotificationsProvider>
    );
}
