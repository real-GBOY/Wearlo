/** @format */

import apiRepo from "../../config/apiRepo";
import endPoints from "../../config/endPoints";
import { categoryService, Category } from "./categoryService";
import { Product, ProductSize } from "../types";

// Get the base URL from the axios configuration
const BASE_URL = "http://localhost:5000/api";

export interface CreateProductData {
	name: string;
	description: string;
	price: number;
	discount?: number;
	stock: number;
	category: string; // Keep as string for creation - backend expects category ID
	sizes: ProductSize[];
	images?: File[];
}

export interface UpdateProductData {
	name?: string;
	description?: string;
	price?: number;
	discount?: number;
	stock?: number;
	category?: string;
	sizes?: ProductSize[];
	images?: File[];
	imagesToRemove?: string[]; // Added for image removal
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
			const mappedProducts = products.map((prod: any) => {
				// Handle category field - it might be an object or string
				let categoryId = prod.category;
				let categoryName = "";

				if (typeof prod.category === "object" && prod.category !== null) {
					// If category is an object, extract the ID and name
					categoryId = prod.category._id;
					categoryName = prod.category.name;
				} else if (typeof prod.category === "string") {
					// If category is a string (ID), try to get the name from the category map
					categoryName = categoryMap.get(prod.category) || prod.category;
				}

				return {
					...prod,
					id: prod._id,
					category: categoryId, // Ensure category is always a string ID
					categoryName: categoryName,
				};
			});

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

			console.log("Raw product from API:", product);

			// Fetch categories to get category name
			let categoryName = "";
			let categoryId = product.category;

			try {
				const categories = await categoryService.getAll();
				console.log("Fetched categories:", categories);
				console.log("Product category:", product.category);

				// Handle category field - it might be an object or string
				if (typeof product.category === "object" && product.category !== null) {
					// If category is an object, extract the ID and name
					categoryId = product.category._id;
					categoryName = product.category.name;
				} else if (typeof product.category === "string") {
					// If category is a string (ID), try to find the name
					const category = categories.find(
						(cat) => cat._id === product.category
					);
					console.log("Found category:", category);
					categoryName = category?.name || "";
				}

				console.log("Category name:", categoryName);
			} catch (error) {
				console.warn("Failed to fetch category name for product:", error);
			}

			const enrichedProduct = {
				...product,
				id: product._id,
				category: categoryId, // Ensure category is always a string ID
				categoryName: categoryName,
			};

			console.log("Enriched product:", enrichedProduct);
			return enrichedProduct;
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

