"use client";

import { CloudRain, Sun, Cloud, Thermometer } from "lucide-react";

export function Weather() {
    // Static data for now
    return (
        <div className="glass p-6 rounded-3xl flex items-center gap-6 text-white w-fit">
            <div className="flex flex-col">
                <span className="text-5xl font-light">72°</span>
                <span className="text-sm opacity-70">San Francisco</span>
            </div>
            <div className="h-12 w-[1px] bg-white/20" />
            <div className="flex items-center gap-3">
                <CloudRain className="w-10 h-10 text-blue-400" />
                <div className="flex flex-col">
                    <span className="text-lg font-medium leading-tight">Light Rain</span>
                    <span className="text-xs opacity-60">High: 75° Low: 68°</span>
                </div>
            </div>
        </div>
    );
}
