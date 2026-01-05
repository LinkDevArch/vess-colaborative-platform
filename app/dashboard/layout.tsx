import { Sidebar } from "@/components/dashboard/sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { NotificationsProvider } from "@/components/dashboard/notifications/notifications-provider";

// Fallback skeleton while sidebar loads
function SidebarSkeleton() {
    return (
        <aside className="w-20 lg:w-64 bg-white border-r border-slate-100 flex flex-col fixed h-full z-10 left-0 top-0">
            <div className="h-20 flex items-center justify-center lg:justify-start lg:px-8 border-b border-slate-50 shrink-0">
                <div className="bg-slate-200 p-2 rounded-lg w-10 h-10 animate-pulse" />
            </div>
            <div className="flex-1 py-8 px-3 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-12 bg-slate-50 rounded-xl animate-pulse" />
                ))}
            </div>
        </aside>
    );
}

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

    // NOTE: We REMOVED the profile fetching here to avoid blocking.
    // The Sidebar component will fetch it's own data.

    return (
        <NotificationsProvider user={user}>
            <div className="flex min-h-screen bg-[#F4F9FA]">
                <Suspense fallback={<SidebarSkeleton />}>
                    <Sidebar user={user} />
                </Suspense>

                {/* Main Content Area */}
                {/* ml-20 (mobile sidebar width) lg:ml-64 (desktop sidebar width) */}
                <main className="flex-1 ml-20 lg:ml-64 min-h-screen transition-all duration-300">
                    <div className="p-4 sm:p-8 max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </NotificationsProvider>
    );
}
