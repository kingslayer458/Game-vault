import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function HolographicOverlay() {
  const [scanLines, setScanLines] = useState<number[]>([]);

  useEffect(() => {
    const lines = Array.from({ length: 20 }, (_, i) => i * 5);
    setScanLines(lines);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-5 overflow-hidden">
      {/* Holographic Grid */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Scanning Lines */}
      {scanLines.map((line, index) => (
        <motion.div
          key={index}
          className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-30"
          style={{ top: `${line}%` }}
          animate={{
            y: ['0vh', '100vh'],
            opacity: [0, 0.6, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: index * 0.2,
            ease: 'linear'
          }}
        />
      ))}

      {/* Corner Brackets */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-blue-400 opacity-30" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-blue-400 opacity-30" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-blue-400 opacity-30" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-blue-400 opacity-30" />

      {/* Glitch Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"
        animate={{
          opacity: [0, 0.1, 0],
          scale: [1, 1.001, 1]
        }}
        transition={{
          duration: 0.1,
          repeat: Infinity,
          repeatDelay: Math.random() * 5 + 2
        }}
      />
    </div>
  );
}