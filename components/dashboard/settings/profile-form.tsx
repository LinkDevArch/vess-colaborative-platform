'use client';

import { useState } from 'react';
import { User, Camera, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { updateProfile } from '@/app/dashboard/settings/actions';
import { useNotifications } from '@/components/dashboard/notifications/notifications-provider';

interface ProfileFormProps {
    user: any;
    profile: any;
}

export function ProfileForm({ user, profile }: ProfileFormProps) {
    const [fullName, setFullName] = useState(profile?.full_name || '');
    const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { addNotification } = useNotifications();

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const filePath = `${user.id}-${Math.random()}.${fileExt}`;

        setIsUploading(true);
        const supabase = createClient();

        try {
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get public URL
            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
            setAvatarUrl(data.publicUrl);

            addNotification({
                type: 'success',
                title: 'Avatar Uploaded',
                message: 'Remember to save changes to apply the new avatar.'
            });
        } catch (error) {
            console.error('Error uploading avatar:', error);
            addNotification({
                type: 'error',
                title: 'Upload Failed',
                message: 'Could not upload avatar image.'
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const formData = new FormData();
        formData.append('fullName', fullName);
        formData.append('avatarUrl', avatarUrl);

        try {
            const result = await updateProfile(formData);
            if (result.error) {
                addNotification({
                    type: 'error',
                    title: 'Update Failed',
                    message: result.error
                });
            } else {
                addNotification({
                    type: 'success',
                    title: 'Profile Updated',
                    message: 'Your profile has been successfully updated.'
                });
            }
        } catch (error) {
            addNotification({
                type: 'error',
                title: 'Error',
                message: 'An unexpected error occurred.'
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-800">Public Profile</h2>
                <p className="text-sm text-slate-500">Manage how you appear to other users.</p>
            </div>

            <div className="p-6 space-y-6">
                {/* Avatar Section */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">Profile Photo</label>
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center border-4 border-white shadow-md overflow-hidden">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={40} className="text-slate-400" />
                                )}
                            </div>
                            <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                                <Camera size={24} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    disabled={isUploading}
                                    className="hidden"
                                />
                            </label>
                            {isUploading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-full">
                                    <Loader2 size={24} className="animate-spin text-[#3B8E8E]" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900 mb-1">Update your photo</p>
                            <p className="text-xs text-slate-500 mb-3">Click on the avatar to upload. Recommended: Square JPG or PNG, at least 400x400px.</p>
                        </div>
                    </div>
                </div>

                {/* Name Section */}
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-2">
                        Full Name
                    </label>
                    <input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3B8E8E]/20 focus:border-[#3B8E8E] transition-all"
                        placeholder="John Doe"
                    />
                </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                    type="submit"
                    disabled={isSaving || isUploading}
                    className="flex items-center gap-2 bg-[#3B8E8E] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#2A6E6E] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving && <Loader2 size={16} className="animate-spin" />}
                    Save Changes
                </button>
            </div>
        </form>
    );
}
