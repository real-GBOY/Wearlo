/** @format */

export interface ProductSize {
	label: string;
	stock: number;
}

export interface Product {
	_id: string;
	id: string; // For DataTable compatibility
	name: string;
	description: string;
	price: number;
	discount?: number;
	stock: number;
	category:
		| string
		| { _id: string; name: string; description?: string; image?: string }; // This can be category ID or full category object
	categoryName?: string; // This will be the category name for display
	sizes: StockSize[];
	images: string[];
	createdAt: string;
	updatedAt?: string;
	__v?: number;
	featured?: boolean;
	lowStockThreshold?: number; // Added for stock management
	sku?: string; // Added for inventory tracking
	status?: "active" | "inactive" | "draft"; // Added for product status
}

export interface CartItem extends Product {
	quantity: number;
}

// Dashboard-specific product type
export interface DashboardProduct extends Product {
	lowStockThreshold: number;
	sku: string;
	status: "active" | "inactive" | "draft";
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
	_id: string;
	id: string; // For DataTable compatibility
	name: string;
	description: string;
	image?: string;
	productCount?: number;
	status?: "active" | "inactive";
	createdAt: string;
	updatedAt?: string;
	__v?: number;
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

// Enhanced stock management types
export interface StockSize {
	label: string;
	stock: number;
	measurements?: {
		chest?: number;
		length?: number;
		sleeve?: number;
		waist?: number;
	};
}

export interface StockOverview {
	productId: string;
	name: string;
	category: string;
	totalStock: number;
	sizeStock: StockSize[];
	stockStatus: "In Stock" | "Out of Stock" | "Low Stock";
	lowStock: boolean;
	lastUpdated: string;
}

export interface StockAlert {
	productId: string;
	name: string;
	category: string;
	totalStock: number;
	lowStockSizes: StockSize[];
	alertLevel: "Out of Stock" | "Low Stock";
	threshold: number;
}

export interface StockAvailabilityRequest {
	items: {
		productId: string;
		size?: string;
		quantity: number;
	}[];
}

export interface StockAvailabilityResponse {
	allAvailable: boolean;
	items: {
		productId: string;
		productName: string;
		size: string;
		requestedQuantity: number;
		availableStock: number;
		stockSource: string;
		available: boolean;
		shortfall: number;
	}[];
	canPlaceOrder: boolean;
	message: string;
}

export interface StockUpdateRequest {
	stock: number;
	operation: "add" | "subtract" | "set";
	reason?: string;
	size?: string;
}

export interface StockHistory {
	id: string;
	productId: string;
	productName: string;
	change: number;
	type: "in" | "out" | "adjustment";
	reason: string;
	date: string;
	userId: string;
	size?: string;
	oldStock: number;
	newStock: number;
}

export interface StockStats {
	totalProducts: number;
	inStock: number;
	outOfStock: number;
	lowStock: number;
	totalValue: number;
	lowStockThreshold: number;
}
