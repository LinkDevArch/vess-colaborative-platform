'use client';

import { Menu, LayoutGrid } from 'lucide-react';
import { useSidebar } from './sidebar-provider';

export function MobileHeader() {
    const { toggleMobileSidebar } = useSidebar();

    return (
        <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-30 transition-colors">
            <div className="flex items-center gap-3">
                <button
                    onClick={toggleMobileSidebar}
                    className="p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <Menu size={24} />
                </button>

                <div className="flex items-center gap-2">
                    <div className="bg-black dark:bg-white text-white dark:text-black p-1.5 rounded-md">
                        <LayoutGrid size={18} />
                    </div>
                    <span className="font-bold text-lg tracking-wide text-slate-900 dark:text-white">VESS</span>
                </div>
            </div>

            {/* Right side placeholder (maybe user avatar or notifications?) 
                For now keep it simple.
            */}
        </div>
    );
}
