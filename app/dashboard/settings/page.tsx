import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/dashboard/settings/profile-form';
import { SecurityForm } from '@/components/dashboard/settings/security-form';
import { Settings, Shield, User } from 'lucide-react';

export default async function UserSettingsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
                        <Settings size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Account Settings</h1>
                        <p className="text-slate-500">Manage your profile and security preferences.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-12">
                {/* Profile Section */}
                <section id="profile" className="scroll-mt-24">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <User size={20} className="text-[#3B8E8E]" />
                        Profile Information
                    </h3>
                    <ProfileForm user={user} profile={profile} />
                </section>

                <div className="h-px bg-slate-200" />

                {/* Security Section */}
                <section id="security" className="scroll-mt-24">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <Shield size={20} className="text-[#3B8E8E]" />
                        Security
                    </h3>
                    <SecurityForm user={user} />
                </section>
            </div>
        </div>
    );
}
