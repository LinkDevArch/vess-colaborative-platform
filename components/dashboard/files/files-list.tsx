'use client';

import { FileIcon, FileText, Image as ImageIcon, Download, Trash2, MoreVertical } from "lucide-react";

interface FileMeta {
    id: string;
    name: string;
    size: number;
    type: string;
    uploaded_by?: string;
    created_at: string;
}

export function FilesList({ files }: { files: FileMeta[] }) {
    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const truncateName = (name: string) => {
        return name.length > 20 ? name.substring(0, 15) + '...' + name.split('.').pop() : name;
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
            {files.map((file) => (
                <div key={file.id} className="bg-white p-4 rounded-lg border border-slate-100 hover:shadow-md transition-shadow group relative">

                    <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                            {file.type.startsWith('image') ? <ImageIcon size={20} /> : <FileText size={20} />}
                        </div>
                        <a
                            href={`/api/files/${file.id}/download`}
                            target="_blank" // Force new tab for download/view
                            className="p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-[#3B8E8E] transition-colors"
                            title="Download"
                        >
                            <Download size={18} />
                        </a>
                    </div>

                    <div>
                        <h4 className="font-medium text-slate-800 text-sm mb-1" title={file.name}>
                            {truncateName(file.name)}
                        </h4>
                        <div className="flex items-center justify-between text-xs text-slate-400">
                            <span>{formatSize(file.size)}</span>
                            <span>{new Date(file.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>

                </div>
            ))}
            {files.length === 0 && (
                <div className="col-span-full text-center py-10 text-slate-400 text-sm">
                    No files uploaded yet.
                </div>
            )}
        </div>
    );
}
