import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '../../atoms/Input/Input';
import { Button } from '../../atoms/Button/Button';
import { Typography } from '../../atoms/Typography/Typography';
import { Icon } from '../../atoms/Icon/Icon';

interface AuthFormProps {
  type: 'login' | 'signup';
  onSubmit: (data: AuthFormData) => void;
  onToggleType: () => void;
  loading?: boolean;
}

interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  type,
  onSubmit,
  onToggleType,
  loading = false
}) => {
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  
  const [errors, setErrors] = useState<Partial<AuthFormData>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<AuthFormData> = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Signup specific validations
    if (type === 'signup') {
      if (!formData.firstName) {
        newErrors.firstName = 'First name is required';
      }
      
      if (!formData.lastName) {
        newErrors.lastName = 'Last name is required';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof AuthFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <Typography variant="h2" className="mb-2">
          {type === 'login' ? 'WELCOME BACK' : 'CREATE ACCOUNT'}
        </Typography>
        <Typography variant="body" className="text-gray-600 dark:text-gray-400">
          {type === 'login' 
            ? 'Sign in to your account to continue' 
            : 'Join us and discover minimalist essentials'
          }
        </Typography>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {type === 'signup' && (
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              type="text"
              value={formData.firstName}
              onChange={handleInputChange('firstName')}
              error={errors.firstName}
              placeholder="John"
              variant="minimal"
            />
            <Input
              label="Last Name"
              type="text"
              value={formData.lastName}
              onChange={handleInputChange('lastName')}
              error={errors.lastName}
              placeholder="Doe"
              variant="minimal"
            />
          </div>
        )}

        <Input
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={handleInputChange('email')}
          error={errors.email}
          placeholder="john@example.com"
          variant="minimal"
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange('password')}
            error={errors.password}
            placeholder="••••••••"
            variant="minimal"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-8 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Icon icon={showPassword ? EyeOff : Eye} size={20} />
          </button>
        </div>

        {type === 'signup' && (
          <div className="relative">
            <Input
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              error={errors.confirmPassword}
              placeholder="••••••••"
              variant="minimal"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-0 top-8 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Icon icon={showConfirmPassword ? EyeOff : Eye} size={20} />
            </button>
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'PROCESSING...' : (type === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT')}
        </Button>

        <div className="text-center pt-4">
          <Typography variant="body" className="text-gray-600 dark:text-gray-400">
            {type === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={onToggleType}
              className="text-black dark:text-white hover:underline font-medium"
            >
              {type === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </Typography>
        </div>
      </form>
    </motion.div>
  );
};