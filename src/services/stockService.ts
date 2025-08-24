/** @format */

import apiRepo from "../../config/apiRepo";
import endPoints from "../../config/endPoints";
import { productService } from "./productService";
import {
	StockOverview,
	StockAlert,
	StockAvailabilityRequest,
	StockAvailabilityResponse,
	StockUpdateRequest,
	StockHistory,
	StockStats,
	Product,
} from "../types";

export const stockService = {
	// Get stock overview for all products
	getOverview: async (): Promise<{
		data: StockOverview[];
		totalProducts: number;
		inStock: number;
		outOfStock: number;
		lowStock: number;
	}> => {
		try {
			// Use existing product service to get all products
			const response = await productService.getAll(1, 1000);
			const products = response.items;

			// Transform products to stock overview format
			const stockOverview: StockOverview[] = products.map((product) => {
				const totalStock = product.stock;
				const stockStatus = stockService.calculateStockStatus(totalStock, 10);
				const lowStock = stockService.isLowStock(totalStock, 10);

				return {
					productId: product.id,
					name: product.name,
					category: product.categoryName || "Unknown",
					totalStock,
					sizeStock: product.sizes || [],
					stockStatus,
					lowStock,
					lastUpdated: product.updatedAt || product.createdAt,
				};
			});

			// Calculate stats
			const inStock = stockOverview.filter(
				(item) => item.stockStatus === "In Stock"
			).length;
			const outOfStock = stockOverview.filter(
				(item) => item.stockStatus === "Out of Stock"
			).length;
			const lowStock = stockOverview.filter(
				(item) => item.stockStatus === "Low Stock"
			).length;

			return {
				data: stockOverview,
				totalProducts: products.length,
				inStock,
				outOfStock,
				lowStock,
			};
		} catch (error) {
			console.error("Error fetching stock overview:", error);
			throw error;
		}
	},

	// Get detailed stock information for a specific product
	getProductStock: async (productId: string): Promise<StockOverview> => {
		try {
			// Use existing product service to get product
			const product = await productService.getById(productId);

			const totalStock = product.stock;
			const stockStatus = stockService.calculateStockStatus(totalStock, 10);
			const lowStock = stockService.isLowStock(totalStock, 10);

			return {
				productId: product.id,
				name: product.name,
				category: product.categoryName || "Unknown",
				totalStock,
				sizeStock: product.sizes || [],
				stockStatus,
				lowStock,
				lastUpdated: product.updatedAt || product.createdAt,
			};
		} catch (error) {
			console.error("Error fetching product stock:", error);
			throw error;
		}
	},

	// Get low stock alerts
	getAlerts: async (
		threshold: number = 10
	): Promise<{
		data: StockAlert[];
		threshold: number;
		totalAlerts: number;
		outOfStock: number;
		lowStock: number;
	}> => {
		try {
			// Use existing product service to get all products
			const response = await productService.getAll(1, 1000);
			const products = response.items;

			// Filter products by stock threshold
			const lowStockProducts = products.filter((p) => p.stock <= threshold);

			// Transform to stock alerts
			const alerts: StockAlert[] = lowStockProducts.map((product) => {
				const alertLevel = product.stock === 0 ? "Out of Stock" : "Low Stock";
				const lowStockSizes =
					product.sizes?.filter((size) => size.stock <= threshold) || [];

				return {
					productId: product.id,
					name: product.name,
					category: product.categoryName || "Unknown",
					totalStock: product.stock,
					lowStockSizes,
					alertLevel,
					threshold,
				};
			});

			const outOfStock = alerts.filter(
				(a) => a.alertLevel === "Out of Stock"
			).length;
			const lowStock = alerts.filter(
				(a) => a.alertLevel === "Low Stock"
			).length;

			return {
				data: alerts,
				threshold,
				totalAlerts: alerts.length,
				outOfStock,
				lowStock,
			};
		} catch (error) {
			console.error("Error fetching stock alerts:", error);
			throw error;
		}
	},

	// Check stock availability for order items
	checkAvailability: async (
		request: StockAvailabilityRequest
	): Promise<StockAvailabilityResponse> => {
		try {
			const items = request.items;
			const availabilityResults = [];
			let allAvailable = true;

			for (const item of items) {
				try {
					const product = await productService.getById(item.productId);
					const availableStock = item.size
						? product.sizes?.find((s) => s.label === item.size)?.stock || 0
						: product.stock;

					const available = availableStock >= item.quantity;
					const shortfall = Math.max(0, item.quantity - availableStock);

					if (!available) {
						allAvailable = false;
					}

					availabilityResults.push({
						productId: item.productId,
						productName: product.name,
						size: item.size || "General",
						requestedQuantity: item.quantity,
						availableStock,
						stockSource: "Main Inventory",
						available,
						shortfall,
					});
				} catch (error) {
					availabilityResults.push({
						productId: item.productId,
						productName: "Unknown Product",
						size: item.size || "General",
						requestedQuantity: item.quantity,
						availableStock: 0,
						stockSource: "Unknown",
						available: false,
						shortfall: item.quantity,
					});
					allAvailable = false;
				}
			}

			return {
				allAvailable,
				items: availabilityResults,
				canPlaceOrder: allAvailable,
				message: allAvailable
					? "All items are available"
					: "Some items are not available in requested quantities",
			};
		} catch (error) {
			console.error("Error checking stock availability:", error);
			throw error;
		}
	},

	// Update product stock (general) - Uses existing product update endpoint
	updateProductStock: async (
		productId: string,
		updateData: StockUpdateRequest
	): Promise<{
		success: boolean;
		oldStock: number;
		newStock: number;
		message: string;
	}> => {
		try {
			// Get current product to know old stock
			const currentProduct = await productService.getById(productId);
			const oldStock = currentProduct.stock;

			// Calculate new stock based on operation
			let newStock: number;
			switch (updateData.operation) {
				case "add":
					newStock = oldStock + updateData.stock;
					break;
				case "subtract":
					newStock = Math.max(0, oldStock - updateData.stock);
					break;
				case "set":
					newStock = updateData.stock;
					break;
				default:
					throw new Error("Invalid operation type");
			}

			// Update the product using existing product service
			await productService.updateBasic(productId, {
				stock: newStock,
			});

			return {
				success: true,
				oldStock,
				newStock,
				message: `Stock updated from ${oldStock} to ${newStock} (${updateData.operation} ${updateData.stock})`,
			};
		} catch (error) {
			console.error("Error updating product stock:", error);
			throw error;
		}
	},

	// Update size-specific stock - Updates the product's size array
	updateSizeStock: async (
		productId: string,
		sizeLabel: string,
		updateData: StockUpdateRequest
	): Promise<{
		success: boolean;
		oldStock: number;
		newStock: number;
		message: string;
	}> => {
		try {
			// Get current product
			const currentProduct = await productService.getById(productId);
			const currentSizes = currentProduct.sizes || [];

			// Find the size to update
			const sizeIndex = currentSizes.findIndex((s) => s.label === sizeLabel);
			if (sizeIndex === -1) {
				throw new Error(
					`Size ${sizeLabel} not found for product ${currentProduct.name}`
				);
			}

			const oldStock = currentSizes[sizeIndex].stock;

			// Calculate new stock based on operation
			let newStock: number;
			switch (updateData.operation) {
				case "add":
					newStock = oldStock + updateData.stock;
					break;
				case "subtract":
					newStock = Math.max(0, oldStock - updateData.stock);
					break;
				case "set":
					newStock = updateData.stock;
					break;
				default:
					throw new Error("Invalid operation type");
			}

			// Update the size stock
			const updatedSizes = [...currentSizes];
			updatedSizes[sizeIndex] = {
				...updatedSizes[sizeIndex],
				stock: newStock,
			};

			// Update the product with new sizes
			await productService.updateBasic(productId, {
				sizes: updatedSizes,
			});

			return {
				success: true,
				oldStock,
				newStock,
				message: `Size ${sizeLabel} stock updated from ${oldStock} to ${newStock} (${updateData.operation} ${updateData.stock})`,
			};
		} catch (error) {
			console.error("Error updating size stock:", error);
			throw error;
		}
	},

	// Bulk update stock for multiple products
	bulkUpdateStock: async (
		updates: Array<{
			productId: string;
			size?: string;
			updateData: StockUpdateRequest;
		}>
	): Promise<{
		success: boolean;
		updatedProducts: Array<{
			productId: string;
			oldStock: number;
			newStock: number;
		}>;
		errors: Array<{
			productId: string;
			error: string;
		}>;
	}> => {
		try {
			const results = await Promise.allSettled(
				updates.map(async (update) => {
					if (update.size) {
						return await stockService.updateSizeStock(
							update.productId,
							update.size,
							update.updateData
						);
					} else {
						return await stockService.updateProductStock(
							update.productId,
							update.updateData
						);
					}
				})
			);

			const updatedProducts: Array<{
				productId: string;
				oldStock: number;
				newStock: number;
			}> = [];
			const errors: Array<{
				productId: string;
				error: string;
			}> = [];

			results.forEach((result, index) => {
				if (result.status === "fulfilled") {
					updatedProducts.push({
						productId: updates[index].productId,
						oldStock: result.value.oldStock,
						newStock: result.value.newStock,
					});
				} else {
					errors.push({
						productId: updates[index].productId,
						error: result.reason?.message || "Unknown error",
					});
				}
			});

			return {
				success: errors.length === 0,
				updatedProducts,
				errors,
			};
		} catch (error) {
			console.error("Error bulk updating stock:", error);
			throw error;
		}
	},

	// Get stock history for a product - Placeholder for now
	getProductHistory: async (productId: string): Promise<StockHistory[]> => {
		try {
			// This would typically come from a dedicated stock history endpoint
			// For now, return empty array
			return [];
		} catch (error) {
			console.error("Error fetching product stock history:", error);
			throw error;
		}
	},

	// Get stock statistics
	getStats: async (): Promise<StockStats> => {
		try {
			const overview = await stockService.getOverview();

			return {
				totalProducts: overview.totalProducts,
				inStock: overview.inStock,
				outOfStock: overview.outOfStock,
				lowStock: overview.lowStock,
				totalValue: 0, // Would need price data to calculate
				lowStockThreshold: 10,
			};
		} catch (error) {
			console.error("Error fetching stock stats:", error);
			throw error;
		}
	},

	// Helper method to calculate stock status
	calculateStockStatus: (
		totalStock: number,
		lowStockThreshold: number = 10
	): "In Stock" | "Out of Stock" | "Low Stock" => {
		if (totalStock === 0) return "Out of Stock";
		if (totalStock <= lowStockThreshold) return "Low Stock";
		return "In Stock";
	},

	// Helper method to check if stock is low
	isLowStock: (stock: number, threshold: number = 10): boolean => {
		return stock <= threshold;
	},

	// Helper method to get stock status color
	getStockStatusColor: (
		status: "In Stock" | "Out of Stock" | "Low Stock"
	): string => {
		switch (status) {
			case "In Stock":
				return "text-green-600";
			case "Low Stock":
				return "text-orange-600";
			case "Out of Stock":
				return "text-red-600";
			default:
				return "text-gray-600";
		}
	},

	// Helper method to get stock status badge variant
	getStockStatusBadgeVariant: (
		status: "In Stock" | "Out of Stock" | "Low Stock"
	): "success" | "warning" | "destructive" => {
		switch (status) {
			case "In Stock":
				return "success";
			case "Low Stock":
				return "warning";
			case "Out of Stock":
				return "destructive";
			default:
				return "warning";
		}
	},
};
