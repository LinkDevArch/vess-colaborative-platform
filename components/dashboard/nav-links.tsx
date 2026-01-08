'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    FolderKanban,
    Calendar,
    MessageSquare,
    CheckSquare,
    Bell,
    Settings
} from "lucide-react";
import { useNotifications } from "./notifications/notifications-provider";

// DRY: Define menu items configuration once
const menuItems = [
    { icon: Home, label: "Home", href: "/dashboard" },
    { icon: FolderKanban, label: "Projects", href: "/dashboard/projects" },
    { icon: CheckSquare, label: "My Tasks", href: "/dashboard/tasks" }, // Changed label for clarity? No, stick to Tasks or My Tasks. Let's keep "Tasks" but pointing to aggregated tasks?
    { icon: Calendar, label: "Calendar", href: "/dashboard/calendar" },
    // { icon: MessageSquare, label: "Messages", href: "/dashboard/messages" },
    { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

interface NavLinksProps {
    isCollapsed?: boolean;
}

export function NavLinks({ isCollapsed }: NavLinksProps) {
    const pathname = usePathname();
    const { unreadCount } = useNotifications();

    return (
        <nav className="flex-1 py-8 flex flex-col gap-2 px-3">
            {menuItems.map((item) => {
                const isActive = item.href === '/dashboard'
                    ? pathname === '/dashboard'
                    : pathname.startsWith(item.href);
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`
              flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} px-3 py-2 rounded-lg transition-all group relative
              ${isActive
                                ? 'text-[#3B8E8E] bg-teal-50/50 dark:bg-teal-900/20 font-semibold'
                                : 'text-slate-500 dark:text-slate-400 hover:text-[#3B8E8E] dark:hover:text-[#3B8E8E] hover:bg-teal-50/50 dark:hover:bg-teal-900/20 font-medium'
                            }
            `}
                        title={isCollapsed ? item.label : undefined}
                    >
                        <item.icon
                            size={22}
                            className={`transition-transform shrink-0 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                        />

                        {!isCollapsed && (
                            <span className="ml-3 truncate">{item.label}</span>
                        )}

                        {/* Notification Badge */}
                        {item.label === 'Notifications' && unreadCount > 0 && (
                            <span className={`
                                flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white
                                ${isCollapsed ? 'absolute top-1 right-1' : 'ml-auto'}
                            `}>
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}
