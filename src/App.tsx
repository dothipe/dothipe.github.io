import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import MainDashboard from './components/MainDashboard';

export default function App() {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      <AnimatePresence mode="wait">
        <motion.div
          key="home-view"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          <MainDashboard />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
