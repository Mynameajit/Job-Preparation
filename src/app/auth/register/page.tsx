'use client';

import React, { useState } from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { motion } from 'framer-motion';
import { Mail, Lock, User, UserPlus, Loader2, ShieldAlert, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';


export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            return alert("Passwords do not match");
        }

        setIsLoading(true);
        try {
            // Only send fields expected by the backend
            const { name, email, password } = formData;
            const res = await api.post("/user/register", {
                name,
                email,
                password,
                // role: "ADMIN"
            });

            if (res.data.success) {
                router.push("/auth/login");
            }
        } catch (error: any) {
            console.error("Register Error:", error);
            const errorMsg = error.response?.data?.message || "Something went wrong during registration";
            console.log(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <AuthLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="space-y-3">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-2 shadow-lg shadow-emerald-500/5"
                    >
                        <UserPlus className="text-emerald-500" size={24} />
                    </motion.div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Create Account</h1>
                        <p className="text-sm text-zinc-500">
                            Join the Job Preparation Portal to start your career journey.
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleRegister} className="space-y-5">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-semibold text-zinc-400 ml-1">
                            Full Name
                        </label>
                        <div className="relative group">
                            <User className="absolute left-4 z-10 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                            <input
                                id="name"
                                type="text"
                                required
                                autoComplete="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-zinc-900/40 border border-zinc-800 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-emerald-500/40 focus:ring-4 focus:ring-emerald-500/5 transition-all text-zinc-200 backdrop-blur-sm placeholder:text-zinc-600"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-semibold text-zinc-400 ml-1">
                            Email Address
                        </label>
                        <div className="relative group">
                            <Mail className="absolute left-4 z-10 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                            <input
                                id="email"
                                type="email"
                                required
                                autoComplete="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-zinc-900/40 border border-zinc-800 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-emerald-500/40 focus:ring-4 focus:ring-emerald-500/5 transition-all text-zinc-200 backdrop-blur-sm placeholder:text-zinc-600"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-semibold text-zinc-400 ml-1">
                                Password
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-4 z-10 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    autoComplete="new-password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-zinc-900/40 border border-zinc-800 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-emerald-500/40 focus:ring-4 focus:ring-emerald-500/5 transition-all text-zinc-200 backdrop-blur-sm placeholder:text-zinc-600"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-semibold text-zinc-400 ml-1">
                                Confirm Password
                            </label>
                            <div className="relative group">
                                <ShieldAlert className="absolute z-10 left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    required
                                    autoComplete="new-password"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full bg-zinc-900/40 border rounded-2xl py-3 pl-12 pr-4 outline-none transition-all text-zinc-200 backdrop-blur-sm placeholder:text-zinc-600 ${formData.confirmPassword && formData.password !== formData.confirmPassword
                                        ? 'border-red-900 focus:ring-red-500/10'
                                        : 'border-zinc-800 focus:border-emerald-500/40 focus:ring-emerald-500/5'
                                        }`}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || (formData.password !== formData.confirmPassword && formData.confirmPassword !== '')}
                        className="w-full h-12 cursor-pointer bg-white hover:bg-zinc-100 disabled:bg-zinc-900 disabled:text-zinc-700 disabled:cursor-not-allowed text-black font-bold py-3 rounded-2xl transition-all flex items-center justify-center gap-3 relative overflow-hidden group shadow-lg shadow-white/5 active:scale-[0.98]"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin text-zinc-900 z-10" size={20} />
                        ) : (
                            <>
                                <span className="text-base">Register Now</span>
                                <ArrowRight size={18} className="translate-y-[1px] z-10 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center pt-2">
                    <p className="text-sm text-zinc-500">
                        Already have an account?{' '}
                        <Link href="/auth/login" className="text-emerald-500 hover:text-emerald-400 font-bold ml-1 transition-colors">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}
