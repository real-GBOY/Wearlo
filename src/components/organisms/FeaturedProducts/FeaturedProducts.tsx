/** @format */

import React from "react";
import { motion } from "framer-motion";
import { useProducts } from "../../../hooks/useProducts";
import { ProductCard } from "../../molecules/ProductCard/ProductCard";
import { Typography } from "../../atoms/Typography/Typography";

export const FeaturedProducts: React.FC = () => {
	const { data: productsData, isLoading, error } = useProducts(1, 50);

	const products = productsData?.items || [];
	const featuredProducts = products.filter((product) => product.featured);

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 30 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.6 },
		},
	};

	// Loading state
	if (isLoading) {
		return (
			<section className='py-20 bg-white transition-colors'>
				<div className='container mx-auto px-6'>
					<div className='text-center'>
						<Typography variant='h2' className='mb-4'>
							Loading Featured Products...
						</Typography>
					</div>
				</div>
			</section>
		);
	}

	// Error state
	if (error) {
		return (
			<section className='py-20 bg-white transition-colors'>
				<div className='container mx-auto px-6'>
					<div className='text-center'>
						<Typography variant='h2' className='mb-4 text-red-600'>
							Error Loading Products
						</Typography>
						<Typography variant='body'>
							Please try refreshing the page.
						</Typography>
					</div>
				</div>
			</section>
		);
	}

	// No featured products
	if (featuredProducts.length === 0) {
		return (
			<section className='py-20 bg-white transition-colors'>
				<div className='container mx-auto px-6'>
					<div className='text-center'>
						<Typography variant='h2' className='mb-4'>
							No Featured Products Available
						</Typography>
						<Typography variant='body'>
							Check back soon for our latest featured items.
						</Typography>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className='py-20 bg-white transition-colors'>
			<div className='container mx-auto px-6'>
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className='text-center mb-16'>
					<Typography variant='h2' className='mb-4'>
						FEATURED
					</Typography>
					<Typography variant='body' className='max-w-2xl mx-auto'>
						Carefully selected pieces that embody our commitment to quality and
						timeless design
					</Typography>
				</motion.div>

				<motion.div
					variants={containerVariants}
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true }}
					className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12'>
					{featuredProducts.map((product) => (
						<motion.div key={product.id} variants={itemVariants}>
							<ProductCard product={product} />
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
};
