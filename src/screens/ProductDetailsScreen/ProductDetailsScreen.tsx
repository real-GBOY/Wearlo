/** @format */

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { products } from "../../data/products";
import { ImageGallery } from "../../components/molecules/ImageGallery/ImageGallery";
import { Typography } from "../../components/atoms/Typography/Typography";
import { Button } from "../../components/atoms/Button/Button";
import { Icon } from "../../components/atoms/Icon/Icon";

export const ProductDetailsScreen: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const product = products.find((p) => p.id === id);

	if (!product) {
		return (
			<div className='container mx-auto px-6 py-20 text-center'>
				<Typography variant='h2' className='mb-4'>
					Product Not Found
				</Typography>
				<Button onClick={() => navigate("/")}>Return Home</Button>
			</div>
		);
	}

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
							{product.category}
						</Typography>
						<Typography variant='h2' className='mb-4'>
							{product.name}
						</Typography>
						<Typography
							variant='h4'
							className='text-gray-600 dark:text-gray-400'>
							${product.price.toFixed(2)}
						</Typography>
					</div>

					<div>
						<Typography variant='body'>{product.description}</Typography>
					</div>

					<div className='space-y-4'>
						<div className='grid grid-cols-3 gap-4'>
							<Button variant='outline' size='sm'>
								XS
							</Button>
							<Button variant='outline' size='sm'>
								S
							</Button>
							<Button variant='outline' size='sm'>
								M
							</Button>
						</div>
						<div className='grid grid-cols-3 gap-4'>
							<Button variant='outline' size='sm'>
								L
							</Button>
							<Button variant='outline' size='sm'>
								XL
							</Button>
							<Button variant='outline' size='sm'>
								XXL
							</Button>
						</div>
					</div>

					<div className='space-y-4'>
						<Button size='lg' className='w-full'>
							ADD TO CART
						</Button>
						<Button variant='secondary' size='lg' className='w-full'>
							ADD TO WISHLIST
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
