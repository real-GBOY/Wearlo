import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../../types';
import { Typography } from '../../atoms/Typography/Typography';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="cursor-pointer group"
      onClick={handleClick}
    >
      <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-[3/4]">
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
      </div>
      
      <div className="pt-4 space-y-2">
        <Typography variant="h4" className="group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
          {product.name}
        </Typography>
        <Typography variant="body" className="font-semibold">
          ${product.price.toFixed(2)}
        </Typography>
      </div>
    </motion.div>
  );
};