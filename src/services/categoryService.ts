/** @format */

import apiRepo from "../../config/apiRepo";
import endPoints from "../../config/endPoints";

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

export interface CreateCategoryData {
	name: string;
	description: string;
	image?: File;
}

export interface UpdateCategoryData {
	name?: string;
	description?: string;
	image?: File;
}

export const categoryService = {
	// Get all categories
	getAll: async (): Promise<Category[]> => {
		try {
			const response = await apiRepo.GET(endPoints.categories.getAll);
			console.log("Raw category API response:", response);
			// Handle the nested structure where categories are in response.items
			const categories = response.items || response.data || response;
			console.log("Extracted categories:", categories);
			// Map _id to id for DataTable compatibility
			return categories.map((cat: any) => ({
				...cat,
				id: cat._id,
			}));
		} catch (error) {
			console.error("Error fetching categories:", error);
			throw error;
		}
	},

	// Get category by ID
	getById: async (id: string): Promise<Category> => {
		try {
			const response = await apiRepo.GET(endPoints.categories.getById(id));
			const category = response.data || response;
			return {
				...category,
				id: category._id,
			};
		} catch (error) {
			console.error("Error fetching category:", error);
			throw error;
		}
	},

	// Create new category
	create: async (data: CreateCategoryData): Promise<Category> => {
		try {
			const formData = new FormData();
			formData.append("name", data.name);
			formData.append("description", data.description);

			if (data.image) {
				formData.append("file", data.image);
			}

			const response = await apiRepo.POST(
				endPoints.categories.create,
				formData
			);

			const category = response.data || response;
			return {
				...category,
				id: category._id,
			};
		} catch (error) {
			console.error("Error creating category:", error);
			throw error;
		}
	},

	// Update category
	update: async (id: string, data: UpdateCategoryData): Promise<Category> => {
		try {
			let response;

			if (data.image) {
				// If updating with image, use multipart/form-data
				const formData = new FormData();
				if (data.name) formData.append("name", data.name);
				if (data.description) formData.append("description", data.description);
				formData.append("file", data.image);

				response = await apiRepo.PATCH(endPoints.categories.update(id), formData);
			} else {
				// If no image, use JSON
				response = await apiRepo.PATCH(endPoints.categories.update(id), data);
			}

			const category = response.data || response;
			return {
				...category,
				id: category._id,
			};
		} catch (error) {
			console.error("Error updating category:", error);
			throw error;
		}
	},

	// Delete category
	delete: async (id: string): Promise<void> => {
		try {
			await apiRepo.DELETE(endPoints.categories.delete(id));
		} catch (error) {
			console.error("Error deleting category:", error);
			throw error;
		}
	},
};
