'use client';

import { useState, useRef } from "react";
import { UploadCloud, Loader2, File } from "lucide-react";
import { uploadFile } from "@/app/dashboard/projects/[id]/files/actions";

export function UploadArea({ projectId }: { projectId: string }) {
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => setIsDragOver(false);

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files?.[0]) {
            await handleUpload(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            await handleUpload(e.target.files[0]);
        }
    };

    const handleUpload = async (file: File) => {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        await uploadFile(projectId, formData);
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div
            className={`
        border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer
        ${isDragOver ? 'border-[#3B8E8E] bg-teal-50' : 'border-slate-200 hover:border-[#3B8E8E] hover:bg-slate-50'}
      `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
        >
            <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileSelect}
            />

            <div className="flex flex-col items-center gap-3">
                <div className={`p-4 rounded-full ${isUploading ? 'bg-slate-100' : 'bg-[#e0f2f1]'}`}>
                    {isUploading ? (
                        <Loader2 className="animate-spin text-slate-500" size={24} />
                    ) : (
                        <UploadCloud className="text-[#3B8E8E]" size={24} />
                    )}
                </div>
                <div>
                    <h3 className="font-semibold text-slate-700">
                        {isUploading ? 'Uploading...' : 'Click or drag file to upload'}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                        Documents, Images, etc.
                    </p>
                </div>
            </div>
        </div>
    );
}
