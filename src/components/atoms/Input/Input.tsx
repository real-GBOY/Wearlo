import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: 'default' | 'minimal';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  variant = 'default',
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'w-full transition-all duration-200 focus:outline-none';
  
  const variantClasses = {
    default: 'px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-black dark:text-white focus:border-black dark:focus:border-white',
    minimal: 'px-0 py-3 border-0 border-b-2 border-gray-300 dark:border-gray-600 bg-transparent text-black dark:text-white focus:border-black dark:focus:border-white'
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <motion.input
        ref={ref}
        whileFocus={{ scale: 1.01 }}
        className={`${baseClasses} ${variantClasses[variant]} ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';