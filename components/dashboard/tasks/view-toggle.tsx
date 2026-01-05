'use client';

import { LayoutGrid, List } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function ViewToggle({ baseUrl }: { baseUrl: string }) {
    const searchParams = useSearchParams();
    const view = searchParams.get('view') || 'list';

    return (
        <div className="flex bg-slate-100 p-1 rounded-lg">
            <Link
                href={`${baseUrl}?view=list`}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'list' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <List size={16} />
                List
            </Link>
            <Link
                href={`${baseUrl}?view=board`}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'board' ? 'bg-white text-[#3B8E8E] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <LayoutGrid size={16} />
                Board
            </Link>
        </div>
    );
}
