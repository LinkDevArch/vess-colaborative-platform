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
        .select('id, name, color, created_by')
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
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">
            {/* Project Header */}
            <header className="mb-6">
                <div className="flex items-center gap-4 mb-2">
                    <div
                        className="w-4 h-12 rounded-full"
                        style={{ backgroundColor: project.color }}
                    />
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            {project.name}
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Project Workspace
                        </p>
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
