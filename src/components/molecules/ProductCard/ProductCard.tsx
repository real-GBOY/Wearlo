/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Plus, Minus } from "lucide-react";
import { Product } from "../../../types";
import { Typography } from "../../atoms/Typography/Typography";
import { Button } from "../../atoms/Button/Button";
import { useCart } from "../../../contexts/CartContext";
import { useWishlist } from "../../../contexts/WishlistContext";

interface ProductCardProps {
	product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
	const navigate = useNavigate();
	const { addItem, isInCart, getItemQuantity, updateQuantity } = useCart();
	const { isInWishlist, toggleItem } = useWishlist();
	const [isHovered, setIsHovered] = useState(false);

	const handleCardClick = () => {
		navigate(`/product/${product.id}`);
	};

	const handleAddToCart = (e: React.MouseEvent) => {
		e.stopPropagation();
		const currentQuantity = getItemQuantity(product.id);
		if (currentQuantity === 0) {
			addItem(product, 1);
		} else {
			updateQuantity(product.id, currentQuantity + 1);
		}
	};

	const handleQuantityChange = (e: React.MouseEvent, change: number) => {
		e.stopPropagation();
		const currentQuantity = getItemQuantity(product.id);
		const newQuantity = Math.max(0, currentQuantity + change);
		if (newQuantity === 0) {
			updateQuantity(product.id, 0);
		} else {
			updateQuantity(product.id, newQuantity);
		}
	};

	const handleWishlistToggle = (e: React.MouseEvent) => {
		e.stopPropagation();
		toggleItem(product);
	};

	const currentQuantity = getItemQuantity(product.id);
	const isWishlisted = isInWishlist(product.id);

	return (
		<motion.div
			whileHover={{ y: -8 }}
			transition={{ duration: 0.3 }}
			className='cursor-pointer group relative'
			onClick={handleCardClick}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}>
			<div className='relative overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-[3/4]'>
				<motion.img
					whileHover={{ scale: 1.05 }}
					transition={{ duration: 0.4 }}
					src={product.images?.[0] || "/placeholder-product.jpg"}
					alt={product.name}
					className='w-full h-full object-cover'
					onError={(e) => {
						const target = e.target as HTMLImageElement;
						target.src = "/placeholder-product.jpg";
					}}
				/>
				<div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300' />

				{/* Wishlist Button */}
				<motion.button
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
					transition={{ duration: 0.2 }}
					onClick={handleWishlistToggle}
					className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
						isWishlisted
							? "bg-red-500 text-white hover:bg-red-600"
							: "bg-white/90 dark:bg-gray-800/90 text-gray-600 hover:bg-white dark:hover:bg-gray-800"
					}`}>
					<Heart size={18} className={isWishlisted ? "fill-current" : ""} />
				</motion.button>

				{/* Quick Add to Cart */}
				{currentQuantity === 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
						transition={{ duration: 0.2 }}
						className='absolute bottom-3 left-3 right-3'>
						<Button
							onClick={handleAddToCart}
							size='sm'
							className='w-full bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-800'>
							<ShoppingCart size={16} className='mr-2' />
							Add to Cart
						</Button>
					</motion.div>
				)}

				{/* Quantity Controls */}
				{currentQuantity > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
						transition={{ duration: 0.2 }}
						className='absolute bottom-3 left-3 right-3'>
						<div className='flex items-center justify-center space-x-2 bg-white/90 dark:bg-gray-800/90 rounded-lg p-2'>
							<button
								onClick={(e) => handleQuantityChange(e, -1)}
								className='p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'>
								<Minus size={14} />
							</button>
							<span className='text-sm font-medium min-w-[2rem] text-center'>
								{currentQuantity}
							</span>
							<button
								onClick={(e) => handleQuantityChange(e, 1)}
								className='p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'>
								<Plus size={14} />
							</button>
						</div>
					</motion.div>
				)}
			</div>

			<div className='pt-4 space-y-2'>
				<Typography
					variant='h4'
					className='group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors'>
					{product.name}
				</Typography>
				<Typography variant='body' className='font-semibold'>
					${product.price.toFixed(2)}
				</Typography>
			</div>
		</motion.div>
	);
};
