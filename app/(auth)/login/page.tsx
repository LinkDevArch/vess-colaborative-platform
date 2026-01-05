import Link from "next/link";
import { login } from "./actions";

export default function Login() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F4F9FA] p-4 sm:p-6 text-slate-800">
            <div className="w-full max-w-sm sm:max-w-md flex flex-col items-center bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100">
                {/* Logo/Brand */}
                <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 tracking-wide text-black">VESS</h1>

                {/* Heading */}
                <h2 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8 text-center text-slate-900">
                    Welcome back
                </h2>

                {/* Form Container */}
                <form className="w-full space-y-4" action={login}>

                    {/* Email Input */}
                    <div className="relative">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Email address"
                            className="w-full px-4 py-3 sm:py-3.5 rounded-xl border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B8E8E] focus:border-transparent transition-all duration-200 bg-white text-base"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Password"
                            className="w-full px-4 py-3 sm:py-3.5 rounded-xl border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B8E8E] focus:border-transparent transition-all duration-200 bg-white text-base"
                        />
                    </div>

                    {/* Forgot Password Link */}
                    <div className="flex justify-end pt-1">
                        <button className="text-sm font-medium text-[#3B8E8E] hover:text-[#2A6E6E] transition-colors">
                            Forgot password?
                        </button>
                    </div>

                    {/* Login Button */}
                    <button className="w-full bg-[#3B8E8E] hover:bg-[#2A6E6E] text-white font-semibold py-3 sm:py-3.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mt-4 text-base sm:text-lg">
                        Log In
                    </button>

                    {/* Sign Up Link */}
                    <div className="text-center mt-6 text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link href="/signup" className="font-medium text-[#3B8E8E] hover:text-[#2A6E6E] transition-colors">
                            Sign up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}