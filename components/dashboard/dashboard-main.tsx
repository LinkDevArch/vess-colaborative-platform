'use client';

import { useSidebar } from './sidebar-provider';
import { MobileHeader } from './mobile-header';

export function DashboardMain({ children }: { children: React.ReactNode }) {
    const { isExpanded } = useSidebar();

    return (
        <main
            className={`
                flex-1 min-h-screen transition-all duration-300 ease-in-out
                ${isExpanded ? 'lg:ml-64' : 'lg:ml-20'}
                ml-0 // Mobile: no margin (overlay sidebar)
            `}
        >
            <MobileHeader />
            <div className="p-2 sm:p-8 max-w-[1600px] mx-auto">
                {children}
            </div>
        </main>
    );
}
