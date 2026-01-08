'use client';

import { LayoutGrid, List } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function ViewToggle({ baseUrl }: { baseUrl: string }) {
    const searchParams = useSearchParams();
    const view = searchParams.get('view') || 'list';

    return (
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <Link
                href={`${baseUrl}?view=list`}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'list' ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
                <List size={18} />
                List
            </Link>
            <Link
                href={`${baseUrl}?view=board`}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'board' ? 'bg-white dark:bg-slate-600 text-[#3B8E8E] shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
                <LayoutGrid size={18} />
                Board
            </Link>
        </div>
    );
}
