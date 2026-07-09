'use client';

import React, { useState, useEffect } from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, KeyRound, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/hooks/api/useAuth';

export default function LoginPage() {

    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isOtpMode, setIsOtpMode] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);

    const { mutate: login, isPending: isLoading } = useLogin();

    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsEmailValid(emailRegex.test(email));
    }, [email]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        login(
            { email, password: !isOtpMode ? password : undefined, otp: isOtpMode ? otp : undefined, isOtpMode },
            {
                onSuccess: (data) => {
                    if (data.success) {
                        if (data.data?.role === 'ADMIN') {
                            router.push("/dashboard/admin");
                        } else {
                            router.push("/dashboard/student");
                        }
                    }
                },
                onError: (error) => {
                    console.error("Login failed:", error);
                }
            }
        );
    };

    return (
        <AuthLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div
                            className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-lg shadow-emerald-500/5"
                        >
                            <ShieldCheck className="text-emerald-500" size={24} />
                        </div>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Official Portal</span>
                            <span className="px-3 py-1 rounded-lg bg-zinc-900/50 border border-zinc-800 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">v1.2.0</span>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
                            Welcome Back
                        </h1>
                        <p className="text-sm text-zinc-500">
                            Log in to your Job Preparation account to continue.
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                    {/* Email Field */}
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-semibold text-zinc-400 ml-1">
                            Email Address
                        </label>
                        <div className="relative group">
                            <Mail className="absolute z-10 left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                            <input
                                id="email"
                                type="email"
                                required
                                autoComplete="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-zinc-900/40 border border-zinc-800 rounded-2xl py-3 pl-12 pr-4 outline-none 
                  focus:border-emerald-500/40 focus:ring-4 focus:ring-emerald-500/5 
                  hover:border-zinc-700 transition-all text-zinc-200
                  placeholder:text-zinc-600 backdrop-blur-sm"
                            />
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {!isOtpMode ? (
                            <motion.div
                                key="password-mode"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <label htmlFor="password" className="text-sm font-semibold text-zinc-400 ml-1">
                                        Password
                                    </label>
                                    <div className="relative group">
                                        <Lock className="absolute z-10 left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            required={!isOtpMode}
                                            autoComplete="current-password"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full z-10 bg-zinc-900/40 border border-zinc-800 rounded-2xl py-3 pl-12 pr-14 outline-none 
                        focus:border-emerald-500/40 focus:ring-4 focus:ring-emerald-500/5 
                        hover:border-zinc-700 transition-all text-zinc-200
                        placeholder:text-zinc-600 backdrop-blur-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-emerald-500 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <div className="flex justify-end pr-1">
                                        <Link
                                            href="/auth/forgot-password"
                                            className="text-xs font-semibold text-emerald-500 hover:text-emerald-400 transition-colors underline-offset-4 hover:underline"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="otp-mode"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                <AnimatePresence>
                                    {isEmailValid && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="space-y-2"
                                        >
                                            <label htmlFor="otp" className="text-sm font-semibold text-zinc-400 ml-1">
                                                Email Verification Code
                                            </label>
                                            <div className="relative group">
                                                <KeyRound className="absolute z-10 left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                                <input
                                                    id="otp"
                                                    type="text"
                                                    maxLength={6}
                                                    required={isOtpMode && isEmailValid}
                                                    placeholder="000000"
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                                    className="w-full  bg-zinc-900/40 border border-zinc-800 rounded-2xl py-3 pl-12 pr-4 outline-none 
                            focus:border-emerald-500/40 focus:ring-4 focus:ring-emerald-500/5 
                            hover:border-zinc-700 transition-all text-lg tracking-[0.4em] text-emerald-500 font-bold
                            placeholder:text-zinc-600 backdrop-blur-sm"
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                {!isEmailValid && (
                                    <div className="p-6 rounded-2xl bg-black/40 border border-zinc-800 border-dashed text-zinc-500 text-sm text-center">
                                        Enter a valid email to receive your code.
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading || (isOtpMode && !isEmailValid)}
                        className="w-full h-12 bg-white hover:bg-zinc-100 disabled:bg-zinc-900 disabled:text-zinc-700 disabled:cursor-not-allowed text-black font-bold rounded-2xl transition-all flex items-center justify-center gap-3 relative overflow-hidden group shadow-lg shadow-white/5 active:scale-[0.98]"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin text-zinc-900" size={20} />
                        ) : (
                            <>
                                <span className="text-base">Login to Account</span>
                                <ArrowRight size={18} className="translate-y-[1px] group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>

                    {/* Mode Switch Button */}
                    <button
                        type="button"
                        onClick={() => setIsOtpMode(!isOtpMode)}
                        className="w-full h-12 cursor-pointer bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl text-sm font-semibold text-zinc-400 hover:text-white transition-all flex items-center justify-center gap-3 active:scale-[0.99]"
                    >
                        {isOtpMode ? "Sign in with Password" : "Sign in with Email OTP"}
                    </button>
                </form>

                <div className="text-center pt-2">
                    <p className="text-sm text-zinc-500">
                        Don&apos;t have an account?{' '}
                        <Link href="/auth/register" className="text-emerald-500 hover:text-emerald-400 font-bold ml-1 transition-colors">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}
