'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type SidebarContextType = {
    isExpanded: boolean;
    isMobileOpen: boolean;
    toggleSidebar: () => void;
    toggleMobileSidebar: () => void;
    closeMobileSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    // Desktop state (default true)
    const [isExpanded, setIsExpanded] = useState(true);
    // Mobile state (default false)
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Initialize from localStorage on mount (client-side only)
    useEffect(() => {
        const saved = localStorage.getItem('sidebar:expanded');
        if (saved !== null) {
            setIsExpanded(saved === 'true');
        }
    }, []);

    const toggleSidebar = () => {
        const newState = !isExpanded;
        setIsExpanded(newState);
        localStorage.setItem('sidebar:expanded', String(newState));
    };

    const toggleMobileSidebar = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    const closeMobileSidebar = () => {
        setIsMobileOpen(false);
    };

    return (
        <SidebarContext.Provider
            value={{
                isExpanded,
                isMobileOpen,
                toggleSidebar,
                toggleMobileSidebar,
                closeMobileSidebar,
            }}
        >
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
}
