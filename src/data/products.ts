import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Essential White Tee',
    price: 29.99,
    description: 'A timeless essential crafted from premium cotton. This minimalist white t-shirt features a relaxed fit and clean lines, perfect for effortless everyday style.',
    images: [
      'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1030945/pexels-photo-1030945.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'basics',
    featured: true
  },
  {
    id: '2',
    name: 'Black Minimalist Jacket',
    price: 149.99,
    description: 'Sophisticated outerwear designed for the modern individual. This black jacket combines contemporary aesthetics with premium materials for versatile styling.',
    images: [
      'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1040173/pexels-photo-1040173.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'outerwear',
    featured: true
  },
  {
    id: '3',
    name: 'Grey Urban Hoodie',
    price: 79.99,
    description: 'Contemporary comfort meets urban design. This premium hoodie features a streamlined silhouette and soft fleece interior for all-day comfort.',
    images: [
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1040172/pexels-photo-1040172.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'casual',
    featured: true
  },
  {
    id: '4',
    name: 'Classic White Sneakers',
    price: 89.99,
    description: 'Clean, minimal footwear designed for everyday versatility. These white sneakers feature premium leather construction and timeless silhouette.',
    images: [
      'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2529147/pexels-photo-2529147.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'footwear',
    featured: false
  }
];