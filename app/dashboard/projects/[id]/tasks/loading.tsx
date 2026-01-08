export default function Loading() {
    return (
        <div className="px-4 md:px-6">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between mb-6">
                <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                <div className="h-10 w-28 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
            </div>

            {/* Filter Skeleton */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit mb-6">
                <div className="h-8 w-24 bg-white dark:bg-slate-600 rounded-md shadow-sm" />
                <div className="h-8 w-24" />
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 h-40 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
                            <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                        </div>
                        <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse my-2" />
                        <div className="flex justify-end pt-2 border-t border-slate-50 dark:border-slate-800">
                            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
