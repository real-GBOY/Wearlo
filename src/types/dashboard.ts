export interface DashboardProduct extends Product {
  stock: number;
  lowStockThreshold: number;
  sku: string;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  shippingAddress: Address;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'manager' | 'customer';
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: string;
}

export interface InventoryUpdate {
  id: string;
  productId: string;
  productName: string;
  previousStock: number;
  newStock: number;
  changeType: 'manual' | 'sale' | 'restock' | 'adjustment';
  reason: string;
  updatedBy: string;
  createdAt: string;
}

export interface Analytics {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  revenueGrowth: number;
  orderGrowth: number;
  topSellingProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
  salesByMonth: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
}

export interface Notification {
  id: string;
  type: 'low_stock' | 'new_order' | 'system' | 'user_activity';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: any;
}