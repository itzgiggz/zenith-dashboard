"use client";

import { Calendar as CalendarIcon, MapPin } from "lucide-react";

export function Calendar() {
    const events = [
        { time: "10:00 AM", title: "Sprint Review", location: "Conference Room 2", description: "Reviewing results of the recent sprint." },
        { time: "01:00 PM", title: "Developer Training", location: "Room 3", description: "Agile methodologies for new devs." },
        { time: "04:00 PM", title: "Customer BBQ", location: "Central Commons", description: "Team appreciation event." },
    ];

    return (
        <div className="glass p-6 rounded-3xl text-white w-full max-w-md">
            <div className="flex items-center gap-2 mb-6 opacity-80 uppercase tracking-widest text-sm font-bold">
                <CalendarIcon className="w-4 h-4" />
                Upcoming Schedule
            </div>
            <div className="space-y-6">
                {events.map((event, i) => (
                    <div key={i} className="group cursor-pointer">
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-orange-400 font-bold text-sm tracking-tighter uppercase">{event.time}</span>
                            {event.location && (
                                <span className="text-[10px] opacity-50 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {event.location}
                                </span>
                            )}
                        </div>
                        <h3 className="text-lg font-semibold group-hover:text-orange-400 transition-colors">{event.title}</h3>
                        <p className="text-sm opacity-60 line-clamp-2 leading-relaxed mt-1">{event.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
