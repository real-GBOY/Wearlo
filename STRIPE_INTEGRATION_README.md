<!-- @format -->

# Stripe Integration Guide

This guide explains how to use the Stripe payment integration in your React app.

## 🚀 What's Been Implemented

### 1. Stripe Client SDK Installation

- ✅ `@stripe/stripe-js` package installed
- ✅ Test mode publishable key configured

### 2. CheckoutButton Component

- ✅ Reusable checkout button component
- ✅ Integrates with your backend API
- ✅ Handles Stripe Checkout redirect
- ✅ Loading states and error handling

### 3. Success & Cancel Pages

- ✅ `/payment/success` - Payment successful page
- ✅ `/payment/cancel` - Payment cancelled page
- ✅ Beautiful UI with navigation options

### 4. Demo Component

- ✅ `CheckoutDemo` component showing usage examples
- ✅ Multiple product examples

## 📍 File Locations

```
src/
├── components/
│   ├── atoms/
│   │   └── CheckoutButton/
│   │       ├── CheckoutButton.tsx
│   │       └── index.ts
│   └── molecules/
│       └── CheckoutDemo/
│           ├── CheckoutDemo.tsx
│           └── index.ts
├── screens/
│   ├── SuccessScreen/
│   │   ├── SuccessScreen.tsx
│   │   └── index.ts
│   └── CancelScreen/
│       ├── CancelScreen.tsx
│       └── index.ts
└── App.tsx (updated with new routes)
```

## 🔑 Configuration

### Stripe Test Key

The component is configured with your test publishable key:

```
pk_test_51RzjQfJ1OADMOJPDCfIwyHYZRGdzcjp4WKnlhE2Yu6z8GHbBt0w6ru3KhHrMd6T5Pnbsc2fPi2pxZQO8eHvD7E3100hab2AOt2
```

### Backend API Endpoint

The component calls your backend at:

```
http://localhost:5000/api/payment/create-checkout-session
```

## 💻 How to Use

### Basic Usage

```tsx
import { CheckoutButton } from "./components/atoms/CheckoutButton";

<CheckoutButton
	product={{
		name: "Handmade Bracelet",
		price: 20,
		quantity: 1,
	}}
/>;
```

### Custom Button Text

```tsx
<CheckoutButton
	product={{ name: "Premium Watch", price: 150, quantity: 1 }}
	className='w-full bg-green-600'>
	Buy This Watch Now!
</CheckoutButton>
```

### Custom Styling

```tsx
<CheckoutButton
	product={{ name: "Designer Ring", price: 89, quantity: 2 }}
	className='px-8 py-4 bg-purple-600 hover:bg-purple-700'>
	Add to Cart - ${89}
</CheckoutButton>
```

## 🎯 Product Interface

The `product` prop expects this structure:

```tsx
interface Product {
	name: string; // Product name
	price: number; // Price in dollars
	quantity: number; // Quantity to purchase
}
```

## 🔄 How It Works

1. **User clicks CheckoutButton**
2. **Component calls your backend API** with product details
3. **Backend creates Stripe checkout session** and returns `sessionId`
4. **Frontend redirects to Stripe Checkout** using the `sessionId`
5. **User completes payment** on Stripe's hosted page
6. **Stripe redirects back** to your success/cancel page

## 🛣️ Routes Added

- `/payment/success` - Payment successful page
- `/payment/cancel` - Payment cancelled page

## 🧪 Testing

### Test Card Numbers

Use these Stripe test card numbers:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

### Test Mode

- All payments are in test mode
- No real charges will be made
- Use any future expiry date and any 3-digit CVC

## 🚨 Important Notes

1. **Backend Required**: You need to implement the backend endpoint that creates Stripe checkout sessions
2. **Success/Cancel URLs**: Configure your Stripe dashboard to redirect to `/payment/success` and `/payment/cancel`
3. **Environment Variables**: In production, move the Stripe key to environment variables
4. **Error Handling**: The component includes basic error handling with user-friendly alerts

## 🔧 Backend Requirements

Your backend needs to:

1. Accept POST requests to `/api/payment/create-checkout-session`
2. Expect `{ name, price, quantity }` in request body
3. Create a Stripe checkout session
4. Return `{ sessionId: "cs_..." }` in response

## 📱 Demo Component

Use the `CheckoutDemo` component to see examples:

```tsx
import { CheckoutDemo } from "./components/molecules/CheckoutDemo";

// In your page/screen
<CheckoutDemo />;
```

This will show multiple product examples with checkout buttons.

## 🎨 Customization

### Styling

The component uses Tailwind CSS classes. You can override them with the `className` prop.

### Error Messages

Currently shows basic alerts. You can customize by modifying the error handling in `CheckoutButton.tsx`.

### Loading States

The button shows "Processing..." during checkout. Customize the loading text in the component.

## 🚀 Next Steps

1. **Test the integration** with the demo component
2. **Implement your backend endpoint** for creating checkout sessions
3. **Configure Stripe webhooks** for order fulfillment
4. **Add order management** to your app
5. **Move to production** by updating the Stripe key and backend URL

## ❓ Troubleshooting

### Common Issues

- **"Failed to create checkout session"**: Check your backend is running and the endpoint is correct
- **"Checkout failed"**: Verify your Stripe key is correct and in test mode
- **Route not found**: Ensure the success/cancel routes are added to your App.tsx

### Debug Mode

Check the browser console for detailed error messages during checkout.

---

Happy coding! 🎉
