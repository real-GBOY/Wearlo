import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Lock, Calendar, User, MapPin } from 'lucide-react';
import { Input } from '../../atoms/Input/Input';
import { Select } from '../../atoms/Select/Select';
import { Button } from '../../atoms/Button/Button';
import { Card } from '../../atoms/Card/Card';
import { Typography } from '../../atoms/Typography/Typography';
import { Icon } from '../../atoms/Icon/Icon';

interface PaymentFormData {
  email: string;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  cardholderName: string;
  country: string;
  postalCode: string;
}

interface PaymentFormProps {
  onSubmit: (data: PaymentFormData) => void;
  loading?: boolean;
  total: number;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  onSubmit,
  loading = false,
  total
}) => {
  const [formData, setFormData] = useState<PaymentFormData>({
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardholderName: '',
    country: 'US',
    postalCode: ''
  });

  const [errors, setErrors] = useState<Partial<PaymentFormData>>({});
  const [cardType, setCardType] = useState<string>('');

  const countries = [
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'AU', label: 'Australia' }
  ];

  const detectCardType = (number: string) => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'visa';
    if (cleaned.startsWith('5') || cleaned.startsWith('2')) return 'mastercard';
    if (cleaned.startsWith('3')) return 'amex';
    return '';
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : cleaned;
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PaymentFormData> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.cardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (formData.cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    }

    if (!formData.cvc) {
      newErrors.cvc = 'CVC is required';
    } else if (formData.cvc.length < 3) {
      newErrors.cvc = 'Please enter a valid CVC';
    }

    if (!formData.cardholderName) {
      newErrors.cardholderName = 'Cardholder name is required';
    }

    if (!formData.postalCode) {
      newErrors.postalCode = 'Postal code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof PaymentFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let value = e.target.value;

    if (field === 'cardNumber') {
      value = formatCardNumber(value);
      setCardType(detectCardType(value));
      if (value.replace(/\s/g, '').length > 16) return;
    } else if (field === 'expiryDate') {
      value = formatExpiryDate(value);
      if (value.length > 5) return;
    } else if (field === 'cvc') {
      value = value.replace(/\D/g, '');
      if (value.length > 4) return;
    }

    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const getCardIcon = () => {
    switch (cardType) {
      case 'visa':
        return '💳';
      case 'mastercard':
        return '💳';
      case 'amex':
        return '💳';
      default:
        return <Icon icon={CreditCard} size={20} />;
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Payment Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="p-6 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <Typography variant="h4">Order Summary</Typography>
            <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
              <Icon icon={Lock} size={16} />
              <Typography variant="caption">Secure</Typography>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Typography variant="body">Subtotal</Typography>
              <Typography variant="body">${(total * 0.9).toFixed(2)}</Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="body">Shipping</Typography>
              <Typography variant="body">${(total * 0.1).toFixed(2)}</Typography>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
              <div className="flex justify-between">
                <Typography variant="h4">Total</Typography>
                <Typography variant="h4">${total.toFixed(2)}</Typography>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Payment Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="mb-6">
            <Typography variant="h3" className="mb-2">Payment Details</Typography>
            <Typography variant="body" className="text-gray-600 dark:text-gray-400">
              Enter your payment information to complete your order
            </Typography>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={errors.email}
              placeholder="john@example.com"
              leftIcon={<User size={20} />}
            />

            {/* Card Information */}
            <div className="space-y-4">
              <Typography variant="h4" className="flex items-center space-x-2">
                <Icon icon={CreditCard} size={20} />
                <span>Card Information</span>
              </Typography>

              <div className="relative">
                <Input
                  label="Card Number"
                  value={formData.cardNumber}
                  onChange={handleInputChange('cardNumber')}
                  error={errors.cardNumber}
                  placeholder="1234 1234 1234 1234"
                  rightIcon={getCardIcon()}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Expiry Date"
                  value={formData.expiryDate}
                  onChange={handleInputChange('expiryDate')}
                  error={errors.expiryDate}
                  placeholder="MM/YY"
                  leftIcon={<Calendar size={20} />}
                />
                <Input
                  label="CVC"
                  value={formData.cvc}
                  onChange={handleInputChange('cvc')}
                  error={errors.cvc}
                  placeholder="123"
                  leftIcon={<Lock size={20} />}
                />
              </div>
            </div>

            {/* Cardholder Information */}
            <div className="space-y-4">
              <Typography variant="h4" className="flex items-center space-x-2">
                <Icon icon={User} size={20} />
                <span>Cardholder Information</span>
              </Typography>

              <Input
                label="Cardholder Name"
                value={formData.cardholderName}
                onChange={handleInputChange('cardholderName')}
                error={errors.cardholderName}
                placeholder="John Doe"
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Country"
                  value={formData.country}
                  onChange={handleInputChange('country')}
                  options={countries}
                />
                <Input
                  label="Postal Code"
                  value={formData.postalCode}
                  onChange={handleInputChange('postalCode')}
                  error={errors.postalCode}
                  placeholder="12345"
                  leftIcon={<MapPin size={20} />}
                />
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Icon icon={Lock} size={16} className="text-blue-600 dark:text-blue-400" />
              <Typography variant="caption" className="text-blue-700 dark:text-blue-300">
                Your payment information is encrypted and secure
              </Typography>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                `Pay $${total.toFixed(2)}`
              )}
            </Button>
          </form>
        </Card>
      </motion.div>

      {/* Trust Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center space-y-2"
      >
        <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
          Powered by Stripe • 256-bit SSL encryption
        </Typography>
        <div className="flex justify-center space-x-4 text-2xl">
          <span>💳</span>
          <span>🔒</span>
          <span>✅</span>
        </div>
      </motion.div>
    </div>
  );
};