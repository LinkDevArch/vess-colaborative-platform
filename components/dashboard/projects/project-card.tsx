import Link from "next/link";
import { Users } from "lucide-react";

interface Member {
    id: string;
    avatar_url?: string | null;
    full_name?: string | null;
}

interface ProjectCardProps {
    id: string;
    name: string;
    color: string;
    members: Member[];
}

export function ProjectCard({ id, name, color, members }: ProjectCardProps) {
    return (
        <Link href={`/dashboard/projects/${id}`} className="block h-full">
            <article
                className="group relative bg-white border border-slate-200 rounded-lg p-5 h-48 flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5"
            >
                {/* Colored Accent Line */}
                <div
                    className="absolute top-0 left-0 right-0 h-1 rounded-t-lg transition-opacity opacity-80 group-hover:opacity-100"
                    style={{ backgroundColor: color || '#3B8E8E' }}
                />

                {/* Header */}
                <div className="flex items-start justify-between mt-2">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-8 h-8 rounded-md flex items-center justify-center text-white text-xs font-bold shadow-sm"
                            style={{ backgroundColor: color || '#3B8E8E' }}
                        >
                            {name.substring(0, 2).toUpperCase()}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div>
                    <h3 className="text-slate-800 text-lg font-bold tracking-tight mb-1 truncate group-hover:text-[#3B8E8E] transition-colors" title={name}>
                        {name}
                    </h3>
                </div>

                {/* Footer / Members */}
                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex -space-x-2">
                        {members.slice(0, 4).map((member, i) => (
                            <div
                                key={member.id || i}
                                className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 overflow-hidden"
                                title={member.full_name || 'Member'}
                            >
                                {member.avatar_url ? (
                                    <img src={member.avatar_url} alt={member.full_name || 'User'} className="w-full h-full object-cover" />
                                ) : (
                                    <span>
                                        {(member.full_name?.[0] || '?').toUpperCase()}
                                    </span>
                                )}
                            </div>
                        ))}
                        {members.length > 4 && (
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-[10px] font-medium text-slate-500">
                                +{members.length - 4}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-[#3B8E8E] transition-colors">
                        <Users size={16} />
                        <span className="text-xs font-semibold">{members.length}</span>
                    </div>
                </div>
            </article>
        </Link>
    );
}
