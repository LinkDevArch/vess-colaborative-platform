'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const profileSchema = z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    // Avatar handling will be done separately or passed as url
});

export async function updateProfile(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Unauthorized' };
    }

    const fullName = formData.get('fullName') as string;
    const avatarUrl = formData.get('avatarUrl') as string; // We'll assume client uploads and sends URL for now, or handle file here?
    // Start simple: Client uploads to storage, sends URL here. Or simply update textual data.
    // Actually, for avatar, standard pattern: Upload -> Get URL -> Update Profile.
    // Let's assume the form handles upload and sends the URL if changed.

    // Validate
    const validation = profileSchema.safeParse({ fullName });
    if (!validation.success) {
        return { error: validation.error.errors[0].message };
    }

    const updates: any = {
        full_name: fullName,
        updated_at: new Date().toISOString(),
    };

    if (avatarUrl) {
        updates.avatar_url = avatarUrl;
    }

    const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

    if (error) {
        console.error('Error updating profile:', error);
        return { error: 'Failed to update profile' };
    }

    revalidatePath('/dashboard');
    return { success: true };
}

export async function updateEmail(email: string) {
    const supabase = await createClient();

    // Supabase handles the verification flow automatically.
    // It sends a confirmation email to both old and new addresses.
    const { error } = await supabase.auth.updateUser({ email });

    if (error) {
        console.error('Error updating email:', error);
        return { error: error.message };
    }

    return { success: true, message: 'Confirmation link sent to both emails' };
}

export async function updatePassword(password: string) {
    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
        console.error('Error updating password:', error);
        return { error: error.message };
    }

    return { success: true };
}
