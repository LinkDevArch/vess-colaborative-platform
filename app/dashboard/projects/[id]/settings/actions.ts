'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function isOwner(supabase: any, projectId: string, userId: string) {
    const { data: project } = await supabase
        .from('projects')
        .select('created_by')
        .eq('id', projectId)
        .single();
    return project?.created_by === userId;
}

export async function updateProject(projectId: string, name: string, color: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Unauthorized' };

    // 0. Security: Check Ownership
    if (!(await isOwner(supabase, projectId, user.id))) {
        return { error: 'Only the project owner can manage settings' };
    }

    if (!name.trim()) return { error: 'Project name is required' };

    const { error } = await supabase
        .from('projects')
        .update({ name, color })
        .eq('id', projectId);

    if (error) {
        console.error("Error updating project:", error);
        return { error: 'Failed to update project' };
    }

    revalidatePath(`/dashboard/projects/${projectId}/settings`);
    revalidatePath(`/dashboard/projects`); // Update sidebar/list if visible
    return { success: true };
}

export async function addMember(projectId: string, email: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Unauthorized' };

    // 0. Security: Check Ownership
    if (!(await isOwner(supabase, projectId, user.id))) {
        return { error: 'Only the project owner can manage members' };
    }

    // 1. Find user by email
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

    if (profileError || !profile) {
        return { error: 'User not found. Ask them to sign up first!' };
    }

    // 2. Add to project_members
    const { error: insertError } = await supabase
        .from('project_members')
        .insert({
            project_id: projectId,
            user_id: profile.id
        });

    if (insertError) {
        if (insertError.code === '23505') { // Unique violation
            return { error: 'User is already a member' };
        }
        console.error("Error adding member:", insertError);
        return { error: 'Failed to add member' };
    }

    revalidatePath(`/dashboard/projects/${projectId}/settings`);
    return { success: true };
}

export async function removeMember(projectId: string, userId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Unauthorized' };

    // 0. Security: Check Ownership
    if (!(await isOwner(supabase, projectId, user.id))) {
        return { error: 'Only the project owner can manage members' };
    }

    // Safety: Prevent removing yourself (optional, but good UX)
    // if (userId === user.id) return { error: "You can't remove yourself" };

    const { error } = await supabase
        .from('project_members')
        .delete()
        .eq('project_id', projectId)
        .eq('user_id', userId);

    if (error) {
        console.error("Error removing member:", error);
        return { error: 'Failed to remove member' };
    }

    revalidatePath(`/dashboard/projects/${projectId}/settings`);
    return { success: true };
}
