<!-- @format -->

# Stock Management System

## Overview

The Stock Management System is a comprehensive solution for managing product inventory, stock levels, and stock operations in the Wearlo e-commerce platform. It provides real-time stock monitoring, automated alerts, and efficient stock update workflows.

## Features

### 🎯 **Core Stock Management**

- **Real-time Stock Overview**: Monitor all products' stock levels in one dashboard
- **Size-specific Stock Tracking**: Track stock for individual product sizes (S, M, L, XL, etc.)
- **Stock Status Indicators**: Visual status indicators (In Stock, Low Stock, Out of Stock)
- **Low Stock Alerts**: Automated notifications for products below threshold

### 📊 **Stock Analytics**

- **Stock Statistics**: Total products, in-stock items, low stock items, out-of-stock items
- **Inventory Value**: Calculate total inventory value across all products
- **Stock Trends**: Track stock changes over time
- **Category-based Analysis**: Filter and analyze stock by product categories

### 🔄 **Stock Operations**

- **Stock Updates**: Add, subtract, or set stock levels
- **Bulk Operations**: Update multiple products simultaneously
- **Size-specific Updates**: Update stock for specific product sizes
- **Audit Trail**: Track all stock changes with reasons and timestamps

### 🚨 **Stock Monitoring**

- **Low Stock Alerts**: Configurable threshold-based alerts
- **Out of Stock Notifications**: Immediate alerts for zero stock items
- **Stock Movement Tracking**: Monitor stock in/out operations
- **Real-time Updates**: Live stock status updates

## Architecture

### **Frontend Components**

#### **1. Stock Service (`src/services/stockService.ts`)**

- Central service for all stock-related API calls
- Handles stock CRUD operations
- Provides utility methods for stock calculations
- Manages stock status and color coding

#### **2. Stock Dashboard Screen (`src/screens/StockDashboardScreen/`)**

- Main stock management interface
- Real-time stock overview with filters
- Stock statistics and metrics
- Quick actions for stock operations

#### **3. Stock Update Modal (`src/components/molecules/StockUpdateModal/`)**

- Modal for updating product stock levels
- Supports add, subtract, and set operations
- Size-specific stock updates
- Reason tracking for audit purposes

#### **4. Stock Alerts Widget (`src/components/molecules/StockAlertsWidget/`)**

- Displays low stock and out-of-stock alerts
- Configurable alert thresholds
- Quick access to product details
- Alert statistics and summaries

#### **5. Enhanced Inventory Screen (`src/screens/InventoryScreen/`)**

- Integrated stock management functionality
- Stock status indicators
- Quick stock update actions
- Enhanced stock visualization

### **Data Types**

#### **Stock Interfaces**

```typescript
interface StockSize {
	label: string;
	stock: number;
	measurements?: {
		chest?: number;
		length?: number;
		sleeve?: number;
		waist?: number;
	};
}

interface StockOverview {
	productId: string;
	name: string;
	category: string;
	totalStock: number;
	sizeStock: StockSize[];
	stockStatus: "In Stock" | "Out of Stock" | "Low Stock";
	lowStock: boolean;
	lastUpdated: string;
}

interface StockAlert {
	productId: string;
	name: string;
	category: string;
	totalStock: number;
	lowStockSizes: StockSize[];
	alertLevel: "Out of Stock" | "Low Stock";
	threshold: number;
}
```

## API Endpoints

### **Stock Overview**

- `GET /stock/overview` - Get stock overview for all products
- `GET /stock/product/:productId` - Get detailed stock for specific product
- `GET /stock/stats` - Get stock statistics and metrics

### **Stock Alerts**

- `GET /stock/alerts?threshold=10` - Get low stock alerts
- `GET /stock/alerts` - Get all stock alerts

### **Stock Operations**

- `PUT /stock/product/:productId` - Update product stock
- `PUT /stock/product/:productId/size/:sizeLabel` - Update size-specific stock
- `PUT /stock/bulk` - Bulk update stock for multiple products

### **Stock Availability**

- `POST /stock/check-availability` - Check stock availability for orders
- `GET /stock/product/:productId/history` - Get stock change history

## Usage Examples

### **1. Fetching Stock Overview**

```typescript
import { stockService } from "../services/stockService";

const fetchStockData = async () => {
	try {
		const response = await stockService.getOverview();
		console.log("Stock Overview:", response.data);
		console.log("Total Products:", response.totalProducts);
		console.log("Low Stock Items:", response.lowStock);
	} catch (error) {
		console.error("Failed to fetch stock overview:", error);
	}
};
```

### **2. Updating Product Stock**

