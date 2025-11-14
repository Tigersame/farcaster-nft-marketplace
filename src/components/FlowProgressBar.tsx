// components/FlowProgressBar.tsx - Visual progress indicator for flow
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getFlowOrder, getProgress, getFlowStats } from '@/lib/flow';
import { FiCheck, FiCircle } from 'react-icons/fi';

export default function FlowProgressBar() {
  const [stats, setStats] = useState({ total: 0, current: 0, completed: 0, percentage: 0 });
  const [order, setOrder] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    updateProgress();

    // Listen for flow completion events
    const handleStepComplete = () => {
      updateProgress();
    };

    window.addEventListener('flow:stepCompleted', handleStepComplete);
    return () => window.removeEventListener('flow:stepCompleted', handleStepComplete);
  }, []);

  const updateProgress = () => {
    const newStats = getFlowStats();
    const flowOrder = getFlowOrder();
    setStats(newStats);
    if (flowOrder) setOrder(flowOrder);
  };

  if (!mounted || stats.total === 0) return null;

  const progress = getProgress();
  const getStepName = (path: string) => {
    const names: Record<string, string> = {
      '/front': 'Start',
      '/': 'Home',
      '/marketplace': 'Marketplace',
      '/collections': 'Collections',
      '/collection-pro': 'Collection Pro',
      '/my-nfts': 'My NFTs',
      '/create': 'Create',
      '/mint': 'Mint',
      '/swap': 'Swap',
      '/swap/settings': 'Settings'
    };
    return names[path] || path.split('/').pop() || 'Step';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700"
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Guided Tour Progress
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {stats.completed} of {stats.total} completed ({stats.percentage}%)
          </span>
        </div>

        {/* Progress bar */}
        <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-600"
            initial={{ width: 0 }}
            animate={{ width: `${stats.percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {order.map((route, index) => {
            const isCompleted = progress.completed.includes(route);
            const isCurrent = index === progress.index;

            return (
              <div
                key={route}
                className="flex items-center gap-2 flex-shrink-0"
              >
                <div className="flex items-center gap-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isCurrent
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {isCompleted ? <FiCheck size={14} /> : <FiCircle size={8} />}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      isCurrent
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : isCompleted
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {getStepName(route)}
                  </span>
                </div>
                {index < order.length - 1 && (
                  <div className="w-4 h-px bg-gray-300 dark:bg-gray-600" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
