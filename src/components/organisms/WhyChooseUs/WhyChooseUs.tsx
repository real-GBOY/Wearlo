/** @format */

import React from "react";
import { motion } from "framer-motion";
import { Typography } from "../../atoms/Typography/Typography";
import { Icon } from "../../atoms/Icon/Icon";
import { Truck, Shield, RefreshCw, Award, Leaf, Users } from "lucide-react";

export const WhyChooseUs: React.FC = () => {
	const reasons = [
		{
			icon: Award,
			title: "Premium Quality",
			description:
				"We source only the finest materials and work with skilled artisans to create pieces that last.",
			color: "from-yellow-500 to-orange-500",
		},
		{
			icon: Leaf,
			title: "Sustainable Fashion",
			description:
				"Committed to eco-friendly practices and responsible manufacturing processes.",
			color: "from-green-500 to-emerald-500",
		},
		{
			icon: Truck,
			title: "Fast & Free Shipping",
			description:
				"Free shipping on orders over $100 with delivery in 2-3 business days.",
			color: "from-blue-500 to-cyan-500",
		},
		{
			icon: Shield,
			title: "Secure Shopping",
			description:
				"Your data is protected with bank-level security and encryption.",
			color: "from-purple-500 to-pink-500",
		},
		{
			icon: RefreshCw,
			title: "Easy Returns",
			description:
				"30-day hassle-free returns with full refunds and exchanges.",
			color: "from-indigo-500 to-blue-500",
		},
		{
			icon: Users,
			title: "24/7 Support",
			description: "Our customer service team is always here to help you.",
			color: "from-red-500 to-pink-500",
		},
	];

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
						Why Choose Wearlo?
					</Typography>
					<Typography
						variant='body'
						className='max-w-2xl mx-auto text-gray-600 dark:text-gray-400'>
						We're not just another fashion brand. We're a movement towards
						better, more conscious clothing choices.
					</Typography>
				</motion.div>

				{/* Reasons Grid */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16'>
					{reasons.map((reason, index) => (
						<motion.div
							key={reason.title}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
							className='group'>
							<div className='bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2'>
								{/* Icon */}
								<div
									className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${reason.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
									<Icon icon={reason.icon} size={32} className='text-white' />
								</div>

								{/* Content */}
								<Typography
									variant='h4'
									className='mb-4 text-gray-900 dark:text-white'>
									{reason.title}
								</Typography>
								<Typography
									variant='body'
									className='text-gray-600 dark:text-gray-400 leading-relaxed'>
									{reason.description}
								</Typography>
							</div>
						</motion.div>
					))}
				</div>

				{/* Stats Section */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8, delay: 0.4 }}
					className='bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-lg'>
					<div className='grid grid-cols-1 md:grid-cols-4 gap-8 text-center'>
						<div>
							<Typography
								variant='h3'
								className='text-blue-600 dark:text-blue-400 mb-2'>
								10K+
							</Typography>
							<Typography
								variant='body'
								className='text-gray-600 dark:text-gray-400'>
								Happy Customers
							</Typography>
						</div>
						<div>
							<Typography
								variant='h3'
								className='text-green-600 dark:text-green-400 mb-2'>
								500+
							</Typography>
							<Typography
								variant='body'
								className='text-gray-600 dark:text-gray-400'>
								Products Available
							</Typography>
						</div>
						<div>
							<Typography
								variant='h3'
								className='text-purple-600 dark:text-purple-400 mb-2'>
								98%
							</Typography>
							<Typography
								variant='body'
								className='text-gray-600 dark:text-gray-400'>
								Satisfaction Rate
							</Typography>
						</div>
						<div>
							<Typography
								variant='h3'
								className='text-orange-600 dark:text-orange-400 mb-2'>
								24/7
							</Typography>
							<Typography
								variant='body'
								className='text-gray-600 dark:text-gray-400'>
								Customer Support
							</Typography>
						</div>
					</div>
				</motion.div>

				{/* Call to Action */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8, delay: 0.6 }}
					className='text-center mt-16'>
					<Typography variant='h4' className='mb-4'>
						Ready to Experience the Difference?
					</Typography>
					<Typography
						variant='body'
						className='text-gray-600 dark:text-gray-400 mb-6'>
						Join thousands of customers who have already discovered why Wearlo
						is the right choice for their wardrobe.
					</Typography>
					<div className='flex flex-col sm:flex-row gap-4 justify-center'>
						<button className='px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors'>
							Shop Now
						</button>
						<button className='px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'>
							Learn More
						</button>
					</div>
				</motion.div>
			</div>
		</section>
	);
};
