/** @format */

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, ShoppingCart } from "lucide-react";
import { useProduct, useRelatedProducts } from "../../hooks/useProducts";
import { ImageGallery } from "../../components/molecules/ImageGallery/ImageGallery";
import { RelatedProducts } from "../../components/molecules/RelatedProducts/RelatedProducts";
import { Typography } from "../../components/atoms/Typography/Typography";
import { Button } from "../../components/atoms/Button/Button";
import { Icon } from "../../components/atoms/Icon/Icon";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
import { SizeGuide } from "../../components/organisms/SizeGuide/SizeGuide";

export const ProductDetailsScreen: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { addItem, getItemQuantity, updateQuantity } = useCart();
	const { isInWishlist, toggleItem } = useWishlist();
	const [selectedSize, setSelectedSize] = useState<string>("");
	const [quantity, setQuantity] = useState(1);

	const { data: product, isLoading, error } = useProduct(id || "");

	// Helper function to safely extract category ID
	const getCategoryId = (product: any) => {
		if (!product?.category) return "";
		if (typeof product.category === "string") return product.category;
		if (typeof product.category === "object" && product.category._id)
			return product.category._id;
		return "";
	};

	// Helper function to get category name for display
	const getCategoryName = (product: any) => {
		// First try to use the categoryName if it's already fetched
		if (product?.categoryName) return product.categoryName;

		// If category is an object, use its name
		if (typeof product?.category === "object" && product.category?.name) {
			return product.category.name;
		}

		// If category is a string (ID), we'll show a generic message
		if (typeof product?.category === "string") {
			return "this category";
		}

		return "this category";
	};

	// Only fetch related products when we have a product loaded
	const categoryId = product ? getCategoryId(product) : "";
	console.log("Product:", product);
	console.log("Category ID for related products:", categoryId);
	console.log("Product ID:", id);

	const { data: relatedProducts, isLoading: relatedLoading } =
		useRelatedProducts(categoryId, id || "", 4);

	// Debug: Log related products data
	console.log("Related products data:", relatedProducts);
	console.log("Related products loading:", relatedLoading);

	// Loading state
	if (isLoading) {
		return (
			<div className='container mx-auto px-6 py-20 text-center'>
				<Typography variant='h2' className='mb-4'>
					Loading Product...
				</Typography>
				<Typography variant='body' className='text-gray-600'>
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
				<Typography variant='body' className='mb-6 text-gray-600'>
					{error
						? "Failed to load product."
						: "The product you're looking for doesn't exist."}
				</Typography>
				<Button onClick={() => navigate("/")}>Return Home</Button>
			</div>
		);
	}

	// Use product.sizes if available, otherwise fallback to default sizes
	const sizes = product.sizes || [
		{ label: "XS", stock: 0 },
		{ label: "S", stock: 0 },
		{ label: "M", stock: 0 },
		{ label: "L", stock: 0 },
		{ label: "XL", stock: 0 },
		{ label: "XXL", stock: 0 },
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

	const handleSizeSelect = (sizeLabel: string) => {
		setSelectedSize(sizeLabel);
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

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
				<motion.div
					initial={{ opacity: 0, x: -50 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.8 }}
					className='lg:col-span-2'>
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
							{product.categoryName ||
								(typeof product.category === "string" ? product.category : "")}
						</Typography>
						<Typography variant='h2' className='mb-4'>
							{product.name}
						</Typography>
						<Typography variant='h4' className='text-gray-600'>
							{product.discount && product.discount > 0 ? (
								<div>
									<span className='text-2xl text-gray-500 line-through'>
										EGP {product.price.toFixed(2)}
									</span>
									<span className='text-4xl font-bold text-green-600 ml-3'>
										EGP{" "}
										{(
											product.price -
											(product.price * product.discount) / 100
										).toFixed(2)}
									</span>
									<div className='text-lg text-green-600 mt-2'>
										{product.discount}% OFF
									</div>
									<div className='text-sm text-gray-500 mt-1'>
										You save: EGP{" "}
										{((product.price * product.discount) / 100).toFixed(2)}
									</div>
								</div>
							) : (
								<span className='text-4xl font-bold text-gray-900'>
									EGP {product.price.toFixed(2)}
								</span>
							)}
						</Typography>
					</div>

					<div>
						<Typography variant='body'>{product.description}</Typography>
					</div>

					{/* Size Selection */}
					<div className='space-y-4'>
						<Typography variant='h4' className='mb-2'>
							Select Size
						</Typography>
						<div className='grid grid-cols-3 gap-4'>
							{sizes.map((size) => (
								<div key={size.label} className='relative'>
									<Button
										variant={
											selectedSize === size.label ? "primary" : "outline"
										}
										size='sm'
										onClick={() => handleSizeSelect(size.label)}
										disabled={size.stock === 0}
										className={`h-12 w-full relative overflow-hidden ${
											size.stock === 0
												? "opacity-50 cursor-not-allowed bg-gray-100 border-gray-300"
												: ""
										}`}>
										<div className='text-center'>
											<div className='font-medium'>{size.label}</div>
										</div>
										{/* Diagonal line for out-of-stock sizes */}
										{size.stock === 0 && (
											<div className='absolute inset-0 flex items-center justify-center'>
												<div className='w-full h-0.5 bg-gray-400 transform rotate-45'></div>
											</div>
										)}
									</Button>
								</div>
							))}
						</div>
						{/* Warning for out-of-stock selected size */}
						{selectedSize &&
							(() => {
								const selectedSizeObj = sizes.find(
									(s) => s.label === selectedSize
								);
								if (selectedSizeObj && selectedSizeObj.stock === 0) {
									return (
										<div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
											<div className='flex items-center text-red-800'>
												<span className='text-sm font-medium'>⚠️ Warning:</span>
												<span className='text-sm ml-2'>
													Size {selectedSize} is out of stock
												</span>
											</div>
										</div>
									);
								}
								return null;
							})()}
					</div>

					{/* Quantity Selection */}
					<div className='space-y-4'>
						<Typography variant='h4' className='mb-2'>
							Quantity
						</Typography>
						<div className='flex items-center space-x-4'>
							<div className='flex items-center border border-gray-300 rounded-lg'>
								<button
									onClick={() => handleQuantityChange(-1)}
									disabled={quantity <= 1}
									className='px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50'>
									-
								</button>
								<span className='px-4 py-2 min-w-[3rem] text-center'>
									{quantity}
								</span>
								<button
									onClick={() => handleQuantityChange(1)}
									disabled={quantity >= product.stock}
									className='px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50'>
									+
								</button>
							</div>
							{currentCartQuantity > 0 && (
								<Typography variant='body' className='text-gray-600'>
									{currentCartQuantity} in cart
								</Typography>
							)}
						</div>
					</div>

					<div className='space-y-4'>
						<Button
							size='lg'
							className='w-full relative overflow-hidden bg-black text-white group'
							onClick={handleAddToCart}
							disabled={!selectedSize || product.stock === 0}>
							{/* Hover fill effect */}
							<div className='absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-in-out'></div>
							{/* Button content */}
							<div className='relative z-10 flex items-center justify-center text-white group-hover:text-black transition-colors duration-1000'>
								<Icon icon={ShoppingCart} size={20} className='mr-2' />
								{product.stock === 0
									? "OUT OF STOCK"
									: currentCartQuantity > 0
									? "UPDATE CART"
									: "ADD TO CART"}
							</div>
						</Button>
						<Button
							variant='secondary'
							size='lg'
							className='w-full relative overflow-hidden group'
							onClick={handleWishlistToggle}>
							{/* Hover fill effect */}
							<div className='absolute inset-0 bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-in-out'></div>
							{/* Button content */}
							<div className='relative z-10 flex items-center justify-center text-gray-900 group-hover:text-white transition-colors duration-1000 ease-in-out'>
								<Icon
									icon={Heart}
									size={20}
									className={`mr-2 ${isWishlisted ? "fill-current" : ""}`}
								/>
								{isWishlisted ? "REMOVE FROM WISHLIST" : "ADD TO WISHLIST"}
							</div>
						</Button>
					</div>

					<div className='pt-8 border-t border-gray-200'>
						<div className='space-y-4'>
							<div>
								<Typography variant='h4' className='mb-2'>
									Shipping & Returns
								</Typography>
								<Typography variant='body' className='text-sm'>
									Free shipping on orders over EGP 100. 30-day returns accepted.
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

			{/* Size Guide Section */}
			<SizeGuide />

			{/* Related Products Section */}
			<RelatedProducts
				products={relatedProducts || []}
				title={`More from ${getCategoryName(product)}`}
				isLoading={relatedLoading}
			/>

			{/* Fallback: Show some featured products if no related products */}
			{(!relatedProducts || relatedProducts.length === 0) && (
				<div className='py-16 bg-gray-50'>
					<div className='container mx-auto px-6 text-center'>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							className='mb-12'>
							<Typography variant='h2' className='mb-4'>
								You Might Also Like
							</Typography>
							<Typography
								variant='body'
								className='text-gray-600 max-w-2xl mx-auto'>
								Explore our collection of amazing products
							</Typography>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}>
							<Button
								variant='outline'
								size='lg'
								onClick={() => navigate("/products")}
								className='inline-flex items-center space-x-2'>
								<span>Browse All Products</span>
								<Icon icon={ArrowLeft} size={16} className='rotate-180' />
							</Button>
						</motion.div>
					</div>
				</div>
			)}
		</div>
	);
};
