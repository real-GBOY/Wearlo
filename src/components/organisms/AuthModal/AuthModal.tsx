import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { AuthForm } from '../../molecules/AuthForm/AuthForm';
import { Icon } from '../../atoms/Icon/Icon';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: 'login' | 'signup';
}

interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialType = 'login'
}) => {
  const [authType, setAuthType] = useState<'login' | 'signup'>(initialType);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: AuthFormData) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log(`${authType} attempt:`, data);
    
    setLoading(false);
    onClose();
  };

  const toggleAuthType = () => {
    setAuthType(prev => prev === 'login' ? 'signup' : 'login');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-2xl w-full max-w-md mx-auto relative"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <Icon icon={X} size={20} />
              </button>

              {/* Form content */}
              <div className="p-8">
                <AuthForm
                  type={authType}
                  onSubmit={handleSubmit}
                  onToggleType={toggleAuthType}
                  loading={loading}
                />
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};