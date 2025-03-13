import { Gamepad2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function Preloader() {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center">
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="text-blue-500 dark:text-blue-400"
      >
        <Gamepad2 size={48} />
      </motion.div>
    </div>
  );
}