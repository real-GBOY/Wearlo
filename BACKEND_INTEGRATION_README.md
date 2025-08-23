<!-- @format -->

# Backend Integration for Wearlo Frontend

This document describes the changes made to integrate the Wearlo frontend with a backend API instead of using static data.

## Changes Made

### 1. Created Custom Hooks

#### `useProducts` Hook

- **Location**: `src/hooks/useProducts.ts`
- **Purpose**: Fetches products from the backend API
- **Usage**:
  ```tsx
  const { data: productsData, isLoading, error } = useProducts(page, limit);
  ```

#### `useCategories` Hook

- **Location**: `src/hooks/useCategories.ts`
- **Purpose**: Fetches categories from the backend API
- **Usage**:
  ```tsx
  const { data: categoriesData, isLoading, error } = useCategories();
  ```

### 2. Updated Components

#### ProductsScreen

- Now fetches products and categories from backend
- Added loading and error states
- Uses React Query for data fetching and caching
- Maintains all existing functionality (filtering, sorting, pagination)

#### FeaturedProducts

- Fetches featured products from backend
- Added loading, error, and empty states
- Gracefully handles cases where no featured products exist

#### ProductDetailsScreen

- Fetches individual product details from backend
- Added loading and error states
- Enhanced with stock information and discount display
- Uses product sizes from backend when available

### 3. Updated Type Definitions

#### Product Interface

- Added backend-specific fields: `_id`, `stock`, `sizes`, `createdAt`, `updatedAt`
- Maintains backward compatibility with `id` field
- Added `ProductSize` interface for size and stock management

#### Category Interface

- Added backend-specific fields: `_id`, `description`, `image`, `createdAt`, `updatedAt`
- Maintains backward compatibility with `id` field

### 4. Enhanced React Query Configuration

- Added retry logic with exponential backoff
- Configured stale time and garbage collection time
- Smart retry logic (no retries for client errors 4xx)
- Better error handling and user experience

## API Endpoints

The frontend expects the following API structure:

### Products

- **GET** `/api/products` - Get all products with pagination
- **GET** `/api/products/:id` - Get product by ID
- **POST** `/api/products` - Create new product
- **PUT** `/api/products/:id` - Update product
- **DELETE** `/api/products/:id` - Delete product

### Categories

- **GET** `/api/categories` - Get all categories
- **GET** `/api/categories/:id` - Get category by ID
- **POST** `/api/categories` - Create new category
- **PUT** `/api/categories/:id` - Update category
- **DELETE** `/api/categories/:id` - Delete category

## Data Structure

### Product Response

```json
{
	"items": [
		{
			"_id": "string",
			"id": "string",
			"name": "string",
			"description": "string",
			"price": "number",
			"discount": "number?",
			"stock": "number",
			"category": "string",
			"sizes": [
				{
					"label": "string",
					"stock": "number"
				}
			],
			"images": ["string"],
			"createdAt": "string",
			"updatedAt": "string",
			"featured": "boolean?"
		}
	],
	"total": "number"
}
```

### Category Response

```json
[
	{
		"_id": "string",
		"id": "string",
		"name": "string",
		"description": "string",
		"image": "string?",
		"productCount": "number?",
		"status": "string?",
		"createdAt": "string",
		"updatedAt": "string"
	}
]
```

## Configuration

### API Base URL

The API base URL is configured in `config/axios.ts`:

```typescript
baseURL: "http://localhost:5000/api";
```

### Environment Variables

To make the API URL configurable, you can:

1. Create a `.env` file in the root directory
2. Add: `VITE_API_BASE_URL=http://localhost:5000/api`
3. Update `config/axios.ts` to use: `baseURL: import.meta.env.VITE_API_BASE_URL`

## Error Handling

The application now includes comprehensive error handling:

- Loading states for all data fetching operations
- Error states with user-friendly messages
- Graceful fallbacks for missing data
- Retry logic for network failures

## Caching Strategy

React Query provides intelligent caching:

- **Stale Time**: 5 minutes (data considered fresh)
- **Garbage Collection**: 10 minutes (data kept in memory)
- **Background Refetching**: Automatic updates when data becomes stale
- **Optimistic Updates**: Immediate UI updates for better UX

## Testing the Integration

1. **Start your backend server** on `http://localhost:5000`
2. **Start the frontend**: `npm run dev`
3. **Navigate to `/products`** to see products fetched from backend
4. **Check the browser console** for any API errors
5. **Verify data loading** with loading states and error handling

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your backend allows requests from `http://localhost:5173`
2. **API Connection**: Verify the backend is running and accessible
3. **Data Format**: Check that your API responses match the expected structure
4. **Authentication**: If using protected routes, ensure JWT tokens are properly handled

### Debug Mode

To enable debug logging, add to your `.env`:

```
VITE_DEBUG=true
```

This will log all API requests and responses to the console.

## Future Enhancements

- [ ] Add offline support with React Query's offline capabilities
- [ ] Implement real-time updates with WebSockets
- [ ] Add data prefetching for better performance
- [ ] Implement infinite scrolling for large product lists
- [ ] Add search suggestions and autocomplete
