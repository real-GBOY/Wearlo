/** @format */

import {
	DashboardProduct,
	Order,
	User,
	Analytics,
	Notification,
	Category,
	InventoryHistory,
} from "../types";

// Mock Categories
export const mockCategories: Category[] = [
	{
		id: "1",
		name: "Electronics",
		description: "Electronic devices and accessories",
		productCount: 45,
		status: "active",
	},
	{
		id: "2",
		name: "Clothing",
		description: "Fashion and apparel",
		productCount: 32,
		status: "active",
	},
	{
		id: "3",
		name: "Home & Garden",
		description: "Home improvement and gardening",
		productCount: 28,
		status: "active",
	},
	{
		id: "4",
		name: "Sports",
		description: "Sports equipment and gear",
		productCount: 19,
		status: "active",
	},
	{
		id: "5",
		name: "Books",
		description: "Books and publications",
		productCount: 67,
		status: "active",
	},
];

// Mock Dashboard Products
export const mockDashboardProducts: DashboardProduct[] = [
	{
		id: "1",
		name: "Wireless Bluetooth Headphones",
		price: 89.99,
		description: "High-quality wireless headphones with noise cancellation",
		images: [
			"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
		],
		category: "Electronics",
		featured: true,
		stock: 45,
		lowStockThreshold: 10,
		sku: "WH-001",
		status: "active",
		createdAt: "2024-01-15T10:00:00Z",
		updatedAt: "2024-01-20T14:30:00Z",
	},
	{
		id: "2",
		name: "Smart Fitness Watch",
		price: 199.99,
		description: "Advanced fitness tracking with heart rate monitor",
		images: [
			"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
		],
		category: "Electronics",
		featured: true,
		stock: 23,
		lowStockThreshold: 15,
		sku: "SFW-002",
		status: "active",
		createdAt: "2024-01-10T09:00:00Z",
		updatedAt: "2024-01-18T16:45:00Z",
	},
	{
		id: "3",
		name: "Organic Cotton T-Shirt",
		price: 29.99,
		description: "Comfortable organic cotton t-shirt in various colors",
		images: [
			"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
		],
		category: "Clothing",
		featured: false,
		stock: 8,
		lowStockThreshold: 10,
		sku: "OCT-003",
		status: "active",
		createdAt: "2024-01-12T11:00:00Z",
		updatedAt: "2024-01-19T13:20:00Z",
	},
	{
		id: "4",
		name: "Garden Tool Set",
		price: 79.99,
		description: "Complete set of essential gardening tools",
		images: [
			"https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
		],
		category: "Home & Garden",
		featured: false,
		stock: 12,
		lowStockThreshold: 8,
		sku: "GTS-004",
		status: "active",
		createdAt: "2024-01-08T08:00:00Z",
		updatedAt: "2024-01-17T15:10:00Z",
	},
	{
		id: "5",
		name: "Yoga Mat Premium",
		price: 49.99,
		description: "Non-slip yoga mat with carrying strap",
		images: ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400"],
		category: "Sports",
		featured: false,
		stock: 35,
		lowStockThreshold: 12,
		sku: "YM-005",
		status: "active",
		createdAt: "2024-01-14T12:00:00Z",
		updatedAt: "2024-01-21T10:15:00Z",
	},
	{
		id: "6",
		name: "Programming Fundamentals Book",
		price: 39.99,
		description: "Comprehensive guide to programming basics",
		images: [
			"https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
		],
		category: "Books",
		featured: false,
		stock: 0,
		lowStockThreshold: 5,
		sku: "PFB-006",
		status: "inactive",
		createdAt: "2024-01-05T07:00:00Z",
		updatedAt: "2024-01-16T11:30:00Z",
	},
];

// Mock Orders
export const mockOrders: Order[] = [
	{
		id: "ORD-001",
		userId: "user-1",
		customerName: "John Smith",
		customerEmail: "john.smith@email.com",
		items: [
			{
				productId: "1",
				productName: "Wireless Bluetooth Headphones",
				quantity: 1,
				price: 89.99,
				subtotal: 89.99,
			},
			{
				productId: "3",
				productName: "Organic Cotton T-Shirt",
				quantity: 2,
				price: 29.99,
				subtotal: 59.98,
			},
		],
		total: 149.97,
		status: "delivered",
		shippingAddress: {
			street: "123 Main St",
			city: "New York",
			state: "NY",
			zipCode: "10001",
			country: "USA",
		},
		createdAt: "2024-01-20T09:00:00Z",
	},
	{
		id: "ORD-002",
		userId: "user-2",
		customerName: "Sarah Johnson",
		customerEmail: "sarah.j@email.com",
		items: [
			{
				productId: "2",
				productName: "Smart Fitness Watch",
				quantity: 1,
				price: 199.99,
				subtotal: 199.99,
			},
		],
		total: 199.99,
		status: "shipped",
		shippingAddress: {
			street: "456 Oak Ave",
			city: "Los Angeles",
			state: "CA",
			zipCode: "90210",
			country: "USA",
		},
		createdAt: "2024-01-19T14:30:00Z",
	},
	{
		id: "ORD-003",
		userId: "user-3",
		customerName: "Mike Wilson",
		customerEmail: "mike.w@email.com",
		items: [
			{
				productId: "4",
				productName: "Garden Tool Set",
				quantity: 1,
				price: 79.99,
				subtotal: 79.99,
			},
			{
				productId: "5",
				productName: "Yoga Mat Premium",
				quantity: 1,
				price: 49.99,
				subtotal: 49.99,
			},
		],
		total: 129.98,
		status: "processing",
		shippingAddress: {
			street: "789 Pine St",
			city: "Chicago",
			state: "IL",
			zipCode: "60601",
			country: "USA",
		},
		createdAt: "2024-01-21T11:15:00Z",
	},
	{
		id: "ORD-004",
		userId: "user-4",
		customerName: "Emily Davis",
		customerEmail: "emily.d@email.com",
		items: [
			{
				productId: "1",
				productName: "Wireless Bluetooth Headphones",
				quantity: 1,
				price: 89.99,
				subtotal: 89.99,
			},
		],
		total: 89.99,
		status: "pending",
		shippingAddress: {
			street: "321 Elm St",
			city: "Miami",
			state: "FL",
			zipCode: "33101",
			country: "USA",
		},
		createdAt: "2024-01-22T08:45:00Z",
	},
];

