/** @format */

import React from "react";
import { motion } from "framer-motion";
import { Typography } from "../../atoms/Typography/Typography";
import { Button } from "../../atoms/Button/Button";

export const Hero: React.FC = () => {
	return (
		<section className='relative min-h-screen flex items-center'>
			<div className='absolute inset-0 bg-gradient-to-br from-white via-gray-100 to-black transition-colors duration-500' />

			<div className='container mx-auto px-6 relative z-10'>
				<div className='max-w-4xl'>
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}>
						<Typography variant='h1' className='mb-6'>
							WEARLO
							<br />
							<span className='text-gray-600'>ESSENTIALS</span>
						</Typography>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.4 }}
						className='mb-8'>
						<Typography variant='body' className='max-w-2xl'>
							Discover our curated collection of timeless pieces designed for
							the modern individual. Clean lines, premium materials, and
							thoughtful design.
						</Typography>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.6 }}>
						<Button size='lg' className='mr-4 mb-4'>
							EXPLORE COLLECTION
						</Button>
						<Button variant='secondary' size='lg' className='mb-4'>
							LEARN MORE
						</Button>
					</motion.div>
				</div>
			</div>
		</section>
	);
};
