<!-- @format -->

# Inventory Screen

The Inventory Screen is a comprehensive inventory management interface that fetches real-time data from the backend API instead of using mock data.

## Features

### 📊 Real-time Statistics

- **Total Products**: Shows the total count of products in the system
- **Low Stock Items**: Highlights products with stock levels ≤ 10 units
- **Total Inventory Value**: Calculates the total monetary value of all inventory
- **Active Products**: Counts products currently in stock

### 🔍 Advanced Data Table

- **Search Functionality**: Search across all product fields
- **Sorting**: Sort by any column (name, category, stock, price, etc.)
- **Real-time Data**: Fetches data from backend API with pagination
- **Status Indicators**: Visual badges showing stock status (In Stock, Low Stock, Out of Stock)

### 📱 Responsive Design

- Mobile-friendly interface
- Collapsible sidebar navigation
- Dark/light theme support

### 🔄 Backend Integration

- **Product Service**: Uses `productService.getAll()` for data fetching
- **Pagination**: Server-side pagination with 20 items per page
- **Error Handling**: Graceful error handling with retry functionality
- **Loading States**: Skeleton loading while fetching data

## API Endpoints Used

- `GET /api/products` - Fetch products with pagination
- `DELETE /api/products/:id` - Delete products
- Category data is automatically fetched and mapped to products

## Navigation

The inventory page is accessible via:

- **URL**: `/admin/inventory`
- **Sidebar**: Products → Inventory
- **Role Required**: Admin or Manager

## Data Structure

Products are fetched with the following structure:

```typescript
interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	discount?: number;
	stock: number;
	category: string;
	categoryName: string;
	sizes: ProductSize[];
	images: string[];
	createdAt: string;
	updatedAt?: string;
}
```

## Stock Status Logic

- **In Stock**: Stock > 10 units (Green badge)
- **Low Stock**: Stock ≤ 10 units (Orange badge with warning icon)
- **Out of Stock**: Stock = 0 units (Red badge)

## Future Enhancements

- [ ] Add Product functionality
- [ ] Edit Product functionality
- [ ] Bulk stock updates
- [ ] Stock alerts and notifications
- [ ] Inventory history tracking
- [ ] Export functionality (CSV, Excel)
- [ ] Stock movement analytics

## Dependencies

- React 18+
- TypeScript
- Framer Motion (animations)
- Lucide React (icons)
- Tailwind CSS (styling)
- React Router (navigation)
