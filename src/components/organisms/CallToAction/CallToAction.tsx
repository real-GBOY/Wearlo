/** @format */

import React from "react";
import { motion } from "framer-motion";
import { Typography } from "../../atoms/Typography/Typography";
import { Button } from "../../atoms/Button/Button";

export const CallToAction: React.FC = () => {
	return (
		<section className='relative py-32 overflow-hidden'>
			{/* Background with proper dark/light mode */}
			<div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 dark:from-gray-100 dark:via-white dark:to-gray-200 transition-colors duration-500' />

			<div className='container mx-auto px-6 relative z-10'>
				<div className='max-w-4xl mx-auto text-center'>
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8 }}
						className='mb-8'>
						<Typography
							variant='h2'
							className='text-white dark:text-gray-900 mb-6'>
							ELEVATE YOUR
							<br />
							EVERYDAY STYLE
						</Typography>
						<Typography
							variant='body'
							className='text-gray-200 dark:text-gray-600 max-w-2xl mx-auto'>
							Join thousands who have discovered the perfect balance of comfort,
							quality, and minimalist design
						</Typography>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className='flex flex-col sm:flex-row gap-4 justify-center'>
						<Button
							variant='primary'
							size='lg'
							className='bg-white text-black hover:bg-gray-100 dark:bg-black dark:text-white dark:hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300'>
							SHOP NOW
						</Button>
						<Button
							variant='outline'
							size='lg'
							className='border-white text-white hover:bg-white hover:text-black dark:border-gray-900 dark:text-gray-900 dark:hover:bg-gray-900 dark:hover:text-white shadow-lg hover:shadow-xl transition-all duration-300'>
							VIEW LOOKBOOK
						</Button>
					</motion.div>
				</div>
			</div>
		</section>
	);
};
