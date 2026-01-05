import { createClient } from "@/utils/supabase/server";
import { ProjectDetailsForm } from "@/components/dashboard/settings/project-details-form";
import { MembersList } from "@/components/dashboard/settings/members-list";
import { redirect } from "next/navigation";

export default async function SettingsPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { id } = await params;
    const { data: { user } } = await supabase.auth.getUser();

    // 0. Security: Verify Ownership
    const { data: project } = await supabase
        .from('projects')
        .select('created_by, name, color')
        .eq('id', id)
        .single();

    if (!project || user?.id !== project.created_by) {
        redirect(`/dashboard/projects/${id}/tasks`);
    }

    // Fetch Members
    const { data: members } = await supabase
        .from('project_members')
        .select(`
      user_id,
      profiles (
        full_name,
        avatar_url,
        email
      )
    `)
        .eq('project_id', id);

    return (
        <div className="px-4 md:px-6 max-w-3xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Project Settings</h2>
                <p className="text-slate-500">Manage your team and project configuration.</p>
            </div>

            <ProjectDetailsForm
                projectId={id}
                initialName={project.name}
                initialColor={project.color}
            />

            <MembersList
                projectId={id}
                members={(members as any) || []}
                currentUserId={user?.id || ''}
            />
        </div>
    );
}
