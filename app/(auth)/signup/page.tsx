'use client';

import Link from "next/link";
import { signup } from "./actions";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SignupForm() {
    const searchParams = useSearchParams();
    const message = searchParams.get("message");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [touched, setTouched] = useState(false);

    // Validations
    const validations = [
        { label: "Min. 6 characters", valid: password.length >= 6 },
        { label: "One lowercase", valid: /[a-z]/.test(password) },
        { label: "One uppercase", valid: /[A-Z]/.test(password) },
        { label: "One number", valid: /[0-9]/.test(password) },
        { label: "One symbol (!@#$)", valid: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    ];

    const isPasswordValid = validations.every(v => v.valid);
    const passwordsMatch = password === confirmPassword && password !== "";
    const isFormValid = isPasswordValid && passwordsMatch;

    return (

        <div className="w-full max-w-sm sm:max-w-md flex flex-col items-center bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            {/* Logo/Brand */}
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 tracking-wide text-black dark:text-white">VESS</h1>

            {/* Heading */}
            <h2 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8 text-center text-slate-900 dark:text-white">
                Create account
            </h2>

            {/* Server Error Message */}
            {message && (
                <div className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-6 text-sm border border-red-100 dark:border-red-900/30 text-center">
                    {message}
                </div>
            )}

            {/* Form Container */}
            <form className="w-full space-y-4" action={signup}>

                {/* Full Name Input */}
                <div className="relative">
                    <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Full Name"
                        required
                        className="w-full px-4 py-3 sm:py-3.5 rounded-xl border border-gray-300 dark:border-slate-700 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3B8E8E] focus:border-transparent transition-all duration-200 bg-white dark:bg-slate-800 text-base text-slate-900 dark:text-white"
                    />
                </div>

                {/* Email Input */}
                <div className="relative">
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Email address"
                        required
                        className="w-full px-4 py-3 sm:py-3.5 rounded-xl border border-gray-300 dark:border-slate-700 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3B8E8E] focus:border-transparent transition-all duration-200 bg-white dark:bg-slate-800 text-base text-slate-900 dark:text-white"
                    />
                </div>

                {/* Password Input */}
                <div className="relative">
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (!touched) setTouched(true);
                        }}
                        className="w-full px-4 py-3 sm:py-3.5 rounded-xl border border-gray-300 dark:border-slate-700 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3B8E8E] focus:border-transparent transition-all duration-200 bg-white dark:bg-slate-800 text-base text-slate-900 dark:text-white"
                    />
                </div>

                {/* Real-time Validation Checklist */}
                {touched && (
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-800/50 p-3 rounded-lg border border-gray-100 dark:border-slate-800">
                        {validations.map((v, i) => (
                            <div key={i} className={`flex items-center space-x-1.5 ${v.valid ? 'text-teal-600 dark:text-teal-400 font-medium' : ''}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${v.valid ? 'bg-teal-500' : 'bg-gray-300 dark:bg-slate-600'}`} />
                                <span>{v.label}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Confirm Password Input */}
                <div className="relative">
                    <input
                        type="password"
                        name="confirm_password"
                        id="confirm_password"
                        placeholder="Confirm Password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full px-4 py-3 sm:py-3.5 rounded-xl border ${passwordsMatch || !confirmPassword ? 'border-gray-300 dark:border-slate-700' : 'border-red-300 dark:border-red-800 focus:ring-red-200 dark:focus:ring-red-900/30'} placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3B8E8E] focus:border-transparent transition-all duration-200 bg-white dark:bg-slate-800 text-base text-slate-900 dark:text-white`}
                    />
                </div>

                {/* Signup Button */}
                <button
                    disabled={!isFormValid}
                    className={`w-full text-white font-semibold py-3 sm:py-3.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mt-6 text-base sm:text-lg
                        ${isFormValid ? 'bg-[#3B8E8E] hover:bg-[#2A6E6E]' : 'bg-gray-300 dark:bg-slate-700 cursor-not-allowed transform-none hover:shadow-md hover:translate-y-0'}`}
                >
                    Sign Up
                </button>

                {/* Login Link */}
                <div className="text-center mt-6 text-sm text-gray-600 dark:text-slate-400">
                    Already have an account?{" "}
                    <Link href="/login" className="font-medium text-[#3B8E8E] hover:text-[#2A6E6E] transition-colors">
                        Log in
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default function Signup() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F4F9FA] dark:bg-slate-950 p-4 sm:p-6 text-slate-800 dark:text-slate-200">
            <Suspense fallback={<div>Loading...</div>}>
                <SignupForm />
            </Suspense>
        </div>
    );
}