/** @format */

const endPoints = {
	// Authentication endpoints
	auth: {
		register: "/auth/register",
		login: "/auth/login",
		refresh: "/auth/refresh",
		logout: "/auth/logout",
	},

	// Product endpoints
	products: {
		create: "/products",
		getAll: "/products",
		getById: (id: string) => `/products/${id}`,
		update: (id: string) => `/products/${id}`,
		updateBasic: (id: string) => `/products/${id}/basic`,
		delete: (id: string) => `/products/${id}`,
	},

	// Category endpoints
	categories: {
		create: "/categories",
		getAll: "/categories",
		getById: (id: string) => `/categories/${id}`,
		update: (id: string) => `/categories/${id}`,
		delete: (id: string) => `/categories/${id}`,
	},

	// Stock management endpoints
	stock: {
		overview: "/stock/overview",
		productStock: (productId: string) => `/stock/product/${productId}`,
		alerts: "/stock/alerts",
		checkAvailability: "/stock/check-availability",
		updateProduct: (productId: string) => `/stock/product/${productId}`,
		updateSize: (productId: string, sizeLabel: string) =>
			`/stock/product/${productId}/size/${sizeLabel}`,
		bulkUpdate: "/stock/bulk",
		history: (productId: string) => `/stock/product/${productId}/history`,
		stats: "/stock/stats",
	},

	// Cart endpoints
	cart: {
		get: "/cart",
		add: "/cart/add",
		update: "/cart/update",
		remove: (productId: string) => `/cart/remove/${productId}`,
		clear: "/cart/clear",
	},

	// Health check
	health: "/health",
};

export default endPoints;
