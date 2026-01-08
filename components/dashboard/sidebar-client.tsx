'use client';

import { useSidebar } from './sidebar-provider';
import { NavLinks } from './nav-links';
import { UserProfile } from './user-profile';
import { ThemeToggle } from '@/components/theme-toggle';
import { LayoutGrid, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SidebarClientProps {
    userEmail?: string;
    fullName?: string;
    avatarUrl?: string;
}

export function SidebarClient({ userEmail, fullName, avatarUrl }: SidebarClientProps) {
    const { isExpanded, isMobileOpen, toggleSidebar, closeMobileSidebar } = useSidebar();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch by waiting for mount
    useEffect(() => {
        setMounted(true);
    }, []);

    // Initial render / SSR should probably assume expanded or collapsed?
    // Let's rely on client hydration for state.

    return (
        <>
            {/* MOBILE OVERLAY */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={closeMobileSidebar}
                />
            )}

            {/* SIDEBAR ASIDE */}
            <aside
                className={`
                    fixed top-0 left-0 z-50 h-full bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col transition-all duration-300 ease-in-out
                    ${isExpanded ? 'lg:w-64' : 'lg:w-20'}
                    ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Logo Section */}
                <div className={`
                    h-20 flex items-center border-b border-slate-50 dark:border-slate-800 shrink-0 relative
                    ${isExpanded ? 'px-6 justify-start' : 'justify-center lg:px-0'}
                `}>
                    <div className="bg-black dark:bg-white text-white dark:text-black p-2 rounded-lg transition-transform hover:scale-105 cursor-pointer shrink-0">
                        <LayoutGrid size={24} />
                    </div>

                    <span className={`
                        ml-3 font-bold text-xl tracking-wide text-slate-900 dark:text-white transition-opacity duration-200
                        ${isExpanded ? 'opacity-100' : 'opacity-0 lg:hidden'}
                        whitespace-nowrap
                    `}>
                        VESS
                    </span>

                    {/* Mobile Close Button */}
                    <button
                        onClick={closeMobileSidebar}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 lg:hidden"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* DESKTOP TOGGLE BUTTON (Absolute on border) */}
                <div className="absolute -right-3 top-24 hidden lg:block">
                    <button
                        className="h-6 w-6 flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-400 transition-colors cursor-pointer z-50"
                        onClick={toggleSidebar}
                    >
                        {isExpanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-2 overflow-x-hidden">
                    <NavLinks isCollapsed={!isExpanded} /> {/* Pass prop to NavLinks */}
                </div>

                {/* Footer Actions */}
                <div className="p-3 border-t border-slate-50 dark:border-slate-800 flex flex-col gap-2">
                    <div className={`flex items-center ${isExpanded ? 'justify-between px-2' : 'justify-center'}`}>
                        {isExpanded && <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Appearance</span>}
                        <div className="scale-90 origin-right">
                            <ThemeToggle />
                        </div>
                    </div>
                </div>

                {/* Profile Section */}
                <div className="overflow-hidden bg-slate-50 dark:bg-slate-900/50">
                    <UserProfile
                        userEmail={userEmail}
                        fullName={fullName}
                        avatarUrl={avatarUrl}
                        isCollapsed={!isExpanded}
                    />
                </div>
            </aside>
        </>
    );
}
