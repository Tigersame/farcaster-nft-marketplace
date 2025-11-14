"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setFlowOrder, shuffle } from '@/lib/flow';

// Define all pages in the flow (sequential order)
const ALL_PAGES = [
  '/front',
  '/',
  '/marketplace',
  '/collections',
  '/collection-pro',
  '/my-nfts',
  '/create',
  '/mint',
  '/swap',
  '/swap/settings'
];

export default function FrontPage() {
  const router = useRouter();

  useEffect(() => {
    // Automatically initialize random flow without user interaction
    const order = shuffle(ALL_PAGES);
    setFlowOrder(order, { ttlDays: 1 });
    
    // Navigate to first page immediately
    router.replace(order[0] || '/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}
