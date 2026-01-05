'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export type CalendarItem = {
    id: string;
    title: string;
    description?: string;
    start: Date;
    end?: Date; // Tasks might only have a due date (point in time)
    type: 'task' | 'event' | 'meeting' | 'reminder';
    status?: string; // For tasks
    isAllDay?: boolean;
};

export async function getCalendarItems(start: Date, end: Date) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    // 1. Fetch User's Tasks (Due Date within range)
    // We treat due_date as the start time for tasks
    const { data: tasks } = await supabase
        .from('tasks')
        .select('id, title, description, due_date, status')
        .eq('assignee_id', user.id)
        .gte('due_date', start.toISOString())
        .lte('due_date', end.toISOString());

    // 2. Fetch User's Calendar Events
    const { data: events } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', user.id)
        .gte('start_time', start.toISOString()) // Simplified overlap check
        // Ideally we check overlap: start_time < end AND end_time > start, 
        // but for monthly view basic range filter is usually enough for loading chunks
        .lte('start_time', end.toISOString());

    const calendarItems: CalendarItem[] = [];

    // Map Tasks to CalendarItems
    if (tasks) {
        tasks.forEach(task => {
            if (task.due_date) {
                calendarItems.push({
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    start: new Date(task.due_date),
                    type: 'task',
                    status: task.status,
                    isAllDay: true // Tasks are usually day-level unless specified
                });
            }
        });
    }

    // Map Events to CalendarItems
    if (events) {
        events.forEach(event => {
            calendarItems.push({
                id: event.id,
                title: event.title,
                description: event.description,
                start: new Date(event.start_time),
                end: new Date(event.end_time),
                type: event.type as any, // 'event', 'meeting', etc.
                isAllDay: false // Events usually have specific times
            });
        });
    }

    return calendarItems.sort((a, b) => a.start.getTime() - b.start.getTime());
}

export async function createCalendarEvent(prevState: any, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { message: 'Unauthorized' };

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const date = formData.get('date') as string; // YYYY-MM-DD
    const startTime = formData.get('startTime') as string; // HH:mm
    const endTime = formData.get('endTime') as string; // HH:mm
    const type = formData.get('type') as string || 'event';

    // Construct timestamps
    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);

    // Strict Validation
    if (endDateTime <= startDateTime) {
        return { message: 'End time must be after start time' };
    }

    const { error } = await supabase
        .from('calendar_events')
        .insert({
            user_id: user.id,
            title,
            description,
            start_time: startDateTime.toISOString(),
            end_time: endDateTime.toISOString(),
            type
        });

    if (error) {
        console.error('Error creating event:', error);
        return { message: 'Failed to create event' };
    }

    revalidatePath('/dashboard/calendar');
    return { message: 'success' };
}

export async function deleteEvent(eventId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { message: 'Unauthorized' };

    const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', eventId)
        .eq('user_id', user.id); // Security: Ensure ownership

    if (error) {
        console.error('Error deleting event:', error);
        return { message: 'Failed to delete event' };
    }

    revalidatePath('/dashboard/calendar');
    return { message: 'success' };
}
