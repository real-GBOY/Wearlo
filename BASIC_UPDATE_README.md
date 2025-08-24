<!-- @format -->

# Basic Product Update Functionality

This document explains the new basic product update functionality that allows updating products without image changes.

## Overview

The system now supports two types of product updates:

1. **Basic Update** (`PATCH /:id/basic`) - For text-only changes (name, description, price, etc.)
2. **Full Update** (`PATCH /:id`) - For changes involving images

## How It Works

### Automatic Detection

The system automatically detects which update method to use based on whether there are image changes:

- **No new images + No removed images** → Uses Basic Update endpoint
- **New images OR removed images** → Uses Full Update endpoint

### Basic Update Endpoint

```
PATCH /api/products/:id/basic
```

**Permissions Required:**

- `Permissions.EditProduct`
- `Permissions.ManageInventory`

**Request Body:** JSON (not FormData)

```json
{
	"name": "Updated Product Name",
	"description": "Updated description",
	"price": 99.99,
	"discount": 10,
	"stock": 50,
	"category": "category_id",
	"sizes": [
		{
			"label": "M",
			"stock": 25
		}
	]
}
```

### Full Update Endpoint

```
PATCH /api/products/:id
```

**Request Body:** FormData (multipart/form-data)

- Text fields: name, description, price, discount, stock, category, sizes
- Image files: file (for new images)

## Frontend Implementation

### Product Service

The `productService` now includes:

```typescript
// Basic update (no images)
updateBasic: async (id: string, data: UpdateProductData): Promise<Product>

// Full update (with images)
update: async (id: string, data: UpdateProductData): Promise<Product>
```

### Product Management Screen

The form automatically shows which update method will be used:

- 🔄 **Using Basic Update (no image changes)** - Green indicator
- 📸 **Using Full Update (with image changes)** - Blue indicator

### Test Buttons

Several test buttons are available when editing:

1. **Test Basic Update** - Tests the basic update endpoint with sample data
2. **Direct Update Test** - Tests update with current form data
3. **Minimal Update Test** - Tests with minimal data (always uses basic update)

## Benefits

1. **Performance** - Basic updates are faster (no image processing)
2. **Efficiency** - Avoids unnecessary image handling for text-only changes
3. **Flexibility** - Supports both simple and complex update scenarios
4. **User Experience** - Clear indication of which update method is being used

## Usage Examples

### Basic Update (Recommended for text changes)

```typescript
// Update product name and price only
await productService.updateBasic(productId, {
	name: "New Product Name",
	price: 149.99,
});
```

### Full Update (Required for image changes)

```typescript
// Update with new images
const formData = new FormData();
formData.append("name", "Updated Name");
formData.append("file", imageFile);

await productService.update(productId, {
	name: "Updated Name",
	images: [imageFile],
});
```

## Backend Requirements

The backend must implement the new endpoint:

```javascript
router.patch(
	"/:id/basic",
	requireAuth,
	requirePermissions(Permissions.EditProduct, Permissions.ManageInventory),
	controller.updateProductBasic
);
```

This endpoint should:

- Accept JSON data (not FormData)
- Handle text fields only
- Not require image processing
- Return the updated product

## Testing

Use the test buttons in the Product Management Screen to verify:

1. Basic updates work without images
2. Full updates work with images
3. Automatic endpoint selection works correctly
4. Error handling works for both methods

## Troubleshooting

### Common Issues

1. **"Endpoint not found"** - Ensure backend implements `/:id/basic` route
2. **"Permission denied"** - Check user has required permissions
3. **"Validation failed"** - Verify request data format matches backend expectations

### Debug Information

The console logs show:

- Which endpoint is being used
- Request data being sent
- Response from backend
- Any errors encountered

Check browser console for detailed debugging information.
