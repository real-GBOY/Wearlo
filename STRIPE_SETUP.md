<!-- @format -->

# Stripe Integration Setup Guide

## Overview

This guide explains how to set up and use the Stripe payment integration in your Wearlo e-commerce application.

## Environment Variables Setup

### 1. Create Environment File

Create a `.env` file in your project root with the following variables:

```bash
# Stripe Test Keys (for development)
VITE_STRIPE_PUBLISHABLE_KEY_TEST=pk_test_51RzjQfJ1OADMOJPDCfIwyHYZRGdzcjp4WKnlhE2Yu6z8GHbBt0w6ru3KhHrMd6T5Pnbsc2fPi2pxZQO8eHvD7E3100hab2AOt2
VITE_STRIPE_SECRET_KEY_TEST=sk_test_51RzjQfJ1OADMOJPDc3mWQZgF1j2tDn6OOU3PUkEZN7qBcs66xIBofIqztf35RZQf5AvA7Bl1jBSssOG48HyhKXfI0056HkqAyu
VITE_STRIPE_WEBHOOK_SECRET_TEST=whsec_your_webhook_secret

# Stripe Live Keys (for production)
VITE_STRIPE_PUBLISHABLE_KEY_LIVE=pk_live_your_live_publishable_key
VITE_STRIPE_SECRET_KEY_LIVE=sk_live_your_live_secret_key
VITE_STRIPE_WEBHOOK_SECRET_LIVE=whsec_your_live_webhook_secret
```

### 2. Important Notes

- **Never commit your `.env` file to version control**
- The `VITE_` prefix is required for Vite to expose these variables to the client
- Use test keys for development and live keys for production
- Keep your secret keys secure and never expose them in client-side code

## Features Implemented

### 1. Stripe Payment Form

- Secure card input using Stripe Elements
- Real-time validation and error handling
- Responsive design with modern UI
- Integration with checkout flow

### 2. Order Management

- Cart integration with Stripe payments
- Order creation and tracking
- Payment confirmation flow
- Success/cancel handling
- **Inventory management with automatic stock reduction**

### 3. Security Features

- Client-side payment method creation
- Secure payment processing
- No sensitive data stored locally
- PCI compliance through Stripe

### 4. Inventory Management

- Real-time stock availability checking
- Automatic inventory reduction on order completion
- Inventory restoration on order cancellation
- Low stock alerts and warnings
- Stock validation before order placement

## Testing

### Test Card Numbers

Use these test card numbers for development:

- **Success**: `4242424242424242`
- **Decline**: `4000000000000002`
- **Insufficient Funds**: `4000000000009995`
- **Expired**: `4000000000000069`
- **Incorrect CVC**: `4000000000000127`

### Test CVC and Expiry

- **CVC**: Any 3 digits (e.g., `123`)
- **Expiry**: Any future date (e.g., `12/25`)

## Backend Integration

### 1. Payment Intent Creation

The current implementation simulates payment intents. In production, you'll need:

```typescript
// Backend API endpoint
POST /api/create-payment-intent
{
  "amount": 1000, // Amount in cents
  "currency": "egp",
  "metadata": {
    "orderId": "order_123",
    "customerEmail": "customer@example.com"
  }
}
```

### 2. Webhook Handling

Set up webhook endpoints to handle:

- Payment success/failure
- Order status updates
- Inventory management
- Customer notifications

### 3. Order Processing

Implement backend order management:

- Order creation and storage
- Inventory updates
- Email confirmations
- Shipping integration

### 4. Inventory Management API

Implement these endpoints for inventory control:

```typescript
// Check product stock
GET /api/products/:productId/stock
Response: { stock: number }

// Update product inventory
PATCH /api/products/:productId/inventory
Body: { operation: 'decrease' | 'increase', quantity: number }
Response: { success: boolean, oldStock: number, newStock: number, message: string }

// Bulk inventory update for orders
POST /api/products/inventory/bulk-update
Body: Array<{ productId: string, operation: 'decrease' | 'increase', quantity: number }>
Response: { success: boolean, updatedProducts: Array<{ productId: string, oldStock: number, newStock: number }>, errors: Array<{ productId: string, error: string }> }

// Get low stock alerts
GET /api/products/low-stock?threshold=10
Response: Array<{ productId: string, productName: string, currentStock: number, threshold: number }>
```

## File Structure

```
src/
├── components/
│   ├── molecules/
│   │   └── StripePaymentForm/
│   │       ├── StripePaymentForm.tsx
│   │       └── index.ts
│   └── providers/
│       └── StripeProvider.tsx
├── services/
│   ├── stripeService.ts
│   ├── inventoryService.ts
│   └── apiMocks.ts
├── config/
│   └── stripe.ts
├── contexts/
│   └── CartContext.tsx (updated)
└── screens/
    ├── CheckoutScreen/
    │   └── CheckoutScreen.tsx (updated)
    └── SuccessScreen/
        └── SuccessScreen.tsx (updated)
```

## Usage

### 1. Basic Integration

The Stripe integration is automatically available in your checkout flow:

1. User adds items to cart
2. Proceeds to checkout
3. **Stock availability is checked automatically**
4. Fills shipping information
5. Enters payment details using Stripe Elements
6. Payment is processed securely
7. **Inventory is automatically reduced from database**
8. Order is confirmed and cart is cleared

### 2. Inventory Management Workflow

The system now includes comprehensive inventory management:

1. **Pre-order validation**: Stock availability is checked before allowing checkout
2. **Real-time stock checking**: Users see current stock levels and warnings
3. **Automatic inventory reduction**: When order is completed, stock is reduced automatically
4. **Inventory restoration**: If order is cancelled, stock is restored
5. **Low stock alerts**: System tracks products with low inventory
6. **Transaction logging**: All inventory changes are logged for audit purposes

### 2. Customization

You can customize the payment form appearance by modifying:

- `src/config/stripe.ts` - Global Stripe configuration
- `src/components/molecules/StripePaymentForm/StripePaymentForm.tsx` - Form styling
- `src/services/stripeService.ts` - Payment logic

## Troubleshooting

### Common Issues

1. **Environment variables not loading**

   - Ensure `.env` file is in project root
   - Restart development server after changes
   - Check variable names start with `VITE_`

2. **Stripe Elements not rendering**

   - Verify publishable key is correct
   - Check browser console for errors
   - Ensure StripeProvider is wrapping the app

3. **Payment processing errors**
   - Use test card numbers for development
   - Check Stripe dashboard for error logs
   - Verify webhook endpoints are configured

### Support

- Stripe Documentation: https://stripe.com/docs
- Stripe Support: https://support.stripe.com
- React Stripe Elements: https://github.com/stripe/react-stripe-js

## Security Best Practices

1. **Never expose secret keys in client code**
2. **Always validate payments on the backend**
3. **Use HTTPS in production**
4. **Implement proper error handling**
5. **Set up webhook signature verification**
6. **Regular security audits**

## Next Steps

1. Set up backend payment intent creation
2. Implement webhook handling
3. Add order management system
4. Set up email notifications
5. Integrate with inventory system
6. Add analytics and reporting
