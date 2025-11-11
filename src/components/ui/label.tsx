"use client";

import React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export function Label({ className = '', children, ...props }: LabelProps) {
  return (
    <label
      className={`
        block text-sm font-medium
        text-gray-700 dark:text-gray-300
        mb-1
        ${className}
      `}
      {...props}
    >
      {children}
    </label>
  );
}
