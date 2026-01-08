import { createClient } from "@/utils/supabase/server";
import { redirect, notFound } from "next/navigation";
import { ProjectNav } from "@/components/dashboard/projects/project-nav";

interface ProjectLayoutProps {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}

export default async function ProjectLayout({ children, params }: ProjectLayoutProps) {
    const supabase = await createClient();
    const { id } = await params;

    // Get Current User to check ownership
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch project details to show in header (and verify access)
    const { data: project, error } = await supabase
        .from('projects')
        .select('id, name, color, created_by, description')
        .eq('id', id)
        .single();

    if (error || !project) {
        if (error?.code === 'PGRST116') {
            notFound(); // Project doesn't exist or user has no access
        }
        console.error("Error fetching project:", error);
        redirect('/dashboard/projects'); // Fallback
    }

    const isOwner = user?.id === project.created_by;

    return (
        <div className="flex flex-col min-h-full">
            {/* Project Header */}
            <header className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
                    <div className="flex items-center gap-4">
                        <div
                            className="w-4 h-12 rounded-full shrink-0"
                            style={{ backgroundColor: project.color }}
                        />
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white truncate pr-4">
                                {project.name}
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 wrap-break-word max-w-2xl">
                                {project.description || "No description provided."}
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Sub Navigation */}
            <ProjectNav projectId={id} isOwner={isOwner} />

            {/* Content (Tasks, Files, Chat) */}
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}
