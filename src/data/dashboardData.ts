import { DashboardProduct, Category, Order, User, InventoryUpdate, Analytics, Notification } from '../types/dashboard';

export const dashboardProducts: DashboardProduct[] = [
  {
    id: '1',
    name: 'Essential White Tee',
    price: 29.99,
    description: 'A timeless essential crafted from premium cotton.',
    images: [
      'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'basics',
    featured: true,
    stock: 45,
    lowStockThreshold: 10,
    sku: 'EWT-001',
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:22:00Z'
  },
  {
    id: '2',
    name: 'Black Minimalist Jacket',
    price: 149.99,
    description: 'Sophisticated outerwear designed for the modern individual.',
    images: [
      'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'outerwear',
    featured: true,
    stock: 8,
    lowStockThreshold: 10,
    sku: 'BMJ-002',
    status: 'active',
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-22T11:45:00Z'
  },
  {
    id: '3',
    name: 'Grey Urban Hoodie',
    price: 79.99,
    description: 'Contemporary comfort meets urban design.',
    images: [
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'casual',
    featured: true,
    stock: 23,
    lowStockThreshold: 15,
    sku: 'GUH-003',
    status: 'active',
    createdAt: '2024-01-12T16:20:00Z',
    updatedAt: '2024-01-21T13:10:00Z'
  }
];

export const categories: Category[] = [
  {
    id: '1',
    name: 'Basics',
    description: 'Essential wardrobe staples',
    productCount: 12,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Outerwear',
    description: 'Jackets, coats, and outer layers',
    productCount: 8,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T09:15:00Z'
  },
  {
    id: '3',
    name: 'Casual',
    description: 'Comfortable everyday wear',
    productCount: 15,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-12T16:20:00Z'
  },
  {
    id: '4',
    name: 'Footwear',
    description: 'Shoes and sneakers',
    productCount: 6,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-08T12:00:00Z'
  }
];

export const orders: Order[] = [
  {
    id: 'ORD-001',
    userId: 'user-1',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    items: [
      {
        productId: '1',
        productName: 'Essential White Tee',
        quantity: 2,
        price: 29.99,
        total: 59.98
      }
    ],
    total: 59.98,
    status: 'processing',
    createdAt: '2024-01-22T10:30:00Z',
    updatedAt: '2024-01-22T10:30:00Z',
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    }
  },
  {
    id: 'ORD-002',
    userId: 'user-2',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    items: [
      {
        productId: '2',
        productName: 'Black Minimalist Jacket',
        quantity: 1,
        price: 149.99,
        total: 149.99
      }
    ],
    total: 149.99,
    status: 'shipped',
    createdAt: '2024-01-21T14:15:00Z',
    updatedAt: '2024-01-22T09:20:00Z',
    shippingAddress: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    }
  }
];

export const users: User[] = [
  {
    id: 'user-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    role: 'customer',
    status: 'active',
    lastLogin: '2024-01-22T08:30:00Z',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'user-2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    role: 'customer',
    status: 'active',
    lastLogin: '2024-01-21T16:45:00Z',
    createdAt: '2024-01-10T14:20:00Z'
  },
  {
    id: 'admin-1',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@minimal.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-01-22T12:00:00Z',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export const inventoryUpdates: InventoryUpdate[] = [
  {
    id: 'inv-1',
    productId: '2',
    productName: 'Black Minimalist Jacket',
    previousStock: 10,
    newStock: 8,
    changeType: 'sale',
    reason: 'Order ORD-002 fulfilled',
    updatedBy: 'system',
    createdAt: '2024-01-22T09:20:00Z'
  },
  {
    id: 'inv-2',
    productId: '1',
    productName: 'Essential White Tee',
    previousStock: 47,
    newStock: 45,
    changeType: 'sale',
    reason: 'Order ORD-001 fulfilled',
    updatedBy: 'system',
    createdAt: '2024-01-22T10:30:00Z'
  }
];

export const analytics: Analytics = {
  totalRevenue: 12450.67,
  totalOrders: 156,
  totalProducts: 41,
  totalUsers: 1247,
  revenueGrowth: 12.5,
  orderGrowth: 8.3,
  topSellingProducts: [
    { id: '1', name: 'Essential White Tee', sales: 45, revenue: 1349.55 },
    { id: '3', name: 'Grey Urban Hoodie', sales: 32, revenue: 2559.68 },
    { id: '2', name: 'Black Minimalist Jacket', sales: 18, revenue: 2699.82 }
  ],
  salesByMonth: [
    { month: 'Jan', revenue: 8450.32, orders: 89 },
    { month: 'Feb', revenue: 9234.56, orders: 102 },
    { month: 'Mar', revenue: 12450.67, orders: 156 }
  ]
};

export const notifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'low_stock',
    title: 'Low Stock Alert',
    message: 'Black Minimalist Jacket is running low (8 units remaining)',
    isRead: false,
    createdAt: '2024-01-22T09:20:00Z',
    data: { productId: '2', currentStock: 8, threshold: 10 }
  },
  {
    id: 'notif-2',
    type: 'new_order',
    title: 'New Order Received',
    message: 'Order ORD-001 from John Doe ($59.98)',
    isRead: false,
    createdAt: '2024-01-22T10:30:00Z',
    data: { orderId: 'ORD-001', amount: 59.98 }
  },
  {
    id: 'notif-3',
    type: 'system',
    title: 'System Update',
    message: 'Dashboard analytics have been updated',
    isRead: true,
    createdAt: '2024-01-22T08:00:00Z'
  }
];