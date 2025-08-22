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
