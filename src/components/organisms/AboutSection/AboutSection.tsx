/** @format */

import React from "react";
import { motion } from "framer-motion";
import { Typography } from "../../atoms/Typography/Typography";
import { Button } from "../../atoms/Button/Button";
import { Icon } from "../../atoms/Icon/Icon";
import { Heart, Shield, Star, Zap } from "lucide-react";

export const AboutSection: React.FC = () => {
	const features = [
		{
			icon: Heart,
			title: "Made with Love",
			description:
				"Every piece is crafted with attention to detail and passion for quality.",
		},
		{
			icon: Shield,
			title: "Premium Quality",
			description:
				"We use only the finest materials to ensure durability and comfort.",
		},
		{
			icon: Star,
			title: "Timeless Design",
			description:
				"Classic styles that never go out of fashion, designed for the modern individual.",
		},
		{
			icon: Zap,
			title: "Fast Delivery",
			description:
				"Quick and reliable shipping to get your new pieces to you as soon as possible.",
		},
	];

	return (
		<section className='py-20 bg-gray-50 dark:bg-gray-900'>
			<div className='container mx-auto px-6'>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
					{/* Left Column - Story */}
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8 }}
						className='space-y-6'>
						<Typography variant='h2' className='mb-6'>
							Our Story
						</Typography>
						<Typography
							variant='body'
							className='text-gray-600 dark:text-gray-400 mb-4'>
							Founded in 2020, Wearlo began with a simple mission: to create
							clothing that combines timeless elegance with modern comfort. We
							believe that great style shouldn't come at the expense of comfort
							or sustainability.
						</Typography>
						<Typography
							variant='body'
							className='text-gray-600 dark:text-gray-400 mb-6'>
							Every piece in our collection is thoughtfully designed and
							carefully crafted, ensuring that you not only look great but feel
							confident and comfortable in everything you wear.
						</Typography>
						<Button variant='outline' size='lg'>
							Learn More About Us
						</Button>
					</motion.div>

					{/* Right Column - Features Grid */}
					<motion.div
						initial={{ opacity: 0, x: 50 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
						{features.map((feature, index) => (
							<motion.div
								key={feature.title}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: index * 0.1 }}
								className='text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow'>
								<div className='inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4'>
									<Icon
										icon={feature.icon}
										size={28}
										className='text-blue-600 dark:text-blue-400'
									/>
								</div>
								<Typography variant='h4' className='mb-2'>
									{feature.title}
								</Typography>
								<Typography
									variant='body'
									className='text-gray-600 dark:text-gray-400 text-sm'>
									{feature.description}
								</Typography>
							</motion.div>
						))}
					</motion.div>
				</div>
			</div>
		</section>
	);
};
