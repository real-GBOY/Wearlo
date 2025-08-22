import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AuthForm } from '../../molecules/AuthForm/AuthForm';

interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
}

export const Auth: React.FC = () => {
  const [authType, setAuthType] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: AuthFormData) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log(`${authType} attempt:`, data);
    
    setLoading(false);
  };

  const toggleAuthType = () => {
    setAuthType(prev => prev === 'login' ? 'signup' : 'login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg p-8"
        >
          <AuthForm
            type={authType}
            onSubmit={handleSubmit}
            onToggleType={toggleAuthType}
            loading={loading}
          />
        </motion.div>
      </div>
    </div>
  );
};