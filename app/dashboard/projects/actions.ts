'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createProject(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'You must be logged in to create a project' };
    }

    const name = formData.get('name') as string;
    const color = formData.get('color') as string;
    const description = formData.get('description') as string;

    if (!name || !color) {
        return { error: 'Name and color are required' };
    }

    // 1. Create the project
    const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
            name,
            color,
            description,
            // user_id is optional in our schema if we rely on project_members, 
            // but good to keep if you have a "creator" column. 
            // If your schema strictly uses project_members for ownership (like the SQL I gave you),
            // we just create the project first.
        })
        .select()
        .single();

    if (projectError) {
        console.error("Error creating project:", projectError);
        return { error: 'Failed to create project' };
    }

    // 2. Add the creator as an 'owner' in project_members
    const { error: memberError } = await supabase
        .from('project_members')
        .insert({
            project_id: project.id,
            user_id: user.id,
            role: 'owner'
        });

    if (memberError) {
        console.error("Error adding member:", memberError);
        // Ideally we should rollback project creation here, but for now we return error.
        return { error: 'Project created but failed to assign owner' };
    }

    revalidatePath('/dashboard/projects');
    return { success: true, project };
}
