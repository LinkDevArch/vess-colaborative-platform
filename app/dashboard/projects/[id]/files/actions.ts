'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function uploadFile(projectId: string, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Unauthorized' };

    const file = formData.get('file') as File;
    if (!file) return { error: 'No file provided' };

    const fileName = file.name;
    const fileExt = fileName.split('.').pop();
    const uniqueId = crypto.randomUUID();
    const storagePath = `${projectId}/${uniqueId}.${fileExt}`;

    // 1. Upload to Supabase Storage (Bucket must be created)
    const { error: uploadError } = await supabase
        .storage
        .from('project_files')
        .upload(storagePath, file);

    if (uploadError) {
        console.error("Upload Error:", uploadError);
        return { error: 'Failed to upload file to storage' };
    }

    // 2. Insert Metadata into DB
    const { error: dbError } = await supabase
        .from('files')
        .insert({
            project_id: projectId,
            name: fileName,
            file_path: storagePath,
            size: file.size,
            type: file.type,
            uploaded_by: user.id
        });

    if (dbError) {
        console.error("DB Error:", dbError);
        // Cleanup: try to delete the uploaded file if DB fails
        await supabase.storage.from('project_files').remove([storagePath]);
        return { error: 'Failed to save file metadata' };
    }

    revalidatePath(`/dashboard/projects/${projectId}/files`);
    return { success: true };
}