```typescript
const updateStock = async (productId: string) => {
	try {
		const updateData = {
			stock: 50,
			operation: "add",
			reason: "Restock shipment received",
		};

		const result = await stockService.updateProductStock(productId, updateData);
		console.log("Stock updated:", result);
	} catch (error) {
		console.error("Failed to update stock:", error);
	}
};
```

### **3. Checking Stock Availability**

```typescript
const checkAvailability = async () => {
	try {
		const request = {
			items: [
				{ productId: "123", size: "M", quantity: 2 },
				{ productId: "456", size: "L", quantity: 1 },
			],
		};

		const response = await stockService.checkAvailability(request);
		console.log("Availability:", response.canPlaceOrder);
	} catch (error) {
		console.error("Failed to check availability:", error);
	}
};
```

### **4. Getting Low Stock Alerts**

```typescript
const getAlerts = async () => {
	try {
		const alerts = await stockService.getAlerts(15); // threshold of 15
		console.log("Low Stock Alerts:", alerts.data);
		console.log("Total Alerts:", alerts.totalAlerts);
	} catch (error) {
		console.error("Failed to fetch alerts:", error);
	}
};
```

## Integration Points

### **1. Product Management**

- Stock levels are automatically updated when products are created/modified
- Stock status is displayed in product lists and detail views
- Stock validation during product operations

### **2. Order Management**

- Stock availability is checked before order placement
- Stock is automatically deducted when orders are confirmed
- Stock alerts are triggered when levels drop below threshold

### **3. Dashboard Integration**

- Stock statistics are displayed in main dashboard
- Stock alerts are shown in notification panels
- Quick access to stock management from main navigation

### **4. User Experience**

- Real-time stock status updates
- Visual indicators for stock levels
- Quick stock update actions
- Comprehensive stock reporting

## Configuration

### **Stock Thresholds**

```typescript
// Default low stock threshold
const DEFAULT_LOW_STOCK_THRESHOLD = 10;

// Configurable per product
interface Product {
	lowStockThreshold?: number;
	// ... other properties
}
```

### **Stock Status Colors**

```typescript
// Stock status color coding
const stockStatusColors = {
	"In Stock": "text-green-600",
	"Low Stock": "text-orange-600",
	"Out of Stock": "text-red-600",
};
```

### **Alert Settings**

```typescript
// Alert configuration
const alertConfig = {
	defaultThreshold: 10,
	maxAlerts: 5,
	refreshInterval: 30000, // 30 seconds
};
```

## Best Practices

### **1. Stock Updates**

- Always provide a reason for stock changes
- Use appropriate operations (add, subtract, set)
- Validate stock levels before updates
- Maintain audit trail for all changes

### **2. Performance**

- Implement pagination for large stock lists
- Use debounced search for stock filtering
- Cache stock data when appropriate
- Implement real-time updates efficiently

### **3. User Experience**

- Provide clear visual feedback for stock status
- Use consistent color coding for stock levels
- Implement intuitive stock update workflows
- Show relevant stock information in context

### **4. Error Handling**

- Gracefully handle API failures
- Provide meaningful error messages
- Implement retry mechanisms
- Log stock operation errors

## Future Enhancements

### **Planned Features**

- **Stock Forecasting**: Predict stock needs based on sales trends
- **Automated Reordering**: Automatic purchase order generation
- **Stock Transfer**: Move stock between locations/warehouses
- **Advanced Analytics**: Stock turnover rates, seasonal patterns
- **Mobile Stock Management**: Stock updates from mobile devices

### **Integration Opportunities**

- **Supplier Management**: Direct integration with supplier systems
- **Warehouse Management**: Real-time warehouse stock tracking
- **Shipping Integration**: Stock updates from shipping providers
- **Accounting Systems**: Stock value integration with accounting

## Troubleshooting

### **Common Issues**

#### **1. Stock Not Updating**

- Check API endpoint availability
- Verify authentication and permissions
- Check network connectivity
- Review API response for errors

#### **2. Alerts Not Showing**

- Verify alert threshold configuration
- Check stock data freshness
- Review alert widget configuration
- Ensure proper data formatting

#### **3. Performance Issues**

- Implement pagination for large datasets
- Use appropriate search filters
- Optimize API calls
- Consider caching strategies

### **Debug Information**

```typescript
// Enable debug logging
const DEBUG_MODE = true;

if (DEBUG_MODE) {
	console.log("Stock Service Debug:", {
		endpoint: endPoints.stock.overview,
		response: response,
		error: error,
	});
}
```

## Support

For technical support or questions about the Stock Management System:

1. **Documentation**: Review this README and related documentation
2. **Code Examples**: Check the component implementations
3. **API Testing**: Use the provided HTTP test files
4. **Issue Reporting**: Report bugs or feature requests through the project repository

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Maintainer**: Wearlo Development Team
