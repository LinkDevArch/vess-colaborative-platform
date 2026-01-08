"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
    const { setTheme, theme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Prevent hydration mismatch
    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400">
                <div className="w-4 h-4" />
            </button>
        )
    }

    const toggleTheme = () => {
        if (resolvedTheme === 'dark') setTheme('light')
        else setTheme('dark')
    }

    return (
        <button
            onClick={toggleTheme}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
            aria-label="Toggle theme"
        >
            <Sun className={`h-[1.2rem] w-[1.2rem] transition-all duration-300 absolute ${resolvedTheme === 'dark' ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0'}`} />
            <Moon className={`h-[1.2rem] w-[1.2rem] transition-all duration-300 absolute text-white ${resolvedTheme === 'dark' ? 'scale-100 rotate-0' : 'scale-0 -rotate-90 opacity-0'}`} />
            <span className="sr-only">Toggle theme</span>
        </button>
    )
}
