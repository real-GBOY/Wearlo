/** @format */

export interface Product {
	id: string;
	name: string;
	price: number;
	description: string;
	images: string[];
	category: string;
	featured?: boolean;
}

export interface CartItem extends Product {
	quantity: number;
}

export type Theme = "light" | "dark";

// Dashboard-specific product type
export interface DashboardProduct extends Product {
	stock: number;
	lowStockThreshold: number;
	sku: string;
	status: "active" | "inactive" | "draft";
	createdAt: string;
	updatedAt: string;
}

// Address interface
export interface Address {
	street: string;
	city: string;
	state: string;
	zipCode: string;
	country: string;
}

// Order item interface
export interface OrderItem {
	productId: string;
	productName: string;
	quantity: number;
	price: number;
	subtotal: number;
}

// Order management
export interface Order {
	id: string;
	userId: string;
	customerName: string;
	customerEmail: string;
	items: OrderItem[];
	total: number;
	status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
	shippingAddress: Address;
	createdAt: string;
}

// User interface
export interface User {
	id: string;
	name: string;
	email: string;
	role: "admin" | "customer" | "moderator";
	avatar?: string;
	status: "active" | "inactive" | "suspended";
	createdAt: string;
	lastLogin?: string;
}

// Analytics data
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
}

// Notification interface
export interface Notification {
	id: string;
	title: string;
	message: string;
	type: "info" | "success" | "warning" | "error";
	read: boolean;
	createdAt: string;
}

// Category interface
export interface Category {
	id: string;
	name: string;
	description?: string;
	productCount: number;
	status: "active" | "inactive";
}

// Inventory history
export interface InventoryHistory {
	id: string;
	productId: string;
	productName: string;
	change: number;
	type: "in" | "out" | "adjustment";
	reason: string;
	date: string;
	userId: string;
}
