"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

export function FinanceTicker() {
    const stocks = [
        { symbol: "AAPL", price: "195.90", change: "-0.56%", up: false },
        { symbol: "MSFT", price: "133.73", change: "-0.71%", up: false },
        { symbol: "NFLX", price: "300.77", change: "-3.01%", up: false },
        { symbol: "SOL", price: "98.45", change: "+4.20%", up: true },
        { symbol: "XRP", price: "0.58", change: "+1.33%", up: true },
        { symbol: "ETH", price: "2450.12", change: "+0.85%", up: true },
    ];

    // Duplicate list for infinite scroll effect
    const displayStocks = [...stocks, ...stocks];

    return (
        <div className="glass-dark w-full py-3 overflow-hidden border-x-0 border-b-0">
            <motion.div
                className="flex whitespace-nowrap gap-12"
                animate={{ x: [0, -1000] }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear"
                }}
            >
                {displayStocks.map((stock, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <span className="text-sm font-bold opacity-60 uppercase">{stock.symbol}</span>
                        <span className="text-lg font-bold">${stock.price}</span>
                        <span className={`text-[12px] flex items-center gap-1 font-bold ${stock.up ? 'text-green-400' : 'text-red-400'}`}>
                            {stock.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {stock.change}
                        </span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
