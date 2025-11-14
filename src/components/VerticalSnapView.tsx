'use client'

import { ReactNode } from 'react'

interface VerticalSnapViewProps {
  children: ReactNode
  className?: string
}

export default function VerticalSnapView({ children, className = '' }: VerticalSnapViewProps) {
  return (
    <div
      className={`snap-y snap-mandatory h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-700 ${className}`}
      style={{ scrollSnapType: 'y mandatory' }}
    >
      {children}
    </div>
  )
}

interface SnapItemProps {
  children: ReactNode
  className?: string
}

export function SnapItem({ children, className = '' }: SnapItemProps) {
  return (
    <div 
      className={`snap-start mb-6 ${className}`}
      style={{ scrollSnapAlign: 'start' }}
    >
      <div className="max-w-3xl mx-auto">
        {children}
      </div>
    </div>
  )
}
