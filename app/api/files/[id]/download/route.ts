import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { id } = await params; // File ID

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    // 1. Fetch Metadata (and verify RLS access implicitly)
    const { data: fileRecord, error: dbError } = await supabase
        .from('files')
        .select('file_path, name, type')
        .eq('id', id)
        .single();

    if (dbError || !fileRecord) {
        return new NextResponse("File not found or access denied", { status: 404 });
    }

    // 2. Create Signed URL for download (short expiry)
    // This is safer than piping the stream through Next.js server (RAM usage)
    const { data: signedUrlData, error: storageError } = await supabase
        .storage
        .from('project_files')
        .createSignedUrl(fileRecord.file_path, 60); // 60 seconds validity

    if (storageError || !signedUrlData) {
        return new NextResponse("Storage error", { status: 500 });
    }

    // 3. Redirect user to the secure temporary URL
    return NextResponse.redirect(signedUrlData.signedUrl);
}
