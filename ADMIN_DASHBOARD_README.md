<!-- @format -->

# Wearlo Admin Dashboard

A comprehensive admin dashboard for e-commerce management built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

### Dashboard Architecture

- **DashboardTemplate**: Main layout with collapsible sidebar and header
- **DashboardSidebar**: Expandable/collapsible navigation with menu items and sub-menus
- **DashboardHeader**: Top navigation with search, notifications, theme toggle, and user menu
- **Responsive Design**: Mobile-first approach with breakpoints

### Core Dashboard Pages

- **Dashboard Overview**: Main analytics and summary page
- **Product Management**: CRUD operations for products with inventory tracking
- **Order Management**: Order processing and status tracking (Coming Soon)
- **User Management**: Customer and admin user management (Coming Soon)
- **Inventory Management**: Stock levels and inventory history (Coming Soon)
- **Analytics**: Sales reports and performance metrics (Coming Soon)
- **Settings**: System configuration and preferences (Coming Soon)

### Component Structure (Atomic Design)

#### Atoms

- **Card**: Reusable container with hover effects and consistent styling
- **Badge**: Status indicators with color variants (success, warning, error, info)
- **Select**: Dropdown component with custom styling and icon
- **Button**: Multiple variants (primary, secondary, outline) with loading states
- **Typography**: Consistent text styling with semantic variants
- **Input**: Form inputs with validation and error states

#### Molecules

- **StatsCard**: Metric display with icon, value, change percentage, and color coding
- **DataTable**: Sortable, searchable table with pagination and row actions

#### Organisms

- **DashboardSidebar**: Navigation menu with collapsible sections and active states
- **DashboardHeader**: Top bar with search, notifications, and user controls

## 🛠️ Installation & Setup

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Start Development Server**

   ```bash
   npm run dev
   ```

3. **Access Admin Dashboard**
   Navigate to `/admin` in your browser

## 📱 Usage

### Navigation

- **Sidebar**: Collapsible navigation with main menu items
- **Header**: Global search, notifications, theme toggle, and user menu
- **Breadcrumbs**: Clear navigation hierarchy

### Dashboard Overview

- **Stats Cards**: Revenue, orders, products, and users with growth metrics
- **Recent Orders**: Latest orders with status badges
- **Low Stock Alerts**: Products below threshold with warning styling
- **Recent Activity**: System notifications and updates
- **Top Selling Products**: Performance metrics with sales data

### Product Management

- **Product List**: DataTable with search, sort, and filter capabilities
- **Bulk Actions**: Select multiple products for batch operations
- **Status Management**: Active, inactive, draft product states
- **Inventory Tracking**: Stock levels, low stock alerts, reorder points

### Data Table Features

- **Sorting**: Click column headers to sort ascending/descending
- **Search**: Global search across all table data
- **Pagination**: Navigate through large datasets
- **Row Actions**: Edit, delete, view buttons for each row
- **Responsive**: Mobile-optimized with horizontal scroll
- **Loading States**: Skeleton loading and empty states

## 🎨 Styling & Animation

- **Color System**: Consistent color palette with semantic meanings
- **Typography Scale**: Hierarchical text sizing (h1-h4, body, caption)
- **Spacing System**: 8px grid for consistent layouts
- **Motion Design**: Framer Motion for smooth transitions
- **Dark Mode**: Complete theme switching with proper contrast

## 🔧 Technical Implementation

- **React + TypeScript**: Full type safety throughout
- **React Router**: Navigation between dashboard sections
- **Framer Motion**: Smooth animations and transitions
- **Tailwind CSS**: Utility-first styling with custom components
- **State Management**: React Context for theme and auth
- **Mock Data**: Realistic sample data for all dashboard sections

## 📊 Dashboard Metrics

- Revenue tracking with growth percentages
- Order status distribution and trends
- Product performance and inventory levels
- User activity and engagement metrics
- Low stock alerts and reorder notifications

## 🚧 Coming Soon

- **Order Management**: Complete order processing workflow
- **User Management**: Customer and admin user management
- **Inventory Management**: Advanced stock tracking and history
- **Analytics**: Detailed sales reports and performance metrics
- **Settings**: System configuration and preferences
- **Product Forms**: Complete product creation/editing forms
- **Image Upload**: Drag-and-drop with preview and removal

## 🎯 Key Benefits

1. **Professional UI/UX**: Modern, clean interface with smooth animations
2. **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
3. **Type Safety**: Full TypeScript implementation for better development experience
4. **Component Reusability**: Atomic design pattern for maintainable code
5. **Performance**: Optimized with React best practices and Framer Motion
6. **Accessibility**: Keyboard navigation and screen reader support
7. **Dark Mode**: Complete theme switching with proper contrast ratios

## 🔍 File Structure

```
src/
├── components/
│   ├── atoms/           # Basic UI components
│   ├── molecules/       # Composite components
│   ├── organisms/       # Complex components
│   └── templates/       # Layout components
├── screens/             # Page components
├── contexts/            # React contexts
├── data/                # Mock data and types
├── utils/               # Utility functions
└── types/               # TypeScript interfaces
```

## 🚀 Getting Started

1. Navigate to `/admin` to access the dashboard
2. Use the sidebar to navigate between different sections
3. Explore the dashboard overview for key metrics
4. Manage products in the Product Management section
5. Toggle between light and dark themes using the header

## 🤝 Contributing

The dashboard is built with a modular architecture, making it easy to:

- Add new dashboard pages
- Extend existing components
- Implement new features
- Customize styling and animations

## 📝 Notes

- Currently uses mock data for demonstration
- All CRUD operations log to console (ready for API integration)
- Responsive design tested on multiple screen sizes
- Dark mode fully implemented with proper contrast
- Animation performance optimized with Framer Motion

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
