'use client';

import { useNotifications } from '@/components/dashboard/notifications/notifications-provider';
import { Bell, Check, Loader2, MailOpen } from 'lucide-react';
import Link from 'next/link';

export default function NotificationsPage() {
    const { notifications, isLoading, markAsRead, markAllAsRead, unreadCount } = useNotifications();

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        }).format(date);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="animate-spin text-slate-300" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100">
                        <Bell className="text-[#3B8E8E]" size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
                        <p className="text-slate-500 text-sm">You have {unreadCount} unread messages</p>
                    </div>
                </div>

                {unreadCount > 0 && (
                    <button
                        onClick={() => markAllAsRead()}
                        className="flex items-center gap-2 text-sm font-medium text-[#3B8E8E] hover:underline transition-all"
                    >
                        <Check size={16} />
                        Mark all as read
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`
                                relative group flex items-start gap-4 p-5 rounded-2xl border transition-all duration-200
                                ${notification.is_read
                                    ? 'bg-white border-slate-100 opacity-75 grayscale-[0.3] hover:grayscale-0 hover:opacity-100'
                                    : 'bg-white border-[#3B8E8E]/20 shadow-sm ring-1 ring-[#3B8E8E]/5'
                                }
                            `}
                        >
                            {!notification.is_read && (
                                <div className="absolute top-5 right-5 h-2 w-2 rounded-full bg-red-500 ring-4 ring-white" />
                            )}

                            <div className={`
                                shrink-0 p-3 rounded-full 
                                ${notification.is_read ? 'bg-slate-50 text-slate-400' : 'bg-teal-50 text-[#3B8E8E]'}
                            `}>
                                <Bell size={20} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4">
                                    <h3 className={`font-semibold text-slate-900 ${notification.is_read ? '' : ''}`}>
                                        {notification.title}
                                    </h3>
                                    <span className="text-xs text-slate-400 shrink-0 mt-1">
                                        {formatDate(notification.created_at)}
                                    </span>
                                </div>
                                <p className="text-slate-600 my-1 leading-relaxed">
                                    {notification.message}
                                </p>

                                <div className="flex items-center gap-4 mt-3">
                                    {notification.link && (
                                        <button
                                            onClick={() => markAsRead(notification.id, notification.link)}
                                            className="text-sm font-medium text-[#3B8E8E] hover:text-[#2A6E6E] transition-colors"
                                        >
                                            View Details
                                        </button>
                                    )}
                                    {!notification.is_read && (
                                        <button
                                            onClick={() => markAsRead(notification.id)}
                                            className="text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            Mark as read
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="bg-slate-50 p-6 rounded-full mb-4">
                            <MailOpen size={48} className="text-slate-200" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800">No notifications</h3>
                        <p className="text-slate-500 max-w-sm mt-1">
                            We'll let you know when something important happens!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
