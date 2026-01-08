import { createClient } from "@/utils/supabase/server";
import { UploadArea } from "@/components/dashboard/files/upload-area";
import { FilesList } from "@/components/dashboard/files/files-list";

export default async function FilesPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { id } = await params;

    // Fetch files from DB
    const { data: files, error } = await supabase
        .from('files')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false });

    if (error) console.error("Error fetching files:", error);

    return (
        <div className="px-4 md:px-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Files</h2>
            </div>

            {/* Upload Area */}
            <UploadArea projectId={id} />

            {/* List */}
            <FilesList files={(files as any) || []} />
        </div>
    );
}
