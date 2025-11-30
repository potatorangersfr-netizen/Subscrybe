'use client';

import { Github } from 'lucide-react';
import { motion } from 'framer-motion';

export function GitHubLink() {
  return (
    <motion.a
      href="https://github.com/subscrybe/contracts"
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 left-6 z-40 bg-[#1E293B] border border-[#334155] rounded-full p-4 shadow-xl hover:border-[#0033AD] transition-colors group"
    >
      <div className="flex items-center gap-3">
        <Github className="h-6 w-6 text-[#F8FAFC] group-hover:text-[#0033AD] transition-colors" />
        <span className="text-sm font-medium text-[#F8FAFC] group-hover:text-[#0033AD] transition-colors pr-2">
          View on GitHub
        </span>
      </div>
    </motion.a>
  );
}
