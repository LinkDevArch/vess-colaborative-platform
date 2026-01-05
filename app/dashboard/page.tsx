import { createClient } from "@/utils/supabase/server";
import { GreetingHeader } from "@/components/dashboard/home/greeting-header";
import { TaskOverviewCard } from "@/components/dashboard/home/task-overview-card";
import { ProjectQuickLink } from "@/components/dashboard/home/project-quick-link";
import { CheckCircle, FolderPlus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardHome() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Parallel Fetching
    const [tasksResult, projectsResult] = await Promise.all([
        // 1. My Pending Tasks
        supabase
            .from('tasks')
            .select(`
                id,
                title,
                status,
                due_date,
                project_id,
                projects ( 
                    name 
                )
            `)
            .eq('assignee_id', user.id)
            .neq('status', 'done')
            .order('due_date', { ascending: true }) // Urgent first
            .limit(6),

        // 2. Recent Projects (My Projects or Member Projects)
        // Note: Simple query sorted by creation for now
        supabase
            .from('projects')
            .select('id, name, color, created_at')
            .order('created_at', { ascending: false })
            .limit(5)
    ]);

    const tasks = (tasksResult.data || []).map((t: any) => ({
        ...t,
        project_name: t.projects?.name || 'Unknown Project'
    }));

    const projects = (projectsResult.data || []).map((p: any) => ({
        ...p,
        updated_at: p.created_at // Fallback to created_at
    }));

    // Calculate simple stats
    const pendingCount = tasks.length;

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <GreetingHeader userName={user.user_metadata?.full_name || 'there'} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT COLUMN: TASKS (66%) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <CheckCircle size={20} className="text-[#3B8E8E]" />
                            My Pending Tasks
                        </h2>
                        <Link href="/dashboard/tasks" className="text-sm font-medium text-[#3B8E8E] hover:underline flex items-center gap-1">
                            View all <ArrowRight size={14} />
                        </Link>
                    </div>

                    {tasks.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {tasks.map((task: any) => (
                                <TaskOverviewCard key={task.id} task={task} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-8 text-center">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                <CheckCircle size={24} />
                            </div>
                            <h3 className="text-slate-900 font-semibold">All caught up!</h3>
                            <p className="text-slate-500 text-sm mt-1">You have no pending tasks assigned to you.</p>
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN: PROJECTS & QUICK LINKS (33%) */}
                <div className="space-y-8">
                    {/* Projects */}
                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                                Recent Projects
                            </h2>
                            <Link href="/dashboard/projects" className="p-1 text-slate-400 hover:text-[#3B8E8E] transition-colors">
                                <FolderPlus size={18} />
                            </Link>
                        </div>

                        <div className="space-y-1">
                            {projects.map((project: any) => (
                                <ProjectQuickLink key={project.id} project={project} />
                            ))}
                            {projects.length === 0 && (
                                <p className="text-sm text-slate-400 italic">No projects yet.</p>
                            )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <Link href="/dashboard/projects" className="block text-center text-sm font-medium text-slate-600 hover:text-[#3B8E8E] transition-colors">
                                View all projects
                            </Link>
                        </div>
                    </div>

                    {/* Quick Stats or Promo */}
                    <div className="bg-linear-to-br from-[#3B8E8E] to-[#2A6E6E] rounded-xl p-5 text-white shadow-lg relative overflow-hidden group">
                        <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all"></div>
                        <h3 className="font-bold text-lg relative z-10">Maximize Productivity</h3>
                        <p className="text-white/80 text-sm mt-1 mb-4 relative z-10">
                            Keep your workspace organized. Try checking the files section.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
