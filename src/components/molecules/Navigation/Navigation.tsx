import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Moon, User } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { Typography } from '../../atoms/Typography/Typography';
import { Icon } from '../../atoms/Icon/Icon';
import { AuthModal } from '../../organisms/AuthModal/AuthModal';

export const Navigation: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' }
  ];

  return (
    <nav className="flex items-center justify-between">
      <Link to="/">
        <Typography variant="h3" className="hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
          MINIMAL
        </Typography>
      </Link>

      <div className="flex items-center space-x-8">
        <div className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <motion.span
                whileHover={{ y: -2 }}
                className={`text-lg transition-colors ${
                  location.pathname === item.path
                    ? 'text-black dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                }`}
              >
                {item.label}
              </motion.span>
            </Link>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Icon icon={theme === 'light' ? Moon : Sun} size={20} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsAuthModalOpen(true)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Icon icon={User} size={20} />
        </motion.button>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialType="login"
      />
    </nav>
  );
};