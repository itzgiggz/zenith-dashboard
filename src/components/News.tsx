"use client";

import { Newspaper } from "lucide-react";

export function News() {
    const news = [
        { title: "Disney Plus will discount a bundle with Hulu and ESPN Plus", source: "CNET", time: "32 mins ago" },
        { title: "New AI breakthroughs in natural language processing", source: "TechCrunch", time: "1 hour ago" },
        { title: "Universal Basic Income trial shows promising results in Europe", source: "BBC", time: "2 hours ago" },
    ];

    return (
        <div className="glass p-6 rounded-3xl text-white w-full max-w-md">
            <div className="flex items-center gap-2 mb-6 opacity-80 uppercase tracking-widest text-sm font-bold">
                <Newspaper className="w-4 h-4" />
                Latest Briefing
            </div>
            <div className="space-y-6">
                {news.map((item, i) => (
                    <div key={i} className="group cursor-pointer">
                        <h3 className="text-lg font-semibold group-hover:text-blue-400 transition-colors leading-snug">{item.title}</h3>
                        <div className="flex gap-3 mt-2 text-[10px] uppercase font-bold tracking-tighter opacity-50">
                            <span className="text-blue-400">{item.source}</span>
                            <span>•</span>
                            <span>{item.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