// Mock Users
export const mockUsers: User[] = [
	{
		id: "user-1",
		name: "John Smith",
		email: "john.smith@email.com",
		role: "customer",
		avatar:
			"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
		status: "active",
		createdAt: "2024-01-01T00:00:00Z",
		lastLogin: "2024-01-22T10:30:00Z",
	},
	{
		id: "user-2",
		name: "Sarah Johnson",
		email: "sarah.j@email.com",
		role: "customer",
		avatar:
			"https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100",
		status: "active",
		createdAt: "2024-01-02T00:00:00Z",
		lastLogin: "2024-01-21T15:45:00Z",
	},
	{
		id: "user-3",
		name: "Mike Wilson",
		email: "mike.w@email.com",
		role: "customer",
		avatar:
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
		status: "active",
		createdAt: "2024-01-03T00:00:00Z",
		lastLogin: "2024-01-22T09:15:00Z",
	},
	{
		id: "admin-1",
		name: "Admin User",
		email: "admin@wearlo.com",
		role: "admin",
		avatar:
			"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
		status: "active",
		createdAt: "2024-01-01T00:00:00Z",
		lastLogin: "2024-01-22T11:00:00Z",
	},
	{
		id: "mod-1",
		name: "Moderator User",
		email: "moderator@wearlo.com",
		role: "moderator",
		avatar:
			"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
		status: "active",
		createdAt: "2024-01-05T00:00:00Z",
		lastLogin: "2024-01-21T16:30:00Z",
	},
];

// Mock Analytics
export const mockAnalytics: Analytics = {
	totalRevenue: 12589.93,
	totalOrders: 156,
	totalProducts: 89,
	totalUsers: 234,
	revenueGrowth: 12.5,
	orderGrowth: 8.3,
	topSellingProducts: [
		{
			id: "1",
			name: "Wireless Bluetooth Headphones",
			sales: 45,
			revenue: 4049.55,
		},
		{ id: "2", name: "Smart Fitness Watch", sales: 32, revenue: 6399.68 },
		{ id: "3", name: "Organic Cotton T-Shirt", sales: 67, revenue: 2009.33 },
		{ id: "4", name: "Garden Tool Set", sales: 18, revenue: 1439.82 },
		{ id: "5", name: "Yoga Mat Premium", sales: 29, revenue: 1449.71 },
	],
};

// Mock Notifications
export const mockNotifications: Notification[] = [
	{
		id: "notif-1",
		title: "Low Stock Alert",
		message: "Organic Cotton T-Shirt is running low on stock (8 remaining)",
		type: "warning",
		read: false,
		createdAt: "2024-01-22T10:00:00Z",
	},
	{
		id: "notif-2",
		title: "New Order Received",
		message: "Order ORD-004 has been placed by Emily Davis",
		type: "info",
		read: false,
		createdAt: "2024-01-22T08:45:00Z",
	},
	{
		id: "notif-3",
		title: "Product Out of Stock",
		message: "Programming Fundamentals Book is now out of stock",
		type: "error",
		read: true,
		createdAt: "2024-01-16T11:30:00Z",
	},
	{
		id: "notif-4",
		title: "Revenue Milestone",
		message: "Monthly revenue target achieved! EGP 12,589.93",
		type: "success",
		read: true,
		createdAt: "2024-01-21T23:59:00Z",
	},
];

// Mock Inventory History
export const mockInventoryHistory: InventoryHistory[] = [
	{
		id: "inv-1",
		productId: "3",
		productName: "Organic Cotton T-Shirt",
		change: -2,
		type: "out",
		reason: "Order fulfillment",
		date: "2024-01-22T08:45:00Z",
		userId: "user-4",
	},
	{
		id: "inv-2",
		productId: "4",
		productName: "Garden Tool Set",
		change: -1,
		type: "out",
		reason: "Order fulfillment",
		date: "2024-01-21T11:15:00Z",
		userId: "user-3",
	},
	{
		id: "inv-3",
		productId: "1",
		productName: "Wireless Bluetooth Headphones",
		change: 50,
		type: "in",
		reason: "Restock shipment",
		date: "2024-01-20T14:30:00Z",
		userId: "admin-1",
	},
	{
		id: "inv-4",
		productId: "6",
		productName: "Programming Fundamentals Book",
		change: -5,
		type: "adjustment",
		reason: "Damaged inventory write-off",
		date: "2024-01-16T11:30:00Z",
		userId: "admin-1",
	},
];
