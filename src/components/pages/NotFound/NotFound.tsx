import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Typography } from '../../atoms/Typography/Typography';
import { Button } from '../../atoms/Button/Button';
import { Icon } from '../../atoms/Icon/Icon';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const numberVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center px-6 py-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto text-center"
      >
        {/* Large 404 Number */}
        <motion.div
          variants={numberVariants}
          className="mb-8"
        >
          <Typography
            variant="h1"
            className="text-8xl md:text-9xl lg:text-[12rem] font-black leading-none tracking-tighter"
          >
            404
          </Typography>
        </motion.div>

        {/* Error Message */}
        <motion.div variants={itemVariants} className="mb-8">
          <Typography variant="h2" className="mb-4">
            PAGE NOT FOUND
          </Typography>
          <Typography variant="body" className="max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </Typography>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Button
            onClick={() => navigate('/')}
            size="lg"
            className="flex items-center space-x-2"
          >
            <Icon icon={Home} size={20} />
            <span>GO HOME</span>
          </Button>
          
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            size="lg"
            className="flex items-center space-x-2"
          >
            <Icon icon={ArrowLeft} size={20} />
            <span>GO BACK</span>
          </Button>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          variants={itemVariants}
          className="relative"
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-5 dark:opacity-10">
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="w-64 h-64 border border-black dark:border-white rounded-full"
            />
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="relative z-10"
          >
            <Typography variant="caption" className="uppercase tracking-widest">
              Error • Page Not Found • 404
            </Typography>
          </motion.div>
        </motion.div>

        {/* Search Suggestion */}
        <motion.div
          variants={itemVariants}
          className="mt-12 p-6 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900"
        >
          <div className="flex items-center justify-center space-x-2 mb-3">
            <Icon icon={Search} size={20} className="text-gray-400" />
            <Typography variant="h4">Looking for something specific?</Typography>
          </div>
          <Typography variant="body" className="text-sm">
            Try searching our products or browse our featured collections
          </Typography>
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="mt-4"
          >
            EXPLORE PRODUCTS
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};