'use client';

import { X, Calendar as CalendarIcon, Clock, AlignLeft, Tag } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { createCalendarEvent } from '@/app/dashboard/calendar/actions';
import { toast } from 'sonner';
import { useEffect, useRef } from 'react';

interface CreateEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultDate: Date;
    onSuccess: () => void;
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-[#3B8E8E] text-white py-2.5 rounded-lg font-medium hover:bg-[#2A6E6E] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-teal-100"
        >
            {pending ? 'Creating...' : 'Create Event'}
        </button>
    );
}

export function CreateEventModal({ isOpen, onClose, defaultDate, onSuccess }: CreateEventModalProps) {
    const formRef = useRef<HTMLFormElement>(null);

    // Close on escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    // Default time strings
    const dateStr = defaultDate.toISOString().split('T')[0];
    // Default start time: next full hour from now, or 9am if date is future
    const now = new Date();
    const isToday = dateStr === now.toISOString().split('T')[0];
    const defaultStartTime = isToday
        ? `${String(now.getHours() + 1).padStart(2, '0')}:00`
        : '09:00';
    const defaultEndTime = isToday
        ? `${String(now.getHours() + 2).padStart(2, '0')}:00`
        : '10:00';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        Create New Event
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                        <X size={20} />
                    </button>
                </div>

                <form
                    ref={formRef}
                    action={async (formData) => {
                        const result = await createCalendarEvent(null, formData);
                        if (result.message === 'success') {
                            toast.success('Event created successfully');
                            formRef.current?.reset();
                            onSuccess();
                        } else {
                            toast.error(result.message);
                        }
                    }}
                    className="p-6 space-y-5"
                >
                    {/* Title */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Event Title</label>
                        <input
                            required
                            name="title"
                            placeholder="e.g., Weekly Team Sync"
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3B8E8E]/20 focus:border-[#3B8E8E] transition-all"
                            autoFocus
                        />
                    </div>

                    {/* Date & Time Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                <CalendarIcon size={12} /> Date
                            </label>
                            <input
                                type="date"
                                required
                                name="date"
                                defaultValue={dateStr}
                                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3B8E8E]/20 focus:border-[#3B8E8E] text-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                <Tag size={12} /> Type
                            </label>
                            <select
                                name="type"
                                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3B8E8E]/20 focus:border-[#3B8E8E] text-sm bg-white"
                            >
                                <option value="event">Event</option>
                                <option value="meeting">Meeting</option>
                                <option value="reminder">Reminder</option>
                                <option value="work_block">Work Block</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                <Clock size={12} /> Start Time
                            </label>
                            <input
                                type="time"
                                required
                                name="startTime"
                                defaultValue={defaultStartTime}
                                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3B8E8E]/20 focus:border-[#3B8E8E] text-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                <Clock size={12} /> End Time
                            </label>
                            <input
                                type="time"
                                required
                                name="endTime"
                                defaultValue={defaultEndTime}
                                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3B8E8E]/20 focus:border-[#3B8E8E] text-sm"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                            <AlignLeft size={12} /> Description
                        </label>
                        <textarea
                            name="description"
                            rows={3}
                            placeholder="Add details, agenda, or notes..."
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3B8E8E]/20 focus:border-[#3B8E8E] transition-all resize-none text-sm"
                        />
                    </div>

                    <div className="pt-2">
                        <SubmitButton />
                    </div>
                </form>
            </div>
        </div>
    );
}
