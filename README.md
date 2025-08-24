<!-- @format -->

# Wearlo

A modern e-commerce frontend application built with React, TypeScript, and Tailwind CSS.

## Architecture

This project follows a **screen-based architecture** that provides clear separation between page-level components and reusable UI components.

### Directory Structure

```
src/
├── screens/           # Screen components (pages/views)
│   ├── LandingScreen/
│   ├── ProductDetailsScreen/
│   ├── InventoryScreen/      # Enhanced inventory management
│   ├── StockDashboardScreen/ # Comprehensive stock dashboard
│   └── index.ts
├── components/        # Reusable UI components
│   ├── atoms/        # Basic building blocks (Button, Typography, Icon)
│   ├── molecules/    # Simple component combinations
│   │   ├── StockUpdateModal/    # Stock update interface
│   │   └── StockAlertsWidget/   # Low stock alerts
│   ├── organisms/    # Complex component combinations
│   └── templates/    # Layout templates
├── contexts/         # React context providers
├── services/         # API services and business logic
│   ├── stockService.ts      # Stock management operations
│   └── productService.ts    # Product operations
├── types/           # TypeScript type definitions
└── App.tsx          # Main application component
```

### Key Benefits

- **Screens**: Handle page-level logic and composition
- **Components**: Focus on reusability and maintainability
- **Clear Separation**: Easy to understand what belongs where
- **Scalability**: Simple to add new screens and features

## Features

### 🛍️ **E-commerce Core**

- Product catalog with categories
- Product details and image galleries
- Shopping cart and checkout
- User authentication and profiles

### 📦 **Inventory Management**

- **Stock Dashboard**: Real-time stock overview and analytics
- **Stock Operations**: Add, subtract, and set stock levels
- **Size-specific Stock**: Track stock for individual product sizes
- **Low Stock Alerts**: Automated notifications for inventory management
- **Stock History**: Audit trail for all stock changes

### 🎨 **Modern UI/UX**

- Responsive design with Tailwind CSS
- Smooth animations with Framer Motion
- Intuitive navigation and user flows
- Professional dashboard interfaces

## Getting Started

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Build for production: `npm run build`

## Technologies

- React 18
- TypeScript
- Tailwind CSS
- React Router
- Framer Motion
- Lucide React Icons

## Documentation

- [Stock Management System](./STOCK_MANAGEMENT_README.md) - Comprehensive guide to inventory management
- [Admin Dashboard](./ADMIN_DASHBOARD_README.md) - Admin panel features and usage
- [Backend Integration](./BACKEND_INTEGRATION_README.md) - API integration details
