/** @format */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	X,
	Package,
	DollarSign,
	Tag,
	Calendar,
	Image as ImageIcon,
} from "lucide-react";
import { Product } from "../../../types";
import Badge from "../../atoms/Badge";

interface ProductViewModalProps {
	product: Product | null;
	isOpen: boolean;
	onClose: () => void;
}

const ProductViewModal: React.FC<ProductViewModalProps> = ({
	product,
	isOpen,
	onClose,
}) => {
	if (!product) return null;

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50'
					onClick={onClose}>
					<motion.div
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.9, opacity: 0 }}
						className='bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'
						onClick={(e) => e.stopPropagation()}>
						{/* Header */}
						<div className='flex items-center justify-between p-6 border-b border-gray-200'>
							<h2 className='text-2xl font-bold text-gray-900'>
								Product Details
							</h2>
							<button
								onClick={onClose}
								className='p-2 rounded-lg hover:bg-gray-100 transition-colors'>
								<X className='h-6 w-6 text-gray-500' />
							</button>
						</div>

						{/* Content */}
						<div className='p-6'>
							<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
								{/* Left Column - Images */}
								<div className='space-y-4'>
									<h3 className='text-lg font-semibold text-gray-900 flex items-center'>
										<ImageIcon className='h-5 w-5 mr-2' />
										Product Images
									</h3>
									{product.images && product.images.length > 0 ? (
										<div className='grid grid-cols-2 gap-4'>
											{product.images.map((image, index) => (
												<div
													key={index}
													className='aspect-square rounded-lg overflow-hidden border border-gray-200'>
													<img
														src={image}
														alt={`${product.name} - Image ${index + 1}`}
														className='w-full h-full object-cover'
														onError={(e) => {
															const target = e.target as HTMLImageElement;
															target.src =
																"https://via.placeholder.com/300x300?text=No+Image";
														}}
													/>
												</div>
											))}
										</div>
									) : (
										<div className='aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center'>
											<div className='text-center text-gray-500'>
												<ImageIcon className='h-12 w-12 mx-auto mb-2' />
												<p>No images available</p>
											</div>
										</div>
									)}
								</div>

								{/* Right Column - Details */}
								<div className='space-y-6'>
									{/* Basic Info */}
									<div className='space-y-4'>
										<h3 className='text-lg font-semibold text-gray-900 flex items-center'>
											<Package className='h-5 w-5 mr-2' />
											Basic Information
										</h3>

										<div className='space-y-3'>
											<div>
												<label className='block text-sm font-medium text-gray-600 mb-1'>
													Product Name
												</label>
												<p className='text-lg text-gray-900 font-medium'>
													{product.name}
												</p>
											</div>

											<div>
												<label className='block text-sm font-medium text-gray-600 mb-1'>
													Description
												</label>
												<p className='text-gray-700'>
													{product.description || "No description available"}
												</p>
											</div>

											<div className='grid grid-cols-2 gap-4'>
												<div>
													<label className='block text-sm font-medium text-gray-600 mb-1'>
														Category
													</label>
													<p className='text-gray-900'>
														{product.categoryName || "Uncategorized"}
													</p>
												</div>
												<div>
													<label className='block text-sm font-medium text-gray-600 mb-1'>
														Status
													</label>
													{product.stock === 0 ? (
														<Badge variant='destructive'>Out of Stock</Badge>
													) : product.stock <= 10 ? (
														<Badge variant='warning'>Low Stock</Badge>
													) : (
														<Badge variant='success'>In Stock</Badge>
													)}
												</div>
											</div>
										</div>
									</div>

									{/* Pricing & Stock */}
									<div className='space-y-4'>
										<h3 className='text-lg font-semibold text-gray-900 flex items-center'>
											<DollarSign className='h-5 w-5 mr-2' />
											Pricing & Stock
										</h3>

										<div className='grid grid-cols-2 gap-4'>
											<div>
												<label className='block text-sm font-medium text-gray-600 mb-1'>
													Price
												</label>
												<p className='text-2xl font-bold text-green-600'>
													${product.price.toFixed(2)}
												</p>
											</div>
											<div>
												<label className='block text-sm font-medium text-gray-600 mb-1'>
													Discount
												</label>
												<p className='text-lg text-gray-900'>
													{product.discount
														? `${product.discount}%`
														: "No discount"}
												</p>
											</div>
											<div>
												<label className='block text-sm font-medium text-gray-600 mb-1'>
													Stock Level
												</label>
												<p
													className={`text-lg font-semibold ${
														product.stock === 0
															? "text-red-600"
															: product.stock <= 10
															? "text-orange-600"
															: "text-green-600"
													}`}>
													{product.stock} units
												</p>
											</div>
											<div>
												<label className='block text-sm font-medium text-gray-600 mb-1'>
													Total Value
												</label>
												<p className='text-lg font-semibold text-gray-900'>
													${(product.price * product.stock).toFixed(2)}
												</p>
											</div>
										</div>
									</div>

									{/* Sizes */}
									{product.sizes && product.sizes.length > 0 && (
										<div className='space-y-4'>
											<h3 className='text-lg font-semibold text-gray-900 flex items-center'>
												<Tag className='h-5 w-5 mr-2' />
												Available Sizes
											</h3>
											<div className='grid grid-cols-2 gap-4'>
												{product.sizes.map((size, index) => (
													<div
														key={index}
														className='p-3 border border-gray-200 rounded-lg'>
														<div className='flex justify-between items-center'>
															<span className='font-medium text-gray-900'>
																{size.label}
															</span>
															<span className='text-sm text-gray-600'>
																{size.stock} in stock
															</span>
														</div>
													</div>
												))}
											</div>
										</div>
									)}

									{/* Timestamps */}
									<div className='space-y-4'>
										<h3 className='text-lg font-semibold text-gray-900 flex items-center'>
											<Calendar className='h-5 w-5 mr-2' />
											Timestamps
										</h3>

										<div className='grid grid-cols-2 gap-4'>
											<div>
												<label className='block text-sm font-medium text-gray-600 mb-1'>
													Created
												</label>
												<p className='text-gray-700'>
													{formatDate(product.createdAt)}
												</p>
											</div>
											{product.updatedAt && (
												<div>
													<label className='block text-sm font-medium text-gray-600 mb-1'>
														Last Updated
													</label>
													<p className='text-gray-700'>
														{formatDate(product.updatedAt)}
													</p>
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Footer */}
						<div className='flex items-center justify-end space-x-3 p-6 border-t border-gray-200'>
							<button
								onClick={onClose}
								className='px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'>
								Close
							</button>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default ProductViewModal;
