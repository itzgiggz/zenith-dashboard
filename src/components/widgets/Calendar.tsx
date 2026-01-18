'use client';

import { useState, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    isToday
} from 'date-fns';
import { clsx } from 'clsx';

interface Event {
    id: string;
    title: string;
    start: string;
    calendarId: string;
}

const CALENDAR_COLORS: Record<string, string> = {
    '1': 'bg-blue-500/80',
    '2': 'bg-green-500/80',
    '3': 'bg-purple-500/80',
    'default': 'bg-white/40'
};

export default function Calendar() {
    const [events, setEvents] = useState<Event[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const fetchEvents = async () => {
        try {
            const res = await fetch('/api/calendar');
            const data = await res.json();
            if (data.events) {
                setEvents(data.events);
            } else if (Array.isArray(data)) {
                setEvents(data);
            }
        } catch (error) {
            console.error('Failed to fetch calendar:', error);
        }
    };

    useEffect(() => {
        fetchEvents();
        const interval = setInterval(fetchEvents, 300000); // 5 minutes
        return () => clearInterval(interval);
    }, []);

    const days = useMemo(() => {
        const start = startOfWeek(startOfMonth(currentMonth));
        const end = endOfWeek(endOfMonth(currentMonth));
        return eachDayOfInterval({ start, end });
    }, [currentMonth]);

    return (
        <div className="glass p-8 h-full flex flex-col gap-6 overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-xl">
                        <CalendarIcon className="w-8 h-8 text-white/70" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black uppercase tracking-[0.2em]">{format(currentMonth, 'MMMM yyyy')}</h2>
                        <p className="text-xs font-bold text-white/40 tracking-widest uppercase mt-1">Holistic View</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button onClick={() => setCurrentMonth(new Date())} className="px-4 py-2 hover:bg-white/5 rounded-lg text-xs font-bold uppercase transition-colors">
                        Today
                    </button>
                    <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-7 gap-3 min-h-0">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-[10px] font-black uppercase tracking-widest text-white/30 py-2">
                        {day}
                    </div>
                ))}

                {days.map((day, idx) => {
                    const dayEvents = events.filter(e => isSameDay(new Date(e.start), day));
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isHighlight = isToday(day);

                    return (
                        <div
                            key={idx}
                            className={clsx(
                                "flex flex-col gap-1.5 p-3 rounded-2xl transition-all duration-500 border min-h-0",
                                isCurrentMonth
                                    ? "bg-white/5 border-white/10 hover:bg-white/10"
                                    : "bg-transparent border-transparent opacity-10",
                                isHighlight && "bg-white/15 border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.1)] ring-1 ring-white/20"
                            )}
                        >
                            <div className="flex justify-between items-start">
                                <span className={clsx(
                                    "text-sm font-black tracking-tighter",
                                    isHighlight ? "text-white" : isCurrentMonth ? "text-white/70" : "text-white/30"
                                )}>
                                    {format(day, 'd')}
                                </span>
                                {isHighlight && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
                                )}
                            </div>

                            <div className="flex flex-col gap-1.5 overflow-y-auto no-scrollbar mt-1">
                                {dayEvents.map(event => (
                                    <div
                                        key={event.id}
                                        className={clsx(
                                            "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-tight truncate border-l-2 shadow-sm",
                                            CALENDAR_COLORS[event.calendarId] || CALENDAR_COLORS.default,
                                            "bg-opacity-20 border-white/20"
                                        )}
                                    >
                                        {event.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
