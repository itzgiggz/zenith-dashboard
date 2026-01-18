'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    format,
    addDays,
    isSameDay,
    parseISO,
    eachDayOfInterval,
    isToday,
    startOfDay,
    differenceInMinutes
} from 'date-fns';
import { clsx } from 'clsx';
import Clock from './Clock';

interface Event {
    id: string;
    title: string;
    start: string;
    end?: string;
    location?: string;
    calendarId: string;
    isAllDay?: boolean;
    holidayLabel?: string;
}

const CALENDAR_THEMES: Record<string, { bg: string; text: string; dot: string; border: string }> = {
    '1': { bg: 'bg-blue-600/50', text: 'text-blue-50', dot: 'bg-blue-300', border: 'border-blue-300/40' },     // Work
    '2': { bg: 'bg-green-600/50', text: 'text-green-50', dot: 'bg-green-300', border: 'border-green-300/40' }, // Personal
    '3': { bg: 'bg-orange-600/50', text: 'text-orange-50', dot: 'bg-orange-300', border: 'border-orange-300/40' }, // Family
    '4': { bg: 'bg-yellow-600/50', text: 'text-yellow-50', dot: 'bg-yellow-300', border: 'border-yellow-300/40' }, // Holiday
    'default': { bg: 'bg-zinc-600/60', text: 'text-zinc-50', dot: 'bg-zinc-300', border: 'border-zinc-400/40' }
};

// Configuration for the hourly grid
const START_HOUR = 7; // 7 AM
const END_HOUR = 21;  // 9 PM
const TOTAL_HOURS = END_HOUR - START_HOUR;

