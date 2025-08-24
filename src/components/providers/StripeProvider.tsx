import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY_TEST || 
  'pk_test_51RzjQfJ1OADMOJPDCfIwyHYZRGdzcjp4WKnlhE2Yu6z8GHbBt0w6ru3KhHrMd6T5Pnbsc2fPi2pxZQO8eHvD7E3100hab2AOt2'
);

interface StripeProviderProps {
  children: React.ReactNode;
}

export const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
};

