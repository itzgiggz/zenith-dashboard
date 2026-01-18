"use client";

import { Lightbulb, Lock, Thermometer, ShieldCheck } from "lucide-react";

export function HomeControls() {
    const controls = [
        { icon: Lightbulb, label: "Lights", status: "On", active: true },
        { icon: Lock, label: "Garage", status: "Closed", active: false },
        { icon: Thermometer, label: "Thermostat", status: "72°", active: true },
        { icon: ShieldCheck, label: "Security", status: "Armed", active: true },
    ];

    return (
        <div className="flex gap-4">
            {controls.map((item, i) => (
                <div
                    key={i}
                    className={`glass p-4 rounded-2xl flex flex-col items-center justify-center min-w-[100px] transition-all duration-300 hover:scale-105 cursor-pointer ${item.active ? 'bg-white/20' : ''}`}
                >
                    <item.icon className={`w-6 h-6 mb-2 ${item.active ? 'text-yellow-400' : 'text-white/60'}`} />
                    <span className="text-xs font-semibold uppercase tracking-wider opacity-60">{item.label}</span>
                    <span className="text-sm font-bold">{item.status}</span>
                </div>
            ))}
        </div>
    );
}
