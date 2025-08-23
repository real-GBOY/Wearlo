/** @format */

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, ShoppingCart } from "lucide-react";
import { useProduct } from "../../hooks/useProducts";
import { ImageGallery } from "../../components/molecules/ImageGallery/ImageGallery";
import { Typography } from "../../components/atoms/Typography/Typography";
import { Button } from "../../components/atoms/Button/Button";
import { Icon } from "../../components/atoms/Icon/Icon";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";

export const ProductDetailsScreen: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { addItem, getItemQuantity, updateQuantity } = useCart();
	const { isInWishlist, toggleItem } = useWishlist();
	const [selectedSize, setSelectedSize] = useState<string>("");
	const [quantity, setQuantity] = useState(1);

	const { data: product, isLoading, error } = useProduct(id || "");

	// Loading state
	if (isLoading) {
		return (
			<div className='container mx-auto px-6 py-20 text-center'>
				<Typography variant='h2' className='mb-4'>
					Loading Product...
				</Typography>
				<Typography variant='body' className='text-gray-600 dark:text-gray-400'>
					Please wait while we fetch the product details.
				</Typography>
			</div>
		);
	}

	// Error state
	if (error || !product) {
		return (
			<div className='container mx-auto px-6 py-20 text-center'>
				<Typography variant='h2' className='mb-4 text-red-600'>
					Product Not Found
				</Typography>
				<Typography
					variant='body'
					className='mb-6 text-gray-600 dark:text-gray-400'>
					{error
						? "Failed to load product."
						: "The product you're looking for doesn't exist."}
				</Typography>
				<Button onClick={() => navigate("/")}>Return Home</Button>
			</div>
		);
	}

	// Use product.sizes if available, otherwise fallback to default sizes
	const sizes = product.sizes?.map((size) => size.label) || [
		"XS",
		"S",
		"M",
		"L",
		"XL",
		"XXL",
	];
	const currentCartQuantity = getItemQuantity(product.id);
	const isWishlisted = isInWishlist(product.id);

	const handleAddToCart = () => {
		if (!selectedSize) {
			// TODO: Show size selection error
			return;
		}
		addItem(product, quantity);
	};

	const handleWishlistToggle = () => {
		toggleItem(product);
	};

	const handleSizeSelect = (size: string) => {
		setSelectedSize(size);
	};

	const handleQuantityChange = (change: number) => {
		const newQuantity = Math.max(1, quantity + change);
		setQuantity(newQuantity);
	};

	return (
		<div className='container mx-auto px-6 py-12'>
			<motion.div
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.6 }}
				className='mb-8'>
				<Button
					variant='outline'
					onClick={() => navigate(-1)}
					className='flex items-center space-x-2'>
					<Icon icon={ArrowLeft} size={16} />
					<span>Back</span>
				</Button>
			</motion.div>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-16'>
				<motion.div
					initial={{ opacity: 0, x: -50 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.8 }}>
					<ImageGallery images={product.images} alt={product.name} />
				</motion.div>

				<motion.div
					initial={{ opacity: 0, x: 50 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
					className='space-y-8'>
					<div>
						<Typography
							variant='caption'
							className='uppercase tracking-wide mb-2'>
							{product.categoryName || product.category}
						</Typography>
						<Typography variant='h2' className='mb-4'>
							{product.name}
						</Typography>
						<Typography
							variant='h4'
							className='text-gray-600 dark:text-gray-400'>
							${product.price.toFixed(2)}
						</Typography>
						{product.discount && (
							<Typography
								variant='body'
								className='text-green-600 dark:text-green-400'>
								{product.discount}% OFF
							</Typography>
						)}
					</div>

					<div>
						<Typography variant='body'>{product.description}</Typography>
					</div>

					{/* Stock Information */}
					<div className='space-y-2'>
						<Typography
							variant='body'
							className='text-gray-600 dark:text-gray-400'>
							Stock: {product.stock} units available
						</Typography>
					</div>

					{/* Size Selection */}
					<div className='space-y-4'>
						<Typography variant='h4' className='mb-2'>
							Select Size
						</Typography>
						<div className='grid grid-cols-3 gap-4'>
							{sizes.map((size) => (
								<Button
									key={size}
									variant={selectedSize === size ? "primary" : "outline"}
									size='sm'
									onClick={() => handleSizeSelect(size)}
									className='h-12'>
									{size}
								</Button>
							))}
						</div>
					</div>

					{/* Quantity Selection */}
					<div className='space-y-4'>
						<Typography variant='h4' className='mb-2'>
							Quantity
						</Typography>
						<div className='flex items-center space-x-4'>
							<div className='flex items-center border border-gray-300 dark:border-gray-600 rounded-lg'>
								<button
									onClick={() => handleQuantityChange(-1)}
									disabled={quantity <= 1}
									className='px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50'>
									-
								</button>
								<span className='px-4 py-2 min-w-[3rem] text-center'>
									{quantity}
								</span>
								<button
									onClick={() => handleQuantityChange(1)}
									disabled={quantity >= product.stock}
									className='px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50'>
									+
								</button>
							</div>
							{currentCartQuantity > 0 && (
								<Typography
									variant='body'
									className='text-gray-600 dark:text-gray-400'>
									{currentCartQuantity} in cart
								</Typography>
							)}
						</div>
					</div>

					<div className='space-y-4'>
						<Button
							size='lg'
							className='w-full'
							onClick={handleAddToCart}
							disabled={!selectedSize || product.stock === 0}>
							<Icon icon={ShoppingCart} size={20} className='mr-2' />
							{product.stock === 0
								? "OUT OF STOCK"
								: currentCartQuantity > 0
								? "UPDATE CART"
								: "ADD TO CART"}
						</Button>
						<Button
							variant='secondary'
							size='lg'
							className='w-full'
							onClick={handleWishlistToggle}>
							<Icon
								icon={Heart}
								size={20}
								className={`mr-2 ${isWishlisted ? "fill-current" : ""}`}
							/>
							{isWishlisted ? "REMOVE FROM WISHLIST" : "ADD TO WISHLIST"}
						</Button>
					</div>

					<div className='pt-8 border-t border-gray-200 dark:border-gray-800'>
						<div className='space-y-4'>
							<div>
								<Typography variant='h4' className='mb-2'>
									Shipping & Returns
								</Typography>
								<Typography variant='body' className='text-sm'>
									Free shipping on orders over $100. 30-day returns accepted.
								</Typography>
							</div>
							<div>
								<Typography variant='h4' className='mb-2'>
									Care Instructions
								</Typography>
								<Typography variant='body' className='text-sm'>
									Machine wash cold, tumble dry low, iron on low heat if needed.
								</Typography>
							</div>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
};