			if (data.images && data.images.length > 0) {
				data.images.forEach((image) => {
					formData.append("images", image);
				});
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
			console.log("ProductService: Updating product", id, "with data:", data);
			let response;

			// The backend expects multipart form-data for all updates, even text-only ones
			// This is because the controller requires images to be present
			console.log(
				"ProductService: Using FormData for all updates (backend requirement)"
			);
			const formData = new FormData();

			// Add all text fields - use only the field names the backend expects
			// Based on the HTTP test file, these are the valid field names
			if (data.name) formData.append("name", data.name);
			if (data.description) formData.append("description", data.description);
			if (data.price !== undefined)
				formData.append("price", data.price.toString());
			if (data.discount !== undefined)
				formData.append("discount", data.discount.toString());
			if (data.stock !== undefined)
				formData.append("stock", data.stock.toString());
			if (data.category) formData.append("category", data.category);
			if (data.sizes) formData.append("sizes", JSON.stringify(data.sizes));

			// Add new images if any - use 'file' as the field name (backend expects this)
			if (data.images && data.images.length > 0) {
				data.images.forEach((image) => {
					formData.append("file", image);
				});
			} else {
				// If no new images, add an empty file field to satisfy backend requirement
				// This prevents the "No images uploaded" error
				formData.append(
					"file",
					new File([""], "placeholder.txt", { type: "text/plain" })
				);
			}

			// Note: Removed imagesToRemove field as it's not in the HTTP test file
			// The backend might not support this field, causing the "Unexpected field" error

			const updateUrl = endPoints.products.update(id);
			console.log("ProductService: Sending PATCH request to:", updateUrl);
			console.log("ProductService: Full URL:", `${BASE_URL}${updateUrl}`);
			console.log("ProductService: FormData contents:");
			for (let [key, value] of formData.entries()) {
				console.log(`${key}:`, value);
			}

			// Log the original data object for comparison
			console.log("ProductService: Original update data:", data);

			response = await apiRepo.PATCH(updateUrl, formData);

			console.log("ProductService: Update response:", response);
			const product = response.data || response;
			return {
				...product,
				id: product._id,
			};
		} catch (error) {
			console.error("ProductService: Error updating product:", error);
			console.error("ProductService: Error details:", {
				message: error instanceof Error ? error.message : "Unknown error",
				response: (error as any)?.response?.data,
				status: (error as any)?.response?.status,
			});

			// Log the actual request data that was sent
			if ((error as any)?.config) {
				console.error("ProductService: Request config:", {
					url: (error as any).config.url,
					method: (error as any).config.method,
					headers: (error as any).config.headers,
					data: (error as any).config.data,
				});
			}

			// Log the backend error response in detail
			if ((error as any)?.response?.data) {
				console.error("ProductService: Backend error response:", {
					message: (error as any).response.data.message,
					errors: (error as any).response.data.errors,
					details: (error as any).response.data,
				});

				// Log the full response data for debugging
				console.error(
					"ProductService: Full response data:",
					JSON.stringify((error as any).response.data, null, 2)
				);

				// Check if there are specific validation errors
				if ((error as any).response.data.errors) {
					console.error(
						"ProductService: Validation errors:",
						(error as any).response.data.errors
					);
				}

				// Check if there's a specific error message
				if ((error as any).response.data.message) {
					console.error(
						"ProductService: Error message:",
						(error as any).response.data.message
					);
				}
			}

			// Handle specific error types
			if ((error as any)?.response?.status === 404) {
				console.error(
					"ProductService: 404 Error - Endpoint not found. This might mean:"
				);
				console.error(
					"1. The backend doesn't support PATCH for product updates"
				);
				console.error("2. The endpoint path is incorrect");
				console.error("3. The backend server is not running");
				console.error("4. The backend only supports PUT for updates");
			}

			throw error;
		}
	},

	// Update product basic info (no images)
	updateBasic: async (
		id: string,
		data: UpdateProductData
	): Promise<Product> => {
		try {
			console.log(
				"ProductService: Updating product basic info",
				id,
				"with data:",
				data
			);

			// For basic updates, we send JSON data instead of FormData
			// This matches the PATCH /:id/basic endpoint that doesn't require images
			const updateData: any = {};

			// Only include fields that have values
			if (data.name) updateData.name = data.name;
			if (data.description) updateData.description = data.description;
			if (data.price !== undefined) updateData.price = data.price;
			if (data.discount !== undefined) updateData.discount = data.discount;
			if (data.stock !== undefined) updateData.stock = data.stock;
			if (data.category) updateData.category = data.category;
			if (data.sizes) updateData.sizes = data.sizes;

			const updateUrl = endPoints.products.updateBasic(id);
			console.log(
				"ProductService: Sending PATCH request to basic endpoint:",
				updateUrl
			);
			console.log("ProductService: Update data:", updateData);

			const response = await apiRepo.PATCH(updateUrl, updateData);

			console.log("ProductService: Basic update response:", response);
			const product = response.data || response;
			return {
				...product,
				id: product._id,
			};
		} catch (error) {
			console.error(
				"ProductService: Error updating product basic info:",
				error
			);
			console.error("ProductService: Error details:", {
				message: error instanceof Error ? error.message : "Unknown error",
				response: (error as any)?.response?.data,
				status: (error as any)?.response?.status,
			});

			// Log the backend error response in detail
			if ((error as any)?.response?.data) {
				console.error("ProductService: Backend error response:", {
					message: (error as any).response.data.message,
					errors: (error as any).response.data.errors,
					details: (error as any).response.data,
				});
			}

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

	// Get related products by category
	getRelatedByCategory: async (
		categoryId: string,
		currentProductId: string,
		limit: number = 4
	): Promise<Product[]> => {
		try {
			console.log(
				"Fetching related products for category:",
				categoryId,
				"excluding product:",
				currentProductId
			);

			// Since the backend doesn't support category filtering, we'll fetch all products
			// and filter them on the frontend. In a production environment, you'd want
			// the backend to support category filtering for better performance.
			const response = await apiRepo.GET(
				`${endPoints.products.getAll}?page=1&limit=100`
			);

			console.log("Raw products response:", response);

			// Handle the nested structure where products are in response.items
			const products = response.items || response.data || response;

			console.log("Extracted products:", products);
			console.log(
				"Products with category:",
				products.filter((p: any) => p.category)
			);

			// Filter by category and exclude current product
			const filteredProducts = products
				.filter((prod: any) => {
					// Handle different category formats
					const prodCategory = prod.category;
					const categoryMatch =
						prodCategory === categoryId ||
						(typeof prodCategory === "object" &&
							prodCategory._id === categoryId) ||
						prodCategory === categoryId;

					return categoryMatch && prod._id !== currentProductId;
				})
				.slice(0, limit)
				.map((prod: any) => {
					// Handle category field - it might be an object or string
					let categoryId = prod.category;

					if (typeof prod.category === "object" && prod.category !== null) {
						// If category is an object, extract the ID
						categoryId = prod.category._id;
					}

					return {
						...prod,
						id: prod._id,
						category: categoryId, // Ensure category is always a string ID
					};
				});

			console.log("Filtered related products:", filteredProducts);
			return filteredProducts;
		} catch (error) {
			console.error("Error fetching related products:", error);
			return [];
		}
	},
};
