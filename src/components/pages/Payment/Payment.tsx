import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle, CreditCard } from 'lucide-react';
import { PaymentForm } from '../../molecules/PaymentForm/PaymentForm';
import { Button } from '../../atoms/Button/Button';
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

export const Payment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Get total from location state or default to 99.99
  const total = location.state?.total || 99.99;
  const productName = location.state?.productName || 'Your Order';

  const handlePaymentSubmit = async (data: PaymentFormData) => {
    setLoading(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('Payment submitted:', data);
    console.log('Total amount:', total);
    
    setLoading(false);
    setPaymentSuccess(true);
    
    // Redirect to success page after 2 seconds
    setTimeout(() => {
      navigate('/', { replace: true });
    }, 2000);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="text-center space-y-6 max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center"
          >
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <Typography variant="h2">Payment Successful!</Typography>
            <Typography variant="body" className="text-gray-600 dark:text-gray-400">
              Thank you for your purchase of {productName}. Your order has been confirmed and you will receive an email confirmation shortly.
            </Typography>
            <Typography variant="body" className="font-semibold">
              Amount Paid: ${total.toFixed(2)}
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            Redirecting to home page...
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="flex items-center space-x-2 mb-6"
          >
            <Icon icon={ArrowLeft} size={16} />
            <span>Back</span>
          </Button>
          
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Icon icon={CreditCard} size={24} />
              <Typography variant="h2">Secure Checkout</Typography>
            </div>
            <Typography variant="body" className="text-gray-600 dark:text-gray-400">
              Complete your purchase securely with our encrypted payment system
            </Typography>
          </div>
        </motion.div>

        {/* Payment Form */}
        <PaymentForm
          onSubmit={handlePaymentSubmit}
          loading={loading}
          total={total}
        />

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
            This is a demo payment form. No real transactions will be processed.
          </Typography>
        </motion.div>
      </div>
    </div>
  );
};