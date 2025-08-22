import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  FolderOpen,
  Warehouse,
  Bell,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Typography } from '../../atoms/Typography/Typography';
import { Icon } from '../../atoms/Icon/Icon';

interface DashboardSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isCollapsed,
  onToggle
}) => {
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      children: []
    },
    {
      title: 'Products',
      icon: Package,
      path: '/dashboard/products',
      children: [
        { title: 'All Products', path: '/dashboard/products' },
        { title: 'Add Product', path: '/dashboard/products/new' },
        { title: 'Categories', path: '/dashboard/categories' }
      ]
    },
    {
      title: 'Orders',
      icon: ShoppingCart,
      path: '/dashboard/orders',
      children: [
        { title: 'All Orders', path: '/dashboard/orders' },
        { title: 'Pending', path: '/dashboard/orders/pending' },
        { title: 'Shipped', path: '/dashboard/orders/shipped' }
      ]
    },
    {
      title: 'Inventory',
      icon: Warehouse,
      path: '/dashboard/inventory',
      children: [
        { title: 'Stock Levels', path: '/dashboard/inventory' },
        { title: 'Low Stock', path: '/dashboard/inventory/low-stock' },
        { title: 'History', path: '/dashboard/inventory/history' }
      ]
    },
    {
      title: 'Users',
      icon: Users,
      path: '/dashboard/users',
      children: []
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      path: '/dashboard/analytics',
      children: [
        { title: 'Sales Report', path: '/dashboard/analytics/sales' },
        { title: 'Products Report', path: '/dashboard/analytics/products' },
        { title: 'Users Report', path: '/dashboard/analytics/users' }
      ]
    },
    {
      title: 'Settings',
      icon: Settings,
      path: '/dashboard/settings',
      children: []
    }
  ];

  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen sticky top-0 overflow-hidden"
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <Typography variant="h4">
              MINIMAL
            </Typography>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Icon icon={isCollapsed ? ChevronRight : ChevronLeft} size={20} />
          </motion.button>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <div key={item.path}>
            <Link to={item.path}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                  isActiveRoute(item.path)
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon icon={item.icon} size={20} />
                {!isCollapsed && (
                  <Typography variant="body" className="font-medium">
                    {item.title}
                  </Typography>
                )}
              </motion.div>
            </Link>
            
            {!isCollapsed && item.children.length > 0 && isActiveRoute(item.path) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="ml-6 mt-2 space-y-1"
              >
                {item.children.map((child) => (
                  <Link key={child.path} to={child.path}>
                    <div
                      className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                        location.pathname === child.path
                          ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      {child.title}
                    </div>
                  </Link>
                ))}
              </motion.div>
            )}
          </div>
        ))}
      </nav>
    </motion.div>
  );
};