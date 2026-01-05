'use client';

import { useEffect, useState } from "react";

export function GreetingHeader({ userName }: { userName: string }) {
    const [greeting, setGreeting] = useState("Welcome back");

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good morning");
        else if (hour < 18) setGreeting("Good afternoon");
        else setGreeting("Good evening");
    }, []);

    return (
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                {greeting}, <span className="text-[#3B8E8E]">{userName}</span>
            </h1>
            <p className="text-slate-500 mt-1">Here's what's happening today.</p>
        </div>
    );
}
