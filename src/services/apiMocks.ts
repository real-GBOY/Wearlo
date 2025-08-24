/** @format */

// Mock API endpoints for inventory management
// In a real application, these would be actual backend endpoints

export const MOCK_INVENTORY_API = {
	// Mock product stock data
	products: [
		{ id: "1", name: "Classic T-Shirt", stock: 50 },
		{ id: "2", name: "Denim Jeans", stock: 25 },
		{ id: "3", name: "Sneakers", stock: 30 },
		{ id: "4", name: "Hoodie", stock: 15 },
		{ id: "5", name: "Cap", stock: 40 },
	],

	// Mock API responses
	async getProductStock(productId: string) {
		const product = this.products.find((p) => p.id === productId);
		if (!product) {
			throw new Error("Product not found");
		}
		return { stock: product.stock };
	},

	async updateProductStock(
		productId: string,
		operation: "decrease" | "increase",
		quantity: number
	) {
		const product = this.products.find((p) => p.id === productId);
		if (!product) {
			throw new Error("Product not found");
		}

		const oldStock = product.stock;
		let newStock: number;

		if (operation === "decrease") {
			if (oldStock < quantity) {
				throw new Error("Insufficient stock");
			}
			newStock = oldStock - quantity;
		} else {
			newStock = oldStock + quantity;
		}

		// Update the mock data
		product.stock = newStock;

		return {
			success: true,
			oldStock,
			newStock,
			message: `Stock ${
				operation === "decrease" ? "decreased" : "increased"
			} successfully`,
		};
	},

	async getLowStockProducts(threshold: number = 10) {
		return this.products
			.filter((p) => p.stock <= threshold)
			.map((p) => ({
				productId: p.id,
				productName: p.name,
				currentStock: p.stock,
				threshold,
			}));
	},
};

// Example backend API endpoints that should be implemented:

/*
// 1. Get product stock
GET /api/products/:productId/stock
Response: { stock: number }

// 2. Update product inventory
PATCH /api/products/:productId/inventory
Body: { operation: 'decrease' | 'increase', quantity: number }
Response: { success: boolean, oldStock: number, newStock: number, message: string }

// 3. Get low stock alerts
GET /api/products/low-stock?threshold=10
Response: Array<{ productId: string, productName: string, currentStock: number, threshold: number }>

// 4. Bulk inventory update (for orders)
POST /api/products/inventory/bulk-update
Body: Array<{ productId: string, operation: 'decrease' | 'increase', quantity: number }>
Response: { success: boolean, updatedProducts: Array<{ productId: string, oldStock: number, newStock: number }>, errors: Array<{ productId: string, error: string }> }

// 5. Inventory history
GET /api/products/:productId/inventory-history
Response: Array<{ date: string, operation: string, quantity: number, oldStock: number, newStock: number, reason: string }>
*/

// Database schema example for inventory management:
/*
// Products table
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  stock: Number,
  lowStockThreshold: Number,
  category: ObjectId,
  images: [String],
  createdAt: Date,
  updatedAt: Date
}

// Inventory transactions table
{
  _id: ObjectId,
  productId: ObjectId,
  operation: String, // 'decrease', 'increase', 'adjustment'
  quantity: Number,
  oldStock: Number,
  newStock: Number,
  reason: String, // 'order', 'cancellation', 'restock', 'adjustment'
  orderId: ObjectId, // if related to an order
  userId: ObjectId, // who made the change
  createdAt: Date
}

// Orders table
{
  _id: ObjectId,
  userId: ObjectId,
  items: [{
    productId: ObjectId,
    productName: String,
    quantity: Number,
    price: Number,
    subtotal: Number
  }],
  total: Number,
  status: String, // 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentIntentId: String,
  createdAt: Date,
  updatedAt: Date
}
*/
