import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { ProductForm } from '../../molecules/ProductForm/ProductForm';
import { Button } from '../../atoms/Button/Button';
import { Typography } from '../../atoms/Typography/Typography';
import { Icon } from '../../atoms/Icon/Icon';
import { DashboardProduct } from '../../../types/dashboard';

export const AddProduct: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (productData: Partial<DashboardProduct>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Creating product:', productData);
    
    // In a real app, you would make an API call here
    // const response = await createProduct(productData);
    
    navigate('/dashboard/products');
  };

  const handleCancel = () => {
    navigate('/dashboard/products');
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center space-x-4"
      >
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard/products')}
          className="flex items-center space-x-2"
        >
          <Icon icon={ArrowLeft} size={16} />
          <span>Back to Products</span>
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <ProductForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </motion.div>
    </div>
  );
};