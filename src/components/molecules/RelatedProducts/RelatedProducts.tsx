/** @format */

import React from "react";
import { motion } from "framer-motion";
import { Product } from "../../../types";
import { ProductCard } from "../ProductCard/ProductCard";
import { Typography } from "../../atoms/Typography/Typography";

interface RelatedProductsProps {
	products: Product[];
	title?: string;
	isLoading?: boolean;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
	products,
	title = "Related Products",
	isLoading = false,
}) => {
	if (isLoading) {
		return (
			<section className='py-16 bg-gray-50 w-full'>
				<div className='w-full px-6'>
					<div className='text-center mb-12'>
						<div className='h-8 bg-gray-200 rounded animate-pulse mb-4'></div>
						<div className='h-4 bg-gray-200 rounded animate-pulse max-w-2xl mx-auto'></div>
					</div>
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
						{Array.from({ length: 4 }).map((_, index) => (
							<div key={index} className='animate-pulse'>
								<div className='bg-gray-200 aspect-[3/4] rounded-lg mb-4'></div>
								<div className='h-4 bg-gray-200 rounded mb-2'></div>
								<div className='h-6 bg-gray-200 rounded'></div>
							</div>
						))}
					</div>
				</div>
			</section>
		);
	}

	if (!products || products.length === 0) {
		// Show a message when no related products are found
		return (
			<section className='py-16 bg-gray-50 w-full'>
				<div className='w-full px-6 text-center'>
					<Typography variant='h2' className='mb-4'>
						{title}
					</Typography>
					<Typography
						variant='body'
						className='text-gray-600 max-w-2xl mx-auto mb-8'>
						No related products found at the moment.
					</Typography>
					<Typography variant='body' className='text-sm text-gray-500'>
						Check back later for more products in this category.
					</Typography>
				</div>
			</section>
		);
	}

	return (
		<section className='py-16 bg-gray-50 w-full'>
			<div className='w-full px-6'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className='text-center mb-12'>
					<Typography variant='h2' className='mb-4'>
						{title}
					</Typography>
					<Typography
						variant='body'
						className='text-gray-600 max-w-2xl mx-auto'>
						Discover more products you might love from the same category
					</Typography>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
					{products.map((product, index) => (
						<motion.div
							key={product.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.1 * index }}>
							<ProductCard product={product} />
						</motion.div>
					))}
				</motion.div>

				{products.length === 4 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.6 }}
						className='text-center mt-12'>
						<Typography variant='body' className='text-gray-600'>
							Showing {products.length} related products
						</Typography>
					</motion.div>
				)}
			</div>
		</section>
	);
};
