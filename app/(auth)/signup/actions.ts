'use server';

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function signup(formData: FormData) {
    const supabase = await createClient();

    const data = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        confirm_password: formData.get('confirm_password') as string,
    }

    if (data.password !== data.confirm_password) {
        return redirect('/signup?message=Las contraseñas no coinciden')
    }

    const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
            data: {
                full_name: data.name,
            }
        }
    });

    if (error) {
        return redirect(`/signup?message=${encodeURIComponent(error.message)}`)
    }

    console.log(error);

    revalidatePath('/', 'layout');
    redirect('/login');
}