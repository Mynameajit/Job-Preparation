'use client';

import { motion } from 'framer-motion';
import { Shield, Cpu, Terminal, Lock, Code, Server, Zap } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const Orbit = ({ 
  radiusX, 
  radiusY, 
  duration, 
  reverse = false, 
  rotation = 0,
  children 
}: { 
  radiusX: number, 
  radiusY: number, 
  duration: number, 
  reverse?: boolean, 
  rotation?: number,
  children?: React.ReactNode 
}) => {
  return (
    <div 
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Elliptical Dashed Orbit Line */}
      <div 
        className="border border-dashed border-emerald-500/10 rounded-[50%]"
        style={{ width: radiusX * 2, height: radiusY * 2 }}
      />
      
      {/* Orbiting Container */}
      <motion.div
        className="absolute"
        animate={{ rotate: reverse ? -360 : 360 }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
        style={{ width: radiusX * 2, height: radiusY * 2 }}
      >
        <div 
          className="absolute"
          style={{ 
            top: 0, 
            left: '50%', 
            transform: `translate(-50%, -50%) rotate(${-rotation}deg)` 
          }}
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export const HackerAnimation = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const [randomStats, setRandomStats] = useState({ streams: [] as any[], mem: '0.824 TB' });

  useEffect(() => {
    setHasMounted(true);
    // Move all random generation to client-side only
    const streams = [...Array(10)].map((_, i) => ({
      x: `${i * 10}%`,
      duration: 5 + Math.random() * 10,
      delay: Math.random() * 5,
      content: Array(40).fill(0).map(() => Math.round(Math.random())).join('')
    }));
    setRandomStats({
      streams,
      mem: `${(Math.random() * 0.9).toFixed(3)} TB`
    });
  }, []);

  if (!hasMounted) {
    return <div className="relative w-full h-full bg-[#030303]" />;
  }

  return (
    <div className="relative w-full h-full bg-[#030303] text-zinc-100 overflow-hidden font-mono select-none">
      {/* Professional Hex Grid Background */}
      <div className="absolute inset-0 opacity-[0.05]" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='104' viewBox='0 0 60 104' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 17.32v34.64L30 69.28 0 51.96V17.32L30 0z' fill-rule='evenodd' fill='%2310b480' fill-opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: '30px 52px'
        }} 
      />

      {/* Dynamic Data Stream (Matrix-like but modern) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {randomStats.streams.map((stream, i) => (
          <motion.div
            key={i}
            className="absolute text-[8px] text-emerald-500/30 whitespace-nowrap"
            initial={{ y: -100, x: stream.x }}
            animate={{ y: 1000 }}
            transition={{ 
              duration: stream.duration, 
              repeat: Infinity, 
              ease: "linear",
              delay: stream.delay 
            }}
          >
            {stream.content}
          </motion.div>
        ))}
      </div>

      {/* Top Gradient Wash */}
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-emerald-500/[0.03] to-transparent pointer-events-none" />

      {/* TOP LEFT UI: System Node Telemetry */}
      <div className="absolute top-10 left-10">
        <motion.div 
          animate={{ x: [0, 1, -1, 0], opacity: [1, 0.8, 1] }} 
          transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 5 }}
          className="flex items-center gap-2 mb-1"
        >
          <div className="w-1 h-3 bg-emerald-500 shadow-[0_0_8px_#10b981]" />
          <p className="text-[10px] tracking-[0.4em] text-emerald-400 font-bold uppercase">Root_Entry</p>
        </motion.div>
        <div className="font-mono text-[9px] text-zinc-600 space-y-0.5">
          <p className="uppercase">State: <span className="text-emerald-500/60 font-bold">Encrypted</span></p>
          <p className="uppercase">Auth_Lvl: <span className="text-emerald-500/60 font-bold">Admin_Override</span></p>
        </div>
      </div>

      {/* TOP RIGHT UI: Performance Metrics */}
      <div className="absolute top-10 right-10 flex gap-4 text-right">
        <div>
          <p className="text-[8px] uppercase tracking-widest text-zinc-700 font-bold mb-0.5">CPU_LOAD</p>
          <div className="w-16 h-1 bg-zinc-900 rounded-full overflow-hidden">
             <motion.div 
               animate={{ width: ["20%", "45%", "30%"] }} 
               transition={{ duration: 3, repeat: Infinity }}
               className="h-full bg-emerald-500/50" 
             />
          </div>
        </div>
        <div>
          <p className="text-[8px] uppercase tracking-widest text-zinc-700 font-bold mb-0.5">MEM_ALLOC</p>
          <p className="text-[10px] text-emerald-500/40 font-bold">{randomStats.mem}</p>
        </div>
      </div>

      {/* CENTER SYSTEM: Variable Orbits & Digital Core */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Core: Advanced Digital Shield */}
        <div className="relative z-10 flex items-center justify-center">
          <motion.div 
            animate={{
              boxShadow: [
                "0 0 20px rgba(16, 185, 129, 0.05)",
                "0 0 50px rgba(16, 185, 129, 0.15)",
                "0 0 20px rgba(16, 185, 129, 0.05)"
              ]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="relative p-7 rounded-[2.5rem] bg-black/80 border border-emerald-500/20 backdrop-blur-3xl group"
          >
            {/* Animated Hex Border */}
            <div className="absolute inset-0 rounded-[2.5rem] border border-emerald-500/10 scale-[1.05] pointer-events-none" />
            
            <Cpu className="text-emerald-400" size={56} strokeWidth={1} />
            
            {/* Data Scan Line */}
            <motion.div 
              className="absolute left-6 right-6 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"
              animate={{ top: ["20%", "80%", "20%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </div>

        {/* Level 1: Dashed Security Orbit */}
        <Orbit radiusX={160} radiusY={150} duration={25} rotation={10}>
          <div className="p-3 rounded-2xl bg-zinc-950/80 border border-emerald-500/30 text-emerald-400 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <Shield size={20} />
          </div>
        </Orbit>

        {/* Level 2: Intercepting Code Path */}
        <Orbit radiusX={260} radiusY={280} duration={40} reverse rotation={-15}>
          <div className="flex flex-col items-center">
            <div className="p-3 rounded-2xl bg-zinc-950/80 border border-emerald-500/20 text-emerald-500/60 backdrop-blur-md">
              <Terminal size={20} />
            </div>
            {/* Trailing digital wire */}
            <div className="w-[1px] h-20 bg-gradient-to-b from-emerald-500/40 to-transparent" />
          </div>
        </Orbit>

        {/* Level 3: Network Integrity Ring */}
        <Orbit radiusX={360} radiusY={330} duration={55} rotation={5}>
           <div className="p-2.5 rounded-2xl bg-zinc-950/50 border border-emerald-500/10 text-emerald-700">
             <Code size={16} />
           </div>
        </Orbit>

        {/* Random Floating Particles */}
        {[...Array(5)].map((_, i) => (
          <Orbit key={i} radiusX={200 + i * 50} radiusY={180 + i * 40} duration={15 + i * 10} rotation={i * 72}>
             <motion.div 
               animate={{ opacity: [0.1, 0.4, 0.1] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="w-1 h-1 bg-emerald-500 rounded-full"
             />
          </Orbit>
        ))}
      </div>

      {/* BOTTOM LEFT UI: Branding & Log Console */}
      <div className="absolute bottom-12 left-10">
        <div className="flex items-center gap-2 mb-2">
           <Zap className="text-emerald-500 animate-pulse" size={14} />
           <p className="text-[10px] tracking-[0.4em] text-emerald-500/40 font-bold uppercase transition-all">Encrypted_Protocol</p>
        </div>
        
        <h1 className="text-xl font-black text-white leading-none tracking-widest mb-4 uppercase flex items-center gap-1">
          JOB PREP PORTAL
          <motion.span 
            animate={{ opacity: [1, 0, 1] }} 
            transition={{ duration: 0.8, repeat: Infinity }}
            className="w-1 h-5 bg-emerald-500 inline-block ml-1" 
          />
        </h1>
        
        <div className="font-mono text-[9px] text-zinc-600 bg-black/40 border-l border-emerald-500/30 pl-4 py-2 pr-6 rounded-r-lg">
          <div className="space-y-1">
             <p className="flex justify-between gap-6 uppercase"><span>Initializing...</span> <span className="text-emerald-500/60">[OK]</span></p>
             <p className="flex justify-between gap-6 uppercase"><span>Buffer_Link...</span> <span className="text-emerald-500/60">[STABLE]</span></p>
             <p className="flex justify-between gap-6 uppercase"><span>User_Handshake...</span> <span className="text-zinc-700">[PENDING]</span></p>
          </div>
        </div>
      </div>
            
      {/* BOTTOM RIGHT UI: Status Monitoring */}
      <div className="absolute bottom-12 right-10">
        <div className="px-5 py-3.5 rounded-2xl bg-black/40 border border-emerald-500/10 backdrop-blur-md flex items-center gap-4 group hover:border-emerald-500/30 transition-all">
          <div className="relative">
            <Server className="text-emerald-500/40" size={18} />
            <motion.div 
               className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full"
               animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
               transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
          <div className="font-mono">
            <p className="text-[8px] uppercase tracking-[0.2em] text-zinc-700 font-bold">Node_Status</p>
            <p className="text-[10px] font-bold text-zinc-400 tracking-widest">VERIFIED_SEC</p>
          </div>
        </div>
      </div>
    </div>
  );
};
