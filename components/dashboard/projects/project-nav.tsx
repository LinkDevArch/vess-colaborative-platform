'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckSquare, FileText, MessageCircle, Settings } from "lucide-react";

interface ProjectNavProps {
    projectId: string;
    isOwner: boolean;
}

export function ProjectNav({ projectId, isOwner }: ProjectNavProps) {
    const pathname = usePathname();
    // Base path for this project
    const baseUrl = `/dashboard/projects/${projectId}`;

    const tabs = [
        { name: 'Tasks', href: `${baseUrl}/tasks`, icon: CheckSquare },
        { name: 'Files', href: `${baseUrl}/files`, icon: FileText },
        { name: 'Chat', href: `${baseUrl}/chat`, icon: MessageCircle },
    ];

    if (isOwner) {
        tabs.push({ name: 'Settings', href: `${baseUrl}/settings`, icon: Settings });
    }

    return (
        <div className="flex border-b border-slate-200 mb-8">
            {tabs.map((tab) => {
                const isActive = pathname.startsWith(tab.href);
                return (
                    <Link
                        key={tab.name}
                        href={tab.href}
                        className={`
              flex items-center gap-2 px-6 py-4 border-b-2 transition-all font-medium text-sm
              ${isActive
                                ? 'border-[#3B8E8E] text-[#3B8E8E] bg-teal-50/50'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                            }
            `}
                    >
                        <tab.icon size={18} />
                        {tab.name}
                    </Link>
                );
            })}
        </div>
    );
}
