export default function Loading() {
    return (
        <div className="px-4 md:px-6">
            <div className="flex items-center justify-between mb-6">
                <div className="h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
            </div>

            <div className="flex flex-col h-[600px] border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 overflow-hidden">
                {/* Messages Area Skeleton */}
                <div className="flex-1 p-4 space-y-6 bg-slate-50 dark:bg-slate-900/50">
                    {/* Message Left */}
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                        <div className="w-48 h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl rounded-tl-none animate-pulse" />
                    </div>

                    {/* Message Right */}
                    <div className="flex gap-3 flex-row-reverse">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                        <div className="w-64 h-16 bg-slate-300 dark:bg-slate-700 rounded-2xl rounded-tr-none animate-pulse" />
                    </div>

                    {/* Message Left */}
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                        <div className="w-32 h-10 bg-slate-200 dark:bg-slate-800 rounded-2xl rounded-tl-none animate-pulse" />
                    </div>
                </div>

                {/* Input Area Skeleton */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex gap-2">
                    <div className="flex-1 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
                    <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                </div>
            </div>
        </div>
    );
}
