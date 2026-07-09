'use client';

import React, { useState } from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Loader2, Key, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleResetRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      console.log('Reset Request for:', email);
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <AuthLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-2 shadow-lg shadow-emerald-500/5"
          >
            <Key className="text-emerald-500" size={24} />
          </motion.div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
              Forgot Password?
            </h1>
            <p className="text-sm text-zinc-500">
              Enter the email associated with your account to receive reset instructions.
            </p>
          </div>
        </div>

        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-3xl bg-black/40 border border-zinc-900 text-center space-y-6 backdrop-blur-xl shadow-2xl"
          >
            <div className="w-20 h-20 bg-emerald-500/5 rounded-3xl flex items-center justify-center mx-auto mb-2 border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
              <Mail className="text-emerald-500 z-10" size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Reset Email Sent</h3>
              <p className="text-sm text-zinc-500 leading-relaxed px-4">
                We&apos;ve sent recovery instructions to: <br />
                <span className="text-emerald-500 font-semibold block mt-1">{email}</span>
              </p>
            </div>
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-xs font-bold text-zinc-400 hover:text-emerald-500 transition-all pt-2 underline underline-offset-4"
            >
              Didn&apos;t receive it? Try again
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleResetRequest} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-zinc-400 ml-1">
                Account Email Address
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
                  className="w-full bg-zinc-900/40 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-emerald-500/40 focus:ring-4 focus:ring-emerald-500/5 transition-all text-zinc-200 backdrop-blur-sm placeholder:text-zinc-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full h-12 bg-white hover:bg-zinc-100 disabled:bg-zinc-900 disabled:text-zinc-700 disabled:cursor-not-allowed text-black font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 relative overflow-hidden group shadow-lg shadow-white/5 active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="animate-spin text-zinc-900" size={20} />
              ) : (
                <>
                  <span className="text-base text-zinc-900">Request Reset Link</span>
                  <ArrowRight size={18} className="translate-y-[1px] group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="pt-6 border-t border-zinc-900/50">
          <Link
            href="/auth/login"
            className="w-full h-12 bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 rounded-2xl flex items-center justify-center gap-3 group transition-all text-sm font-semibold text-zinc-400 hover:text-white"
          >
            <ArrowLeft size={18} className="text-emerald-500 group-hover:-translate-x-1 transition-transform" />
            <span>Go back to Login</span>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
