import { createClient } from "@/utils/supabase/server";
import { CreateProjectModal } from "@/components/dashboard/projects/create-project-modal";
import { EmptyState } from "@/components/dashboard/projects/empty-state";
import { ProjectCard } from "@/components/dashboard/projects/project-card";

// Interface for type safety
interface Project {
    id: string;
    name: string;
    color: string;
    project_members: {
        profiles: {
            id: string;
            full_name: string | null;
            avatar_url: string | null;
        } | null;
    }[];
}

export default async function ProjectsPage() {
    const supabase = await createClient();

    // Fetch projects with their members
    const { data: projectsData, error } = await supabase
        .from('projects')
        .select(`
      id,
      name,
      color,
      project_members (
        profiles (
          id,
          full_name,
          avatar_url
        )
      )
    `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching projects:", error);
        // In a real app, handle error UI here
    }

    // Transform data to cleaner format
    const projects = (projectsData || []).map((p: any) => ({
        ...p,
        members: p.project_members.map((pm: any) => pm.profiles).filter(Boolean)
    }));

    return (
        <section aria-label="Projects Dashboard">
            {/* Header */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Projects & Workspaces
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Manage your collaborative spaces
                    </p>
                </div>
                <CreateProjectModal />
            </header>

            {/* Content */}
            {projects.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {projects.map((project: any) => (
                        <ProjectCard
                            key={project.id}
                            id={project.id}
                            name={project.name}
                            color={project.color}
                            members={project.members}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}