'use client';

import { useState } from 'react';
import { Lock, Mail, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { updateEmail, updatePassword } from '@/app/dashboard/settings/actions';
import { useNotifications } from '@/components/dashboard/notifications/notifications-provider';

interface SecurityFormProps {
    user: any;
}

export function SecurityForm({ user }: SecurityFormProps) {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isEmailLoading, setIsEmailLoading] = useState(false);
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);

    const { addNotification } = useNotifications();

    const handleEmailUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsEmailLoading(true);
        try {
            const result = await updateEmail(email);
            if (result.error) {
                addNotification({ type: 'error', title: 'Error', message: result.error });
            } else {
                addNotification({
                    type: 'success',
                    title: 'Confirmation Sent',
                    message: `We sent a confirmation link to both ${user.email} and ${email}.`
                });
                setEmail('');
            }
        } catch (error) {
            addNotification({ type: 'error', title: 'Error', message: 'Something went wrong' });
        } finally {
            setIsEmailLoading(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            addNotification({ type: 'error', title: 'Mismatch', message: 'Passwords do not match' });
            return;
        }

        if (newPassword.length < 6) {
            addNotification({ type: 'error', title: 'Weak Password', message: 'Password must be at least 6 characters' });
            return;
        }

        setIsPasswordLoading(true);
        try {
            const result = await updatePassword(newPassword);
            if (result.error) {
                addNotification({ type: 'error', title: 'Error', message: result.error });
            } else {
                addNotification({ type: 'success', title: 'Success', message: 'Password updated successfully' });
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (error) {
            addNotification({ type: 'error', title: 'Error', message: 'Something went wrong' });
        } finally {
            setIsPasswordLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Email Section */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Mail size={18} className="text-slate-500" />
                        Email Address
                    </h2>
                    <p className="text-sm text-slate-500">Change your account email address.</p>
                </div>
                <div className="p-6">
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg flex gap-3 text-blue-700 text-sm">
                        <AlertTriangle size={20} className="shrink-0" />
                        <p>
                            For security, changing your email requires confirming the action via a link sent to <strong>both</strong> your old and new email addresses.
                        </p>
                    </div>

                    <form onSubmit={handleEmailUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Current Email</label>
                            <input
                                type="text"
                                value={user.email}
                                disabled
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">New Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="new@example.com"
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3B8E8E]/20 focus:border-[#3B8E8E]"
                                required
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isEmailLoading || !email}
                                className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-800 transition-all disabled:opacity-50"
                            >
                                {isEmailLoading && <Loader2 size={16} className="animate-spin" />}
                                Update Email
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Password Section */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Lock size={18} className="text-slate-500" />
                        Change Password
                    </h2>
                    <p className="text-sm text-slate-500">Update your password to keep your account secure.</p>
                </div>
                <div className="p-6">
                    <form onSubmit={handlePasswordUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3B8E8E]/20 focus:border-[#3B8E8E]"
                                placeholder="••••••••"
                                minLength={6}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3B8E8E]/20 focus:border-[#3B8E8E]"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isPasswordLoading || !newPassword || !confirmPassword}
                                className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-800 transition-all disabled:opacity-50"
                            >
                                {isPasswordLoading && <Loader2 size={16} className="animate-spin" />}
                                Update Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
