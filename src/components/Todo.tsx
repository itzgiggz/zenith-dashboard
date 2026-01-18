"use client";

import { CheckCircle2, Circle } from "lucide-react";

export function Todo() {
    const todos = [
        { text: "Update DAKboard configuration", done: true },
        { text: "Call plumber for kitchen sink", done: false },
        { text: "Prepare presentation for Monday", done: false },
        { text: "Buy groceries for dinner", done: false },
    ];

    return (
        <div className="glass p-6 rounded-3xl text-white w-full max-w-md">
            <div className="flex items-center gap-2 mb-6 opacity-80 uppercase tracking-widest text-sm font-bold">
                <CheckCircle2 className="w-4 h-4" />
                Tasks & Focus
            </div>
            <div className="space-y-4">
                {todos.map((todo, i) => (
                    <div key={i} className="flex items-center gap-4 group cursor-pointer">
                        {todo.done ? (
                            <CheckCircle2 className="w-5 h-5 text-green-400 opacity-60" />
                        ) : (
                            <Circle className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                        )}
                        <span className={`text-base ${todo.done ? 'line-through opacity-50' : 'opacity-90'}`}>
                            {todo.text}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
