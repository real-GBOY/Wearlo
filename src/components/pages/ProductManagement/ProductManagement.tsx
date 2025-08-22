import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../../molecules/DataTable/DataTable';
import { Button } from '../../atoms/Button/Button';
import { Badge } from '../../atoms/Badge/Badge';
import { Typography } from '../../atoms/Typography/Typography';
import { Icon } from '../../atoms/Icon/Icon';
import { dashboardProducts } from '../../../data/dashboardData';
import { DashboardProduct } from '../../../types/dashboard';

export const ProductManagement: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(dashboardProducts);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  const handleBulkDelete = () => {
    if (selectedProducts.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
      setProducts(prev => prev.filter(p => !selectedProducts.includes(p.id)));
      setSelectedProducts([]);
    }
  };

  const columns = [
    {
      key: 'name' as const,
      label: 'Product',
      sortable: true,
      render: (value: string, item: DashboardProduct) => (
        <div className="flex items-center space-x-3">
          <img
            src={item.images[0]}
            alt={value}
            className="w-12 h-12 object-cover rounded-lg"
          />
          <div>
            <Typography variant="body" className="font-medium">
              {value}
            </Typography>
            <Typography variant="caption" className="text-gray-500">
              {item.sku}
            </Typography>
          </div>
        </div>
      )
    },
    {
      key: 'category' as const,
      label: 'Category',
      sortable: true,
      render: (value: string) => (
        <Badge variant="default">
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      )
    },
    {
      key: 'price' as const,
      label: 'Price',
      sortable: true,
      render: (value: number) => `$${value.toFixed(2)}`
    },
    {
      key: 'stock' as const,
      label: 'Stock',
      sortable: true,
      render: (value: number, item: DashboardProduct) => (
        <span className={value <= item.lowStockThreshold ? 'text-red-600 font-semibold' : ''}>
          {value}
        </span>
      )
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: string) => (
        <Badge
          variant={
            value === 'active' ? 'success' :
            value === 'inactive' ? 'error' : 'warning'
          }
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      )
    },
    {
      key: 'updatedAt' as const,
      label: 'Last Updated',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    }
  ];

  const actions = (product: DashboardProduct) => (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/product/${product.id}`);
        }}
      >
        <Icon icon={Eye} size={16} />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/dashboard/products/edit/${product.id}`);
        }}
      >
        <Icon icon={Edit} size={16} />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteProduct(product.id);
        }}
        className="text-red-600 hover:text-red-700 hover:border-red-300"
      >
        <Icon icon={Trash2} size={16} />
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h2" className="mb-2">
            Product Management
          </Typography>
          <Typography variant="body" className="text-gray-600 dark:text-gray-400">
            Manage your product catalog, inventory, and pricing
          </Typography>
        </div>
        <div className="flex items-center space-x-4">
          {selectedProducts.length > 0 && (
            <Button
              variant="outline"
              onClick={handleBulkDelete}
              className="text-red-600 hover:text-red-700 hover:border-red-300"
            >
              Delete Selected ({selectedProducts.length})
            </Button>
          )}
          <Button onClick={() => navigate('/dashboard/products/new')}>
            <Icon icon={Plus} size={16} className="mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800"
        >
          <Typography variant="caption" className="uppercase tracking-wide mb-2">
            Total Products
          </Typography>
          <Typography variant="h3">
            {products.length}
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800"
        >
          <Typography variant="caption" className="uppercase tracking-wide mb-2">
            Active Products
          </Typography>
          <Typography variant="h3">
            {products.filter(p => p.status === 'active').length}
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800"
        >
          <Typography variant="caption" className="uppercase tracking-wide mb-2">
            Low Stock Items
          </Typography>
          <Typography variant="h3" className="text-red-600 dark:text-red-400">
            {products.filter(p => p.stock <= p.lowStockThreshold).length}
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800"
        >
          <Typography variant="caption" className="uppercase tracking-wide mb-2">
            Draft Products
          </Typography>
          <Typography variant="h3">
            {products.filter(p => p.status === 'draft').length}
          </Typography>
        </motion.div>
      </div>

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <DataTable
          data={products}
          columns={columns}
          searchable
          searchPlaceholder="Search products..."
          onRowClick={(product) => navigate(`/product/${product.id}`)}
          actions={actions}
        />
      </motion.div>
    </div>
  );
};