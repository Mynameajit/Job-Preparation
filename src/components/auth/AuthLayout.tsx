'use client';

import React from 'react';
import { HackerAnimation } from './HackerAnimation';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen w-screen bg-[#050505] text-zinc-100 selection:bg-emerald-500/30 overflow-hidden font-sans">
      {/* Left Side: Animation (Hidden on small devices) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] h-full border-r border-zinc-900/50 overflow-hidden bg-black/20">
        <HackerAnimation />
      </div>

      {/* Right Side: Forms */}
      <div className="flex-1 flex flex-col items-center justify-center h-screen overflow-hidden relative">
        <div className="w-full max-w-xl h-full flex flex-col justify-center relative z-10 px-6 sm:px-12">
          <AnimatePresence mode="wait">
            <motion.div
              key="auth-form-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full p-8 lg:p-12 rounded-3xl"
            >
              {children}
            </motion.div>
          </AnimatePresence>

          <footer className="mt-10 text-center space-y-3">
            <div className="flex items-center justify-center gap-4 text-zinc-600">
              <div className="w-16 h-[1px] bg-zinc-900/50" />
              <p className="text-[10px] font-medium tracking-wider">Secure and Verified</p>
              <div className="w-16 h-[1px] bg-zinc-900/50" />
            </div>
            <p className="text-[9px] text-zinc-700 tracking-wide leading-relaxed">
              &copy; {new Date().getFullYear()} Job Preparation Portal. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};
