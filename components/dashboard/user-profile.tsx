import { LogOut, Settings } from "lucide-react";
import { signOut } from "./actions";
import Link from "next/link";

interface UserProfileProps {
    userEmail?: string;
    fullName?: string | null;
    avatarUrl?: string | null;
    isCollapsed?: boolean;
}

export function UserProfile({ userEmail, fullName, avatarUrl, isCollapsed }: UserProfileProps) {
    return (
        <div className="p-4 border-t border-slate-50 dark:border-slate-800">
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} gap-3 p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group`}>
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt="User"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-slate-500 dark:text-slate-300 font-bold text-sm">
                            {fullName?.[0] || userEmail?.[0]?.toUpperCase()}
                        </span>
                    )}
                </div>

                {!isCollapsed && (
                    <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-[120px]">
                            {fullName || "User"}
                        </p>
                        <div className="flex items-center gap-3 mt-0.5">
                            <Link href="/dashboard/settings" className="text-xs text-slate-400 hover:text-[#3B8E8E] flex items-center gap-1 transition-colors" title="Settings">
                                <Settings size={12} /> Settings
                            </Link>
                            <form action={signOut}>
                                <button className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors">
                                    <LogOut size={12} /> Sign out
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
