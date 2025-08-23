/** @format */

import React from "react";
import { motion } from "framer-motion";
import { Typography } from "../../atoms/Typography/Typography";
import { Icon } from "../../atoms/Icon/Icon";
import { Star, Quote } from "lucide-react";

export const TestimonialsSection: React.FC = () => {
	const testimonials = [
		{
			id: 1,
			name: "Sarah Johnson",
			role: "Fashion Blogger",
			avatar: "/images/avatar-1.jpg",
			content:
				"Wearlo has completely transformed my wardrobe. The quality is exceptional and the designs are timeless. I get compliments every time I wear their pieces!",
			rating: 5,
		},
		{
			id: 2,
			name: "Michael Chen",
			role: "Business Professional",
			avatar: "/images/avatar-2.jpg",
			content:
				"As someone who values both style and comfort, Wearlo delivers on both fronts. Their clothing is perfect for the office and casual outings alike.",
			rating: 5,
		},
		{
			id: 3,
			name: "Emma Rodriguez",
			role: "Student",
			avatar: "/images/avatar-3.jpg",
			content:
				"I love how sustainable and ethical Wearlo is. The pieces are affordable luxury that I can feel good about wearing. Highly recommend!",
			rating: 5,
		},
		{
			id: 4,
			name: "David Thompson",
			role: "Entrepreneur",
			avatar: "/images/avatar-4.jpg",
			content:
				"The attention to detail in every piece is remarkable. From the stitching to the fabric quality, you can tell this is premium clothing.",
			rating: 5,
		},
	];

	const renderStars = (rating: number) => {
		return Array.from({ length: 5 }, (_, i) => (
			<Icon
				key={i}
				icon={Star}
				size={16}
				className={`${
					i < rating
						? "text-yellow-400 fill-current"
						: "text-gray-300 dark:text-gray-600"
				}`}
			/>
		));
	};

	return (
		<section className='py-20 bg-gray-50 dark:bg-gray-900'>
			<div className='container mx-auto px-6'>
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className='text-center mb-16'>
					<Typography variant='h2' className='mb-4'>
						What Our Customers Say
					</Typography>
					<Typography
						variant='body'
						className='max-w-2xl mx-auto text-gray-600 dark:text-gray-400'>
						Don't just take our word for it. Here's what our valued customers
						have to say about their experience with Wearlo.
					</Typography>
				</motion.div>

				{/* Testimonials Grid */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
					{testimonials.map((testimonial, index) => (
						<motion.div
							key={testimonial.id}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
							className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow'>
							{/* Quote Icon */}
							<div className='mb-4'>
								<Icon
									icon={Quote}
									size={24}
									className='text-blue-500 dark:text-blue-400'
								/>
							</div>

							{/* Content */}
							<Typography
								variant='body'
								className='text-gray-700 dark:text-gray-300 mb-4 text-sm leading-relaxed'>
								"{testimonial.content}"
							</Typography>

							{/* Rating */}
							<div className='flex items-center mb-4'>
								{renderStars(testimonial.rating)}
							</div>

							{/* Author */}
							<div className='flex items-center'>
								<div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg mr-3'>
									{testimonial.name.charAt(0)}
								</div>
								<div>
									<Typography
										variant='body'
										className='font-semibold text-gray-900 dark:text-white'>
										{testimonial.name}
									</Typography>
									<Typography
										variant='body'
										className='text-sm text-gray-600 dark:text-gray-400'>
										{testimonial.role}
									</Typography>
								</div>
							</div>
						</motion.div>
					))}
				</div>

				{/* Call to Action */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8, delay: 0.4 }}
					className='text-center mt-16'>
					<Typography variant='h4' className='mb-4'>
						Join Thousands of Happy Customers
					</Typography>
					<Typography
						variant='body'
						className='text-gray-600 dark:text-gray-400 mb-6'>
						Experience the quality and style that our customers love
					</Typography>
					<button className='inline-flex items-center px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors'>
						Shop Now
					</button>
				</motion.div>
			</div>
		</section>
	);
};
