export default function Loading() {
    return (
        <div className="px-4 md:px-6">
            <div className="flex items-center justify-between mb-6">
                <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
            </div>

            {/* Upload Area Skeleton */}
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />
                <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            </div>

            {/* List Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 h-24 flex flex-col justify-between">
                        <div className="flex items-start justify-between">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />
                        </div>
                        <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                    </div>
                ))}
            </div>
        </div>
    );
}
