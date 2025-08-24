import { loadStripe, Stripe } from '@stripe/stripe-js';
import inventoryService from './inventoryService';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY_TEST || 'pk_test_51RzjQfJ1OADMOJPDCfIwyHYZRGdzcjp4WKnlhE2Yu6z8GHbBt0w6ru3KhHrMd6T5Pnbsc2fPi2pxZQO8eHvD7E3100hab2AOt2');

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
}

export interface OrderData {
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  customerName: string;
  customerEmail: string;
}

export class StripeService {
  private static instance: StripeService;
  private stripe: Stripe | null = null;

  private constructor() {}

  public static getInstance(): StripeService {
    if (!StripeService.instance) {
      StripeService.instance = new StripeService();
    }
    return StripeService.instance;
  }

  async initialize(): Promise<Stripe | null> {
    if (!this.stripe) {
      this.stripe = await stripePromise;
    }
    return this.stripe;
  }

  async createPaymentIntent(orderData: OrderData): Promise<PaymentIntent> {
    try {
      // In a real app, this would call your backend API
      // For now, we'll simulate the API call
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(orderData.total * 100), // Convert to cents
          currency: 'egp',
          metadata: {
            orderId: `order_${Date.now()}`,
            customerEmail: orderData.customerEmail,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating payment intent:', error);
      // For demo purposes, return a mock payment intent
      return {
        id: `pi_${Date.now()}`,
        amount: Math.round(orderData.total * 100),
        currency: 'egp',
        status: 'requires_payment_method',
        client_secret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
      };
    }
  }

  async confirmPayment(clientSecret: string, paymentMethod: any): Promise<any> {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    return await this.stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod,
    });
  }

  async createPaymentMethod(cardElement: any): Promise<any> {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    return await this.stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });
  }

  // Mock function for demo purposes - in real app this would call your backend
  async processOrder(orderData: OrderData, paymentIntentId: string): Promise<any> {
    try {
      // First, check if products have sufficient stock
      const stockCheck = await inventoryService.checkStockAvailability(orderData.items);
      
      if (!stockCheck.available) {
        const insufficientItems = stockCheck.insufficientItems.map(item => 
          `${item.productName} (requested: ${item.requested}, available: ${item.available})`
        ).join(', ');
        
        throw new Error(`Insufficient stock for: ${insufficientItems}`);
      }

      // Simulate API call to your backend
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...orderData,
          paymentIntentId,
          status: 'pending',
          createdAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const order = await response.json();

      // Reduce inventory after successful order creation
      const inventoryResult = await inventoryService.reduceInventory(orderData.items);
      
      if (!inventoryResult.success) {
        console.warn('Order created but inventory update failed:', inventoryResult.message);
        // In a real app, you might want to rollback the order or retry inventory update
      } else {
        console.log('Inventory updated successfully:', inventoryResult.message);
        if (inventoryResult.updatedProducts) {
          console.log('Stock changes:', inventoryResult.updatedProducts);
        }
      }

      return order;
    } catch (error) {
      console.error('Error processing order:', error);
      // For demo purposes, return a mock order
      return {
        id: `order_${Date.now()}`,
        ...orderData,
        paymentIntentId,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
    }
  }

  /**
   * Cancel order and restore inventory
   */
  async cancelOrder(orderData: OrderData, orderId: string): Promise<{
    success: boolean;
    message: string;
    inventoryRestored?: boolean;
  }> {
    try {
      // In a real app, this would call your backend API to cancel the order
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'cancelled',
          cancelledAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }

      // Restore inventory after successful order cancellation
      const inventoryResult = await inventoryService.restoreInventory(orderData.items);
      
      if (!inventoryResult.success) {
        console.warn('Order cancelled but inventory restoration failed:', inventoryResult.message);
        return {
          success: true,
          message: 'Order cancelled but failed to restore inventory',
          inventoryRestored: false
        };
      } else {
        console.log('Inventory restored successfully:', inventoryResult.message);
        if (inventoryResult.updatedProducts) {
          console.log('Stock restored:', inventoryResult.updatedProducts);
        }
        return {
          success: true,
          message: 'Order cancelled and inventory restored successfully',
          inventoryRestored: true
        };
      }

    } catch (error) {
      console.error('Error cancelling order:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to cancel order',
        inventoryRestored: false
      };
    }
  }
}

export default StripeService.getInstance();

