'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function Clock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex items-center gap-4 text-white/40 font-bold uppercase tracking-[0.2em] text-xs">
            <span>{format(time, 'EEEE, MMMM do')}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-white/60">{format(time, 'h:mm a')}</span>
        </div>
    );
}
