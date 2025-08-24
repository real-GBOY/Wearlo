// Stripe configuration
export const STRIPE_CONFIG = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY_TEST || 
    'pk_test_51RzjQfJ1OADMOJPDCfIwyHYZRGdzcjp4WKnlhE2Yu6z8GHbBt0w6ru3KhHrMd6T5Pnbsc2fPi2pxZQO8eHvD7E3100hab2AOt2',
  secretKey: import.meta.env.VITE_STRIPE_SECRET_KEY_TEST || 
    'sk_test_51RzjQfJ1OADMOJPDc3mWQZgF1j2tDn6OOU3PUkEZN7qBcs66xIBofIqztf35RZQf5AvA7Bl1jBSssOG48HyhKXfI0056HkqAyu',
  webhookSecret: import.meta.env.VITE_STRIPE_WEBHOOK_SECRET_TEST || 
    'whsec_your_webhook_secret',
  currency: 'egp',
  locale: 'en',
};

// Test card numbers for development
export const TEST_CARDS = {
  success: '4242424242424242',
  decline: '4000000000000002',
  insufficientFunds: '4000000000009995',
  expired: '4000000000000069',
  incorrectCvc: '4000000000000127',
};

// Stripe Elements appearance
export const STRIPE_ELEMENTS_APPEARANCE = {
  theme: 'stripe',
  variables: {
    colorPrimary: '#3b82f6',
    colorBackground: '#ffffff',
    colorText: '#1f2937',
    colorDanger: '#ef4444',
    fontFamily: 'Inter, system-ui, sans-serif',
    spacingUnit: '4px',
    borderRadius: '8px',
  },
};

