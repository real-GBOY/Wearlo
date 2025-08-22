import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingBag, Package, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { StatsCard } from '../../molecules/StatsCard/StatsCard';
import { DataTable } from '../../molecules/DataTable/DataTable';
import { Card } from '../../atoms/Card/Card';
import { Typography } from '../../atoms/Typography/Typography';
import { Badge } from '../../atoms/Badge/Badge';
import { Button } from '../../atoms/Button/Button';
import { analytics, orders, dashboardProducts, notifications } from '../../../data/dashboardData';

export const Dashboard: React.FC = () => {
  const recentOrders = orders.slice(0, 5);
  const lowStockProducts = dashboardProducts.filter(p => p.stock <= p.lowStockThreshold);
  const recentNotifications = notifications.filter(n => !n.isRead).slice(0, 3);

  const orderColumns = [
    {
      key: 'id' as const,
      label: 'Order ID',
      sortable: true
    },
    {
      key: 'customerName' as const,
      label: 'Customer',
      sortable: true
    },
    {
      key: 'total' as const,
      label: 'Total',
      sortable: true,
      render: (value: number) => `$${value.toFixed(2)}`
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: string) => (
        <Badge
          variant={
            value === 'delivered' ? 'success' :
            value === 'shipped' ? 'info' :
            value === 'processing' ? 'warning' :
            value === 'cancelled' ? 'error' : 'default'
          }
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      )
    },
    {
      key: 'createdAt' as const,
      label: 'Date',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    }
  ];

  const productColumns = [
    {
      key: 'name' as const,
      label: 'Product',
      sortable: true
    },
    {
      key: 'sku' as const,
      label: 'SKU',
      sortable: true
    },
    {
      key: 'stock' as const,
      label: 'Stock',
      sortable: true,
      render: (value: number, item: any) => (
        <span className={value <= item.lowStockThreshold ? 'text-red-600 font-semibold' : ''}>
          {value}
        </span>
      )
    },
    {
      key: 'lowStockThreshold' as const,
      label: 'Threshold',
      render: (value: number) => value
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h2" className="mb-2">
            Dashboard Overview
          </Typography>
          <Typography variant="body" className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's what's happening with your store today.
          </Typography>
        </div>
        <Button>
          View Full Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <StatsCard
            title="Total Revenue"
            value={`$${analytics.totalRevenue.toLocaleString()}`}
            change={analytics.revenueGrowth}
            icon={DollarSign}
            color="green"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <StatsCard
            title="Total Orders"
            value={analytics.totalOrders}
            change={analytics.orderGrowth}
            icon={ShoppingBag}
            color="blue"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <StatsCard
            title="Total Products"
            value={analytics.totalProducts}
            icon={Package}
            color="purple"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <StatsCard
            title="Total Users"
            value={analytics.totalUsers}
            icon={Users}
            color="yellow"
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Typography variant="h3">Recent Orders</Typography>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            <DataTable
              data={recentOrders}
              columns={orderColumns}
            />
          </Card>
        </motion.div>

        {/* Notifications & Alerts */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-6"
        >
          {/* Low Stock Alert */}
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="text-red-500" size={20} />
              <Typography variant="h4" className="text-red-600 dark:text-red-400">
                Low Stock Alert
              </Typography>
            </div>
            <div className="space-y-3">
              {lowStockProducts.slice(0, 3).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div>
                    <Typography variant="body" className="font-medium text-sm">
                      {product.name}
                    </Typography>
                    <Typography variant="caption" className="text-red-600 dark:text-red-400">
                      {product.stock} units left
                    </Typography>
                  </div>
                  <Badge variant="error" size="sm">
                    Low
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4">
              View All Low Stock
            </Button>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <Typography variant="h4" className="mb-4">
              Recent Activity
            </Typography>
            <div className="space-y-3">
              {recentNotifications.map((notification) => (
                <div key={notification.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Typography variant="body" className="font-medium text-sm mb-1">
                    {notification.title}
                  </Typography>
                  <Typography variant="caption" className="text-gray-600 dark:text-gray-400">
                    {notification.message}
                  </Typography>
                  <Typography variant="caption" className="text-gray-500 dark:text-gray-500 block mt-1">
                    {new Date(notification.createdAt).toLocaleTimeString()}
                  </Typography>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Top Selling Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Typography variant="h3">Top Selling Products</Typography>
            <Button variant="outline" size="sm">
              View Analytics
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {analytics.topSellingProducts.map((product, index) => (
              <div key={product.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                    <Typography variant="h4" className="text-white dark:text-black">
                      #{index + 1}
                    </Typography>
                  </div>
                </div>
                <div className="flex-1">
                  <Typography variant="body" className="font-medium mb-1">
                    {product.name}
                  </Typography>
                  <div className="flex items-center space-x-4">
                    <Typography variant="caption" className="text-gray-600 dark:text-gray-400">
                      {product.sales} sold
                    </Typography>
                    <Typography variant="caption" className="text-green-600 dark:text-green-400 font-medium">
                      ${product.revenue.toFixed(2)}
                    </Typography>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};