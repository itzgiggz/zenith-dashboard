"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

export function Clock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-white drop-shadow-2xl">
            <h1 className="text-8xl font-light tracking-tighter">
                {format(time, "HH:mm")}
            </h1>
            <p className="text-2xl font-medium opacity-80 uppercase tracking-widest mt-2">
                {format(time, "EEEE, MMMM do")}
            </p>
        </div>
    );
}
