// components/FlowNextButton.tsx - Reusable button to complete flow steps
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheck } from 'react-icons/fi';
import { markStepComplete, getNextRoute } from '@/lib/flow';

interface FlowNextButtonProps {
  label?: string;
  onBeforeNext?: () => Promise<boolean> | boolean;
  className?: string;
  variant?: 'primary' | 'secondary' | 'success';
}

export default function FlowNextButton({
  label = 'Continue to Next Step',
  onBeforeNext,
  className = '',
  variant = 'primary'
}: FlowNextButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  const variantStyles = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white'
  };

  const handleNext = async () => {
    try {
      setLoading(true);

      // Run any pre-completion logic
      if (onBeforeNext) {
        const shouldContinue = await onBeforeNext();
        if (!shouldContinue) {
          setLoading(false);
          return;
        }
      }

      // Mark current step as complete
      const currentPath = pathname || '';
      await markStepComplete(currentPath, router);

      // Get next route and navigate
      const next = getNextRoute();
      if (next) {
        router.push(next);
      } else {
        // Flow complete
        router.push('/');
      }
    } catch (error) {
      console.error('Error completing step:', error);
      setLoading(false);
    }
  };

  return (
    <motion.button
      onClick={handleNext}
      disabled={loading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold
        transition-colors disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          <FiCheck size={20} />
          <span>{label}</span>
          <FiArrowRight size={20} />
        </>
      )}
    </motion.button>
  );
}
