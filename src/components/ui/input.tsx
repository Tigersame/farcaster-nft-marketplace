"use client";

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`
        w-full px-3 py-2 rounded-lg
        border border-gray-300 dark:border-gray-700
        bg-white dark:bg-gray-800
        text-gray-900 dark:text-white
        placeholder:text-gray-500 dark:placeholder:text-gray-400
        focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
        transition-colors duration-200
        ${className}
      `}
      {...props}
    />
  );
}
