/** @format */

import apiRepo from "../../config/apiRepo";
import endPoints from "../../config/endPoints";
import { categoryService, Category } from "./categoryService";

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
	category: string; // This is the category ID
	categoryName?: string; // This will be the category name for display
	sizes: ProductSize[];
	images: string[];
	createdAt: string;
	updatedAt?: string;
	__v?: number;
}

export interface CreateProductData {
	name: string;
	description: string;
	price: number;
	discount?: number;
	stock: number;
	category: string;
	sizes: ProductSize[];
	image?: File;
}

export interface UpdateProductData {
	name?: string;
	description?: string;
	price?: number;
	discount?: number;
	stock?: number;
	category?: string;
	sizes?: ProductSize[];
	image?: File;
}

export const productService = {
	// Get all products
	getAll: async (
		page: number = 1,
		limit: number = 10
	): Promise<{ items: Product[]; total: number }> => {
		try {
			const response = await apiRepo.GET(
				`${endPoints.products.getAll}?page=${page}&limit=${limit}`
			);
			console.log("Raw API response:", response);
			// Handle the nested structure where products are in response.items
			const products = response.items || response.data || response;
			const total = response.total || products.length;

			console.log("Extracted products:", products);

			// Fetch categories to map category names
			let categories: Category[] = [];
			try {
				categories = await categoryService.getAll();
			} catch (error) {
				console.warn(
					"Failed to fetch categories for product enrichment:",
					error
				);
			}

			// Create a map of category ID to category name
			const categoryMap = new Map<string, string>();
			categories.forEach((cat) => {
				categoryMap.set(cat._id, cat.name);
			});

			// Map _id to id for DataTable compatibility and add category names
			const mappedProducts = products.map((prod: any) => ({
				...prod,
				id: prod._id,
				categoryName: categoryMap.get(prod.category) || prod.category, // Fallback to ID if name not found
			}));

			console.log("Mapped products with category names:", mappedProducts);
			return { items: mappedProducts, total };
		} catch (error) {
			console.error("Error fetching products:", error);
			throw error;
		}
	},

	// Get product by ID
	getById: async (id: string): Promise<Product> => {
		try {
			const response = await apiRepo.GET(endPoints.products.getById(id));
			const product = response.data || response;
			return {
				...product,
				id: product._id,
			};
		} catch (error) {
			console.error("Error fetching product:", error);
			throw error;
		}
	},

	// Create new product
	create: async (data: CreateProductData): Promise<Product> => {
		try {
			const formData = new FormData();
			formData.append("name", data.name);
			formData.append("description", data.description);
			formData.append("price", data.price.toString());
			if (data.discount) formData.append("discount", data.discount.toString());
			formData.append("stock", data.stock.toString());
			formData.append("category", data.category);
			formData.append("sizes", JSON.stringify(data.sizes));

			if (data.image) {
				formData.append("file", data.image);
			}

			const response = await apiRepo.POST(endPoints.products.create, formData);

			const product = response.data || response;
			return {
				...product,
				id: product._id,
			};
		} catch (error) {
			console.error("Error creating product:", error);
			throw error;
		}
	},

	// Update product
	update: async (id: string, data: UpdateProductData): Promise<Product> => {
		try {
			let response;

			if (data.image) {
				// If updating with image, use multipart/form-data
				const formData = new FormData();
				if (data.name) formData.append("name", data.name);
				if (data.description) formData.append("description", data.description);
				if (data.price) formData.append("price", data.price.toString());
				if (data.discount !== undefined)
					formData.append("discount", data.discount.toString());
				if (data.stock) formData.append("stock", data.stock.toString());
				if (data.category) formData.append("category", data.category);
				if (data.sizes) formData.append("sizes", JSON.stringify(data.sizes));
				formData.append("file", data.image);

				response = await apiRepo.PATCH(endPoints.products.update(id), formData);
			} else {
				// If no image, use JSON
				response = await apiRepo.PATCH(endPoints.products.update(id), data);
			}

			const product = response.data || response;
			return {
				...product,
				id: product._id,
			};
		} catch (error) {
			console.error("Error updating product:", error);
			throw error;
		}
	},

	// Delete product
	delete: async (id: string): Promise<void> => {
		try {
			await apiRepo.DELETE(endPoints.products.delete(id));
		} catch (error) {
			console.error("Error deleting product:", error);
			throw error;
		}
	},
};
