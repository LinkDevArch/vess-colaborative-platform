'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient } from '@/utils/supabase/client';
import { toast, Toaster } from 'sonner';
import { usePathname, useRouter } from 'next/navigation';

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    link?: string;
    is_read: boolean;
    created_at: string;
}

interface NotificationsContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string, link?: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    addNotification: (notification: { type: 'success' | 'error' | 'info'; title: string; message: string }) => void;
    isLoading: boolean;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children, user }: { children: ReactNode; user: any }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();
    const router = useRouter();

    // Fetch initial state
    useEffect(() => {
        if (!user) return;

        const fetchNotifications = async () => {
            setIsLoading(true);
            const { data } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(20);

            if (data) {
                setNotifications(data);
                setUnreadCount(data.filter(n => !n.is_read).length);
            }
            setIsLoading(false);
        };

        fetchNotifications();

        // Subscribe to changes
        const channel = supabase
            .channel('notifications-changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}`
                },
                (payload) => {
                    const newNotification = payload.new as Notification;
                    setNotifications(prev => [newNotification, ...prev]);
                    setUnreadCount(prev => prev + 1);

                    // Show Toast
                    toast(newNotification.title, {
                        description: newNotification.message,
                        action: newNotification.link ? {
                            label: 'View',
                            onClick: () => router.push(newNotification.link!)
                        } : undefined,
                        duration: 5000,
                    });
                }
            )
            .subscribe((status) => {
                console.log(`[Notifications] Subscription status: ${status}`);
                if (status === 'SUBSCRIBED') {
                    // Debug log to confirm we are listening
                    console.log('[Notifications] Listening for INSERT events on public.notifications');
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, router]); // supabase is stable

    // Helper to add local toast notifications
    const addNotification = ({ type, title, message }: { type: 'success' | 'error' | 'info'; title: string; message: string }) => {
        switch (type) {
            case 'success':
                toast.success(title, { description: message });
                break;
            case 'error':
                toast.error(title, { description: message });
                break;
            default:
                toast(title, { description: message });
        }
    };

    const markAsRead = async (id: string, link?: string) => {
        // Optimistic update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));

        // DB update
        await supabase.from('notifications').update({ is_read: true }).eq('id', id);

        if (link) {
            router.push(link);
        }
    };

    const markAllAsRead = async () => {
        // Optimistic update
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);

        // DB update
        await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id);
    };

    return (
        <NotificationsContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, addNotification, isLoading }}>
            {children}
            <Toaster position="top-right" richColors closeButton />
        </NotificationsContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationsContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationsProvider');
    }
    return context;
}