export default function ZenithCalendar() {
    const [events, setEvents] = useState<Event[]>([]);

    const days = useMemo(() => eachDayOfInterval({
        start: new Date(),
        end: addDays(new Date(), 6)
    }), []);

    const hours = useMemo(() => Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => START_HOUR + i), []);

    const fetchEvents = async () => {
        try {
            const res = await fetch('/api/calendar');
            const data = await res.json();
            setEvents(Array.isArray(data) ? data : (data.events || []));
        } catch (error) {
            console.error('Failed to fetch calendar:', error);
        }
    };

    useEffect(() => {
        fetchEvents();
        const interval = setInterval(fetchEvents, 300000); // 5 mins
        return () => clearInterval(interval);
    }, []);

    const calculatePosition = (dateStr: string) => {
        const date = parseISO(dateStr);
        const startOfGrid = startOfDay(date);
        startOfGrid.setHours(START_HOUR, 0, 0, 0);

        const minutesFromStart = differenceInMinutes(date, startOfGrid);
        const totalMinutesInGrid = TOTAL_HOURS * 60;

        // Percentage from top
        return Math.max(0, Math.min(100, (minutesFromStart / totalMinutesInGrid) * 100));
    };

    const calculateHeight = (startStr: string, endStr?: string) => {
        if (!endStr) return 5; // Default for events without end time

        const start = parseISO(startStr);
        const end = parseISO(endStr);
        const durationMinutes = differenceInMinutes(end, start);
        const totalMinutesInGrid = TOTAL_HOURS * 60;

        return Math.max(2, (durationMinutes / totalMinutesInGrid) * 100);
    };

    return (
        <div className="h-screen w-screen flex flex-col bg-[#0f0f0f] text-white overflow-hidden p-4 gap-4">

            {/* Minimalist Top Bar */}
            <header className="flex items-center justify-between px-6 py-2">
                <Clock />
                <div className="flex items-center gap-6">
                    {['Work', 'Personal', 'Family', 'Holiday'].map((label, idx) => (
                        <div key={label} className="flex items-center gap-2">
                            <div className={clsx(
                                "w-2.5 h-2.5 rounded-full shadow-sm",
                                idx === 0 ? "bg-blue-400" : idx === 1 ? "bg-green-400" : idx === 2 ? "bg-orange-400" : "bg-yellow-400"
                            )} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/50">{label}</span>
                        </div>
                    ))}
                </div>
            </header>

            {/* Main Time-Block Grid */}
            <div className="flex-1 flex min-h-0 relative border border-white/10 rounded-[2rem] overflow-hidden bg-white/[0.02] backdrop-blur-sm">

                {/* Time Axis (Fixed Left) */}
                <div className="w-20 flex flex-col border-r border-white/10 bg-black/40 z-20">
                    <div className="h-24 border-b border-white/10" /> {/* Spacer for header + All Day section */}
                    <div className="flex-1 relative">
                        {hours.map((hour) => (
                            <div
                                key={hour}
                                className="absolute w-full flex justify-center"
                                style={{ top: `${((hour - START_HOUR) / TOTAL_HOURS) * 100}%`, transform: 'translateY(-50%)' }}
                            >
                                <span className="text-[11px] font-black text-white/40 uppercase tracking-tighter">
                                    {hour % 12 || 12} {hour >= 12 ? 'PM' : 'AM'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Days Grid */}
                <div className="flex-1 flex min-h-0 relative">
                    {/* Horizontal Hour Lines (Background) */}
                    <div className="absolute inset-0 z-0 pointer-events-none">
                        {hours.map((hour) => (
                            <div
                                key={hour}
                                className="absolute w-full border-t border-white/[0.08]"
                                style={{ top: `${((hour - START_HOUR) / TOTAL_HOURS) * 100}%` }}
                            />
                        ))}
                    </div>

                    {/* Day Columns */}
                    {days.map((day, i) => {
                        const dayEvents = events.filter(e => isSameDay(parseISO(e.start), day) && !e.isAllDay);
                        const allDayEvents = events.filter(e => isSameDay(parseISO(e.start), day) && e.isAllDay);
                        const isTodayDay = isToday(day);

                        return (
                            <div
                                key={i}
                                className={clsx(
                                    "flex-1 flex flex-col border-r border-white/10 last:border-0 relative",
                                    isTodayDay && "bg-blue-500/[0.04]"
                                )}
                            >
                                {/* Column Header (Day/Date) */}
                                <div className={clsx(
                                    "h-14 flex flex-col items-center justify-center border-b z-10 sticky top-0 bg-zinc-900/40 backdrop-blur-xl",
                                    isTodayDay ? "border-blue-500/40" : "border-white/10"
                                )}>
                                    <span className={clsx(
                                        "text-[10px] font-black uppercase tracking-[0.25em]",
                                        isTodayDay ? "text-blue-400" : "text-white/40"
                                    )}>
                                        {format(day, 'EEE d')}
                                    </span>
                                </div>

                                {/* All Day / Holiday Callout Section (Google Calendar style) */}
                                <div className="h-10 px-1 py-1 flex flex-col gap-1 border-b border-white/10 bg-white/[0.01]">
                                    {allDayEvents.map(e => (
                                        <div
                                            key={e.id}
                                            className={clsx(
                                                "w-full px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tight truncate border",
                                                e.calendarId === '4' ? "bg-yellow-500/30 border-yellow-500/30 text-yellow-100" : "bg-zinc-500/20 border-white/10 text-white/70"
                                            )}
                                        >
                                            {e.holidayLabel || e.title}
                                        </div>
                                    ))}
                                </div>

                                {/* Hourly Events Container */}
                                <div className="flex-1 relative">
                                    {dayEvents.map((event) => {
                                        const theme = CALENDAR_THEMES[event.calendarId] || CALENDAR_THEMES.default;
                                        const top = calculatePosition(event.start);
                                        const height = calculateHeight(event.start, event.end);

                                        return (
                                            <div
                                                key={event.id}
                                                className={clsx(
                                                    "absolute left-1 right-1 rounded-lg border p-2 overflow-hidden transition-all hover:z-30 hover:ring-2 hover:ring-white/40 shadow-lg",
                                                    theme.bg,
                                                    theme.border
                                                )}
                                                style={{
                                                    top: `${top}%`,
                                                    height: `${height}%`,
                                                    minHeight: '28px'
                                                }}
                                            >
                                                <div className="flex flex-col h-full">
                                                    <span className={clsx("text-[9px] font-black uppercase tracking-tight leading-none mb-1 opacity-80", theme.text)}>
                                                        {format(parseISO(event.start), 'h:mm')}
                                                    </span>
                                                    <h4 className={clsx("text-[11px] font-black leading-tight line-clamp-2 drop-shadow-sm", theme.text)}>
                                                        {event.title}
                                                    </h4>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Legend Ticker (Bottom/Discreet) */}
            <footer className="px-6 py-1 opacity-20 hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-4 text-[8px] font-black uppercase tracking-widest">
                    <span>Zenith Capacity View</span>
                    <span className="w-1 h-1 rounded-full bg-white/40" />
                    <span>7-Day Hourly Horizon</span>
                </div>
            </footer>
        </div>
    );
}
