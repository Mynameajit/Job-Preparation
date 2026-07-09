import React from 'react';
import { motion } from 'framer-motion';

interface GlobalLoaderProps {
    message?: string;
}

export function GlobalLoader({ message = "Loading..." }: GlobalLoaderProps) {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-6"
            >
                {/* Logo container with pulsing glow */}
                <div className="relative">
                    <motion.div 
                        animate={{ 
                            boxShadow: ["0 0 0px 0px rgba(99, 102, 241, 0)", "0 0 20px 5px rgba(99, 102, 241, 0.4)", "0 0 0px 0px rgba(99, 102, 241, 0)"] 
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-2xl bg-indigo-500/20 blur-xl"
                    />
                    
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-r from-indigo-500 to-purple-500 shadow-2xl shadow-indigo-500/20 border border-white/10"
                    >
                        <span className="text-2xl font-bold text-white tracking-tighter">JP</span>
                    </motion.div>
                </div>

                {/* Progress line */}
                <div className="flex flex-col items-center gap-3">
                    <div className="w-32 h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            className="w-full h-full bg-linear-to-r from-indigo-500 to-purple-500 rounded-full"
                        />
                    </div>
                    <motion.p 
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-sm font-medium text-zinc-400"
                    >
                        {message}
                    </motion.p>
                </div>
            </motion.div>
        </div>
    );
}
