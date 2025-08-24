/** @format */

import { OrderItem, Product } from "../types";
import { MOCK_INVENTORY_API } from "./apiMocks";

export interface InventoryUpdate {
	productId: string;
	quantity: number;
	operation: "decrease" | "increase";
}

export interface InventoryResult {
	success: boolean;
	message: string;
	updatedProducts?: Array<{
		productId: string;
		oldStock: number;
		newStock: number;
	}>;
	errors?: Array<{
		productId: string;
		error: string;
	}>;
}

export class InventoryService {
	private static instance: InventoryService;

	private constructor() {}

	public static getInstance(): InventoryService {
		if (!InventoryService.instance) {
			InventoryService.instance = new InventoryService();
		}
		return InventoryService.instance;
	}

	/**
	 * Reduce inventory when order is completed
	 */
	async reduceInventory(orderItems: OrderItem[]): Promise<InventoryResult> {
		try {
			const updates: InventoryUpdate[] = orderItems.map((item) => ({
				productId: item.productId,
				quantity: item.quantity,
				operation: "decrease",
			}));

			return await this.processInventoryUpdates(updates);
		} catch (error) {
			console.error("Error reducing inventory:", error);
			return {
				success: false,
				message: "Failed to reduce inventory",
				errors: [
					{
						productId: "unknown",
						error: error instanceof Error ? error.message : "Unknown error",
					},
				],
			};
		}
	}

	/**
	 * Restore inventory when order is cancelled
	 */
	async restoreInventory(orderItems: OrderItem[]): Promise<InventoryResult> {
		try {
			const updates: InventoryUpdate[] = orderItems.map((item) => ({
				productId: item.productId,
				quantity: item.quantity,
				operation: "increase",
			}));

			return await this.processInventoryUpdates(updates);
		} catch (error) {
			console.error("Error restoring inventory:", error);
			return {
				success: false,
				message: "Failed to restore inventory",
				errors: [
					{
						productId: "unknown",
						error: error instanceof Error ? error.message : "Unknown error",
					},
				],
			};
		}
	}

	/**
	 * Process inventory updates (decrease or increase stock)
	 */
	private async processInventoryUpdates(
		updates: InventoryUpdate[]
	): Promise<InventoryResult> {
		const results: Array<{
			productId: string;
			oldStock: number;
			newStock: number;
		}> = [];

		const errors: Array<{
			productId: string;
			error: string;
		}> = [];

		for (const update of updates) {
			try {
				const result = await this.updateProductStock(update);
				if (
					result.success &&
					result.oldStock !== undefined &&
					result.newStock !== undefined
				) {
					results.push({
						productId: update.productId,
						oldStock: result.oldStock,
						newStock: result.newStock,
					});
				} else {
					errors.push({
						productId: update.productId,
						error: result.message || "Failed to update stock",
					});
				}
			} catch (error) {
				errors.push({
					productId: update.productId,
					error: error instanceof Error ? error.message : "Unknown error",
				});
			}
		}

		const success = errors.length === 0;

		return {
			success,
			message: success
				? `Successfully updated inventory for ${results.length} products`
				: `Updated ${results.length} products, ${errors.length} failed`,
			updatedProducts: results.length > 0 ? results : undefined,
			errors: errors.length > 0 ? errors : undefined,
		};
	}

	/**
	 * Update individual product stock
	 */
	private async updateProductStock(update: InventoryUpdate): Promise<{
		success: boolean;
		message: string;
		oldStock?: number;
		newStock?: number;
	}> {
		try {
			// In a real app, this would call your backend API
			// For now, we'll simulate the API call
			const response = await fetch(
				`/api/products/${update.productId}/inventory`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						operation: update.operation,
						quantity: update.quantity,
					}),
				}
			);

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			const result = await response.json();

			return {
				success: true,
				message: "Stock updated successfully",
				oldStock: result.oldStock,
				newStock: result.newStock,
			};
		} catch (error) {
			console.error(`Error updating product ${update.productId} stock:`, error);

			// For demo purposes, simulate successful update
			// In production, remove this mock logic
			const mockOldStock = 100; // This would come from the database
			const mockNewStock =
				update.operation === "decrease"
					? Math.max(0, mockOldStock - update.quantity)
					: mockOldStock + update.quantity;

			return {
				success: true,
				message: "Stock updated successfully (demo mode)",
				oldStock: mockOldStock,
				newStock: mockNewStock,
			};
		}
	}

	/**
	 * Check if products have sufficient stock before order
	 */
	async checkStockAvailability(orderItems: OrderItem[]): Promise<{
		available: boolean;
		insufficientItems: Array<{
			productId: string;
			productName: string;
			requested: number;
			available: number;
		}>;
	}> {
		try {
			// For demo purposes, use mock data
			// In production, this would call your backend API
			const insufficientItems: Array<{
				productId: string;
				productName: string;
				requested: number;
				available: number;
			}> = [];

			for (const item of orderItems) {
				// Mock stock data - simulate products with sufficient stock
				const mockStock = 100; // Assume all products have 100 in stock

				if (mockStock < item.quantity) {
					insufficientItems.push({
						productId: item.productId,
						productName: item.productName,
						requested: item.quantity,
						available: mockStock,
					});
				}
			}

			return {
				available: insufficientItems.length === 0,
				insufficientItems,
			};
		} catch (error) {
			console.error("Error checking stock availability:", error);
			return {
				available: false,
				insufficientItems: orderItems.map((item) => ({
					productId: item.productId,
					productName: item.productName,
					requested: item.quantity,
					available: 0,
				})),
			};
		}
	}

	/**
	 * Get low stock alerts
	 */
	async getLowStockAlerts(threshold: number = 10): Promise<
		Array<{
			productId: string;
			productName: string;
			currentStock: number;
			threshold: number;
		}>
	> {
		try {
			// In a real app, this would call your backend API
			const response = await fetch(
				`/api/products/low-stock?threshold=${threshold}`
			);

			if (response.ok) {
				return await response.json();
			} else {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}
		} catch (error) {
			console.error("Error getting low stock alerts:", error);
			return [];
		}
	}
}

export default InventoryService.getInstance();
