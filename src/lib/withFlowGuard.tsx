// lib/withFlowGuard.tsx - Higher-order component for flow route guarding
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, ComponentType } from 'react';
import { getFlowOrder, getProgress, currentRequiredRoute, isRouteAccessible } from './flow';

interface WithFlowGuardOptions {
  showLoader?: boolean;
  redirectToFront?: boolean;
}

export default function withFlowGuard<P extends object>(
  PageComponent: ComponentType<P>,
  options: WithFlowGuardOptions = {}
) {
  const { showLoader = true, redirectToFront = true } = options;

  return function GuardedPage(props: P) {
    const router = useRouter();
    const pathname = usePathname();
    const [checked, setChecked] = useState(false);
    const [isAllowed, setIsAllowed] = useState(false);

    useEffect(() => {
      const order = getFlowOrder();
      
      // No flow configured
      if (!order) {
        if (redirectToFront) {
          router.replace('/front');
          return;
        }
        setChecked(true);
        setIsAllowed(true);
        return;
      }

      const required = currentRequiredRoute();
      const currentPath = pathname || '';
      
      // Check if route is accessible
      const accessible = isRouteAccessible(currentPath);
      
      if (!accessible && required) {
        // Redirect to required route
        router.replace(required);
        return;
      }
      
      setIsAllowed(true);
      setChecked(true);
      
      // Prefetch next route
      const prog = getProgress();
      const next = order[prog.index];
      if (next && next !== currentPath) {
        router.prefetch(next);
      }
    }, [router, pathname]);

    if (!checked) {
      if (!showLoader) return null;
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      );
    }

    if (!isAllowed) return null;

    return <PageComponent {...props} />;
  };
}
