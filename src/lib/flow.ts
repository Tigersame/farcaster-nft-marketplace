// lib/flow.ts - Flow management utility for guided page navigation
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import Cookies from 'js-cookie';

const FLOW_ORDER_KEY = 'flowOrder';
const FLOW_PROGRESS_KEY = 'flowProgress';

export interface FlowProgress {
  index: number;
  completed: string[];
}

export interface FlowStepDetail {
  route: string;
  progress: FlowProgress;
}

/**
 * Initialize the flow with an ordered array of routes
 */
export function setFlowOrder(orderArray: string[], options: { ttlDays?: number } = {}) {
  const { ttlDays = 1 } = options;
  
  Cookies.set(FLOW_ORDER_KEY, JSON.stringify(orderArray), { expires: ttlDays });
  
  // Initialize progress
  const init: FlowProgress = { index: 0, completed: [] };
  Cookies.set(FLOW_PROGRESS_KEY, JSON.stringify(init), { expires: ttlDays });
  
  // Fallback to localStorage
  try {
    localStorage.setItem(FLOW_ORDER_KEY, JSON.stringify(orderArray));
    localStorage.setItem(FLOW_PROGRESS_KEY, JSON.stringify(init));
  } catch (e) {
    console.warn('localStorage not available', e);
  }
}

/**
 * Get the flow order from cookies or localStorage
 */
export function getFlowOrder(): string[] | null {
  const fromCookie = Cookies.get(FLOW_ORDER_KEY);
  if (fromCookie) {
    try {
      return JSON.parse(fromCookie);
    } catch {
      return null;
    }
  }
  
  try {
    const fromStorage = localStorage.getItem(FLOW_ORDER_KEY);
    return fromStorage ? JSON.parse(fromStorage) : null;
  } catch {
    return null;
  }
}

/**
 * Get current progress
 */
export function getProgress(): FlowProgress {
  const fromCookie = Cookies.get(FLOW_PROGRESS_KEY);
  if (fromCookie) {
    try {
      return JSON.parse(fromCookie);
    } catch {
      return { index: 0, completed: [] };
    }
  }
  
  try {
    const fromStorage = localStorage.getItem(FLOW_PROGRESS_KEY);
    return fromStorage ? JSON.parse(fromStorage) : { index: 0, completed: [] };
  } catch {
    return { index: 0, completed: [] };
  }
}

/**
 * Save progress to cookies and localStorage
 */
export function saveProgress(progress: FlowProgress) {
  Cookies.set(FLOW_PROGRESS_KEY, JSON.stringify(progress));
  
  try {
    localStorage.setItem(FLOW_PROGRESS_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn('localStorage not available', e);
  }
}

/**
 * Fisher-Yates shuffle algorithm
 */
export function shuffle<T>(array: T[]): T[] {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Get the current required route based on progress
 */
export function currentRequiredRoute(): string | null {
  const order = getFlowOrder();
  const prog = getProgress();
  
  if (!order || order.length === 0) return null;
  if (prog.index >= order.length) return null;
  
  return order[prog.index];
}

/**
 * Mark a step as complete and advance progress
 */
export async function markStepComplete(route: string, router?: AppRouterInstance): Promise<FlowProgress> {
  const order = getFlowOrder() || [];
  const prog = getProgress();
  
  // Ensure route matches current required
  if (order[prog.index] !== route) {
    // Allow marking earlier steps as completed
    if (!prog.completed.includes(route)) {
      prog.completed.push(route);
    }
    saveProgress(prog);
    return prog;
  }
  
  // Mark and advance
  prog.completed = prog.completed || [];
  if (!prog.completed.includes(route)) {
    prog.completed.push(route);
  }
  prog.index = Math.min(order.length, prog.index + 1);
  saveProgress(prog);
  
  // Emit event for analytics
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent<FlowStepDetail>('flow:stepCompleted', {
        detail: { route, progress: prog }
      })
    );
    
    // Prefetch next route if router provided
    const next = order[prog.index];
    if (next && router) {
      router.prefetch(next);
    }
  }
  
  return prog;
}

/**
 * Get the next route in the flow
 */
export function getNextRoute(): string | null {
  const order = getFlowOrder();
  const prog = getProgress();
  
  if (!order || order.length === 0) return null;
  if (prog.index >= order.length) return null;
  
  return order[prog.index];
}

/**
 * Check if a route is accessible based on flow progress
 */
export function isRouteAccessible(route: string): boolean {
  const order = getFlowOrder();
  const prog = getProgress();
  
  if (!order) return true; // No flow configured, allow all
  
  const required = currentRequiredRoute();
  
  // Normalize paths for comparison
  const normalize = (path: string) => path.split('?')[0].split('#')[0];
  const normalizedRoute = normalize(route);
  const normalizedRequired = required ? normalize(required) : null;
  
  // Check if already completed
  const isCompleted = prog.completed.some(
    r => normalize(r) === normalizedRoute || normalizedRoute.startsWith(normalize(r).replace('[id]', '').replace('[address]', ''))
  );
  
  // Allow if it's the required route or already completed
  return normalizedRoute === normalizedRequired || isCompleted;
}

/**
 * Reset the flow (clear cookies and localStorage)
 */
export function resetFlow() {
  Cookies.remove(FLOW_ORDER_KEY);
  Cookies.remove(FLOW_PROGRESS_KEY);
  
  try {
    localStorage.removeItem(FLOW_ORDER_KEY);
    localStorage.removeItem(FLOW_PROGRESS_KEY);
  } catch (e) {
    console.warn('localStorage not available', e);
  }
}

/**
 * Get flow statistics
 */
export function getFlowStats() {
  const order = getFlowOrder();
  const prog = getProgress();
  
  if (!order) {
    return { total: 0, current: 0, completed: 0, percentage: 0 };
  }
  
  return {
    total: order.length,
    current: prog.index,
    completed: prog.completed.length,
    percentage: Math.round((prog.completed.length / order.length) * 100)
  };
}
