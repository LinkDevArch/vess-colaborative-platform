'use client';

import { useState, useEffect } from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, AlignLeft } from 'lucide-react';
import { CalendarItem, getCalendarItems } from './actions';
import { CreateEventModal } from '@/components/dashboard/calendar/create-event-modal';
import { EventDetailsModal } from '@/components/dashboard/calendar/event-details-modal';

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [items, setItems] = useState<CalendarItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modals
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const [viewEvent, setViewEvent] = useState<CalendarItem | null>(null);

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const fetchItems = async () => {
        setIsLoading(true);
        const data = await getCalendarItems(startDate, endDate);
        setItems(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchItems();
    }, [currentDate]);

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const today = () => setCurrentDate(new Date());

    const handleDayClick = (day: Date) => {
        setSelectedDate(day);
        setIsCreateModalOpen(true);
    };

    const handleEventClick = (e: React.MouseEvent, item: CalendarItem) => {
        e.stopPropagation(); // Don't trigger day click
        setViewEvent(item);
    };

    const getItemsForDay = (day: Date) => {
        return items.filter(item => isSameDay(item.start, day));
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white/50 shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-linear-to-br from-[#3B8E8E] to-[#2A6E6E] p-2.5 rounded-xl text-white shadow-lg shadow-[#3B8E8E]/20">
                            <CalendarIcon size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Calendar</h1>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Plan & Schedule</p>
                        </div>
                    </div>

                    <div className="h-8 w-px bg-slate-200" />

                    <div className="flex items-center gap-4">
                        <span className="text-xl font-bold text-slate-700 min-w-[150px]">
                            {format(currentDate, 'MMMM yyyy')}
                        </span>
                        <div className="flex items-center gap-1 bg-white rounded-lg border border-slate-200 p-1 shadow-xs">
                            <button onClick={prevMonth} className="p-1.5 hover:bg-slate-50 rounded-md text-slate-600 transition-colors">
                                <ChevronLeft size={18} />
                            </button>
                            <button onClick={nextMonth} className="p-1.5 hover:bg-slate-50 rounded-md text-slate-600 transition-colors">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                        <button onClick={today} className="text-sm text-[#3B8E8E] font-bold hover:text-[#2A6E6E] transition-colors">
                            Today
                        </button>
                    </div>
                </div>

                <button
                    onClick={() => {
                        setSelectedDate(new Date());
                        setIsCreateModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                >
                    <Plus size={18} />
                    <span className="font-medium">New Event</span>
                </button>
            </div>

            {/* Grid container with gloss effect */}
            <div className="flex-1 bg-white/80 backdrop-blur-md rounded-xl border border-white shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col relative">
                <div className="absolute inset-0 bg-linear-to-b from-white/50 to-transparent pointer-events-none" />

                {/* Days Header */}
                <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/80 backdrop-blur-sm relative z-10">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="py-4 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days Grid */}
                <div className="flex-1 grid grid-cols-7 grid-rows-6 relative z-10 transition-opacity duration-300">
                    {/* Loading Overlay / Content */}
                    {calendarDays.map((day, dayIdx) => {
                        const dayItems = getItemsForDay(day);
                        const isToday = isSameDay(day, new Date());
                        const isCurrentMonth = isSameMonth(day, currentDate);

                        return (
                            <div
                                key={day.toString()}
                                onClick={() => handleDayClick(day)}
                                className={`
                                    min-h-[100px] border-b border-r border-slate-100/80 p-2 transition-all cursor-pointer group hover:bg-white/60 relative
                                    ${!isCurrentMonth ? 'bg-slate-50/30 text-slate-300' : ''}
                                `}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`
                                        text-sm font-semibold h-8 w-8 flex items-center justify-center rounded-lg transition-all
                                        ${isToday
                                            ? 'bg-linear-to-br from-[#3B8E8E] to-[#2A6E6E] text-white shadow-lg shadow-[#3B8E8E]/30 scale-110'
                                            : 'text-slate-600 group-hover:bg-slate-100'
                                        }
                                    `}>
                                        {format(day, 'd')}
                                    </span>
                                    {/* Quick add button on hover */}
                                    <button
                                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-[#3B8E8E]/10 hover:text-[#3B8E8E] rounded-lg text-slate-400 transition-all transform scale-90 group-hover:scale-100"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDayClick(day);
                                        }}
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                <div className="space-y-1.5 mt-2">
                                    {isLoading ? (
                                        // Skeletons
                                        <>
                                            <div className="h-5 w-3/4 bg-slate-100 rounded-md animate-pulse" />
                                            {/* Deterministic random-looking pattern using dayIdx */}
                                            {(dayIdx % 3 === 0 || dayIdx % 5 === 0) && (
                                                <div className="h-5 w-1/2 bg-slate-100 rounded-md animate-pulse delay-75" />
                                            )}
                                        </>
                                    ) : (
                                        // Items
                                        dayItems.map((item) => (
                                            <div
                                                key={item.id}
                                                onClick={(e) => handleEventClick(e, item)}
                                                className={`
                                                    text-[11px] px-2 py-1.5 rounded-lg truncate font-medium flex items-center gap-1.5 transition-all hover:scale-[1.02] shadow-sm hover:shadow-md cursor-pointer border
                                                    ${item.type === 'task'
                                                        ? 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100'
                                                        : item.type === 'meeting'
                                                            ? 'bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100'
                                                            : item.type === 'reminder'
                                                                ? 'bg-orange-50 text-orange-700 border-orange-100 hover:bg-orange-100'
                                                                : 'bg-teal-50 text-teal-700 border-teal-100 hover:bg-teal-100'
                                                    }
                                                `}
                                            >
                                                {item.type === 'task' ? (
                                                    <div className="w-1.5 h-1.5 rounded-full bg-current shrink-0 opacity-60" />
                                                ) : (
                                                    <div className="w-1.5 h-1.5 rounded-[2px] bg-current shrink-0 opacity-60" />
                                                )}
                                                <span className="truncate">{item.title}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <CreateEventModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                defaultDate={selectedDate}
                onSuccess={() => {
                    fetchItems();
                    setIsCreateModalOpen(false);
                }}
            />

            <EventDetailsModal
                isOpen={!!viewEvent}
                onClose={() => setViewEvent(null)}
                event={viewEvent ? { ...viewEvent, type: viewEvent.type } : null} // Cast if needed
                onDeleted={() => {
                    setViewEvent(null);
                    fetchItems();
                }}
            />
        </div>
    );
}
