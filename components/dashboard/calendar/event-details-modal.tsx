'use client';

import { X, Calendar as CalendarIcon, Clock, AlignLeft, Tag, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { deleteEvent } from '@/app/dashboard/calendar/actions';

import { useNotifications } from '@/components/dashboard/notifications/notifications-provider';

interface EventDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDeleted?: () => void; // Callback for successful deletion
    event: {
        id: string;
        title: string;
        description?: string;
        start: Date;
        end?: Date;
        type: string;
    } | null;
}

export function EventDetailsModal({ isOpen, onClose, onDeleted, event }: EventDetailsModalProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const { addNotification } = useNotifications();

    // Reset states when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setShowConfirm(false);
            setIsDeleting(false);
        }
    }, [isOpen]);

    // Close on escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleDelete = async () => {
        if (!event) return;
        setIsDeleting(true);
        try {
            const result = await deleteEvent(event.id);
            if (result.message === 'success') {
                addNotification({
                    type: 'success',
                    title: 'Event Deleted',
                    message: `Successfully deleted "${event.title}"`
                });
                onClose();
                if (onDeleted) onDeleted();
            } else {
                addNotification({
                    type: 'error',
                    title: 'Delete Failed',
                    message: result.message || 'Could not delete event'
                });
            }
        } catch (error) {
            console.error('Delete failed', error);
            addNotification({
                type: 'error',
                title: 'Error',
                message: 'An unexpected error occurred'
            });
        } finally {
            setIsDeleting(false);
        }
    };

    // ... rest of the component
    if (!isOpen || !event) return null;

    const formattedDate = format(event.start, 'EEEE, MMMM d, yyyy');
    const timeRange = event.end
        ? `${format(event.start, 'h:mm a')} - ${format(event.end, 'h:mm a')}`
        : 'All Day';

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'meeting': return 'bg-purple-100 text-purple-700';
            case 'reminder': return 'bg-orange-100 text-orange-700';
            case 'work_block': return 'bg-blue-100 text-blue-700';
            default: return 'bg-teal-100 text-teal-700';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-slate-100 bg-slate-50/30">
                    <div>
                        <div className={`inline-flex px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-2 ${getTypeColor(event.type)}`}>
                            {event.type.replace('_', ' ')}
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 leading-snug">
                            {event.title}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Date & Time */}
                    <div className="flex items-start gap-3 text-slate-600">
                        <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
                            <Clock size={20} />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800">{formattedDate}</p>
                            <p className="text-sm">{timeRange}</p>
                        </div>
                    </div>

                    {/* Description */}
                    {event.description && (
                        <div className="flex items-start gap-3 text-slate-600">
                            <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
                                <AlignLeft size={20} />
                            </div>
                            <div className="text-sm leading-relaxed whitespace-pre-wrap">
                                {event.description}
                            </div>
                        </div>
                    )}

                    {!event.description && (
                        <p className="text-sm text-slate-400 italic pl-12">No description provided.</p>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 items-center">
                    {/* Only show delete for non-task events */}
                    {event.type !== 'task' && (
                        showConfirm ? (
                            <div className="flex items-center gap-2 w-full animate-in slide-in-from-right-5 duration-200">
                                <span className="text-sm font-medium text-slate-700 flex-1">Are you sure?</span>
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="px-3 py-1.5 text-slate-500 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                                >
                                    {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                    Confirm
                                </button>
                            </div>
                        ) : (
                            <button
                                className="flex items-center gap-2 px-4 py-2 text-red-600 text-sm font-medium hover:bg-red-50 rounded-lg transition-colors mr-auto"
                                onClick={() => setShowConfirm(true)}
                            >
                                <Trash2 size={16} />
                                Delete
                            </button>
                        )
                    )}

                    {!showConfirm && (
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-300 transition-colors"
                        >
                            Close
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
