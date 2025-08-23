/** @format */

import React from "react";
import { motion } from "framer-motion";
import { Typography } from "../../atoms/Typography/Typography";
import { Button } from "../../atoms/Button/Button";
import { Icon } from "../../atoms/Icon/Icon";
import { Instagram, Heart, MessageCircle, Share2 } from "lucide-react";

export const InstagramSection: React.FC = () => {
	const instagramPosts = [
		{
			id: 1,
			image: "/images/instagram-1.jpg",
			likes: 1247,
			comments: 89,
			description: "Perfect for the weekend vibes 🌟",
			username: "@fashionista_sarah",
		},
		{
			id: 2,
			image: "/images/instagram-2.jpg",
			likes: 892,
			comments: 56,
			description: "Office chic with a twist ✨",
			username: "@style_maven",
		},
		{
			id: 3,
			image: "/images/instagram-3.jpg",
			likes: 1567,
			comments: 123,
			description: "Casual elegance at its finest 💫",
			username: "@trend_setter",
		},
		{
			id: 4,
			image: "/images/instagram-4.jpg",
			likes: 743,
			comments: 45,
			description: "Sustainable fashion that looks amazing 🌱",
			username: "@eco_style",
		},
		{
			id: 5,
			image: "/images/instagram-5.jpg",
			likes: 1123,
			comments: 78,
			description: "Accessorizing with confidence 💎",
			username: "@accessory_queen",
		},
		{
			id: 6,
			image: "/images/instagram-6.jpg",
			likes: 987,
			comments: 67,
			description: "Minimalist beauty in every detail ✨",
			username: "@minimal_style",
		},
	];

	return (
		<section className='py-20 bg-white dark:bg-black'>
			<div className='container mx-auto px-6'>
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className='text-center mb-16'>
					<div className='inline-flex items-center space-x-3 mb-4'>
						<Icon icon={Instagram} size={32} className='text-pink-500' />
						<Typography variant='h2'>@wearlo_official</Typography>
					</div>
					<Typography
						variant='body'
						className='max-w-2xl mx-auto text-gray-600 dark:text-gray-400'>
						Follow us on Instagram for daily inspiration, behind-the-scenes
						content, and to see how our community styles their Wearlo pieces.
					</Typography>
				</motion.div>

				{/* Instagram Grid */}
				<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12'>
					{instagramPosts.map((post, index) => (
						<motion.div
							key={post.id}
							initial={{ opacity: 0, scale: 0.8 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
							className='group relative aspect-square overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800'>
							{/* Placeholder for Instagram image */}
							<div className='w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center'>
								<Icon
									icon={Instagram}
									size={32}
									className='text-gray-500 dark:text-gray-400'
								/>
							</div>

							{/* Hover Overlay */}
							<div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center'>
								<div className='opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center'>
									<div className='flex items-center justify-center space-x-4 mb-2'>
										<div className='flex items-center space-x-1'>
											<Icon icon={Heart} size={16} className='fill-current' />
											<span className='text-sm'>{post.likes}</span>
										</div>
										<div className='flex items-center space-x-1'>
											<Icon icon={MessageCircle} size={16} />
											<span className='text-sm'>{post.comments}</span>
										</div>
									</div>
									<Typography variant='body' className='text-xs px-2'>
										{post.description}
									</Typography>
									<Typography
										variant='body'
										className='text-xs text-gray-300 mt-1'>
										{post.username}
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
					className='text-center'>
					<Typography variant='h4' className='mb-4'>
						Join Our Instagram Community
					</Typography>
					<Typography
						variant='body'
						className='text-gray-600 dark:text-gray-400 mb-6'>
						Share your Wearlo looks with #WearloStyle for a chance to be
						featured on our page
					</Typography>
					<div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
						<Button variant='outline' size='lg' className='group'>
							<Icon
								icon={Instagram}
								size={20}
								className='mr-2 group-hover:text-pink-500'
							/>
							Follow @wearlo_official
						</Button>
						<Button variant='primary' size='lg'>
							<Icon icon={Share2} size={20} className='mr-2' />
							Share Your Look
						</Button>
					</div>
				</motion.div>

				{/* Stats */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8, delay: 0.6 }}
					className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-gray-200 dark:border-gray-800'>
					<div className='text-center'>
						<Typography
							variant='h3'
							className='text-blue-600 dark:text-blue-400 mb-2'>
							50K+
						</Typography>
						<Typography
							variant='body'
							className='text-gray-600 dark:text-gray-400'>
							Instagram Followers
						</Typography>
					</div>
					<div className='text-center'>
						<Typography variant='h3' className='text-pink-500 mb-2'>
							10K+
						</Typography>
						<Typography
							variant='body'
							className='text-gray-600 dark:text-gray-400'>
							Posts Tagged
						</Typography>
					</div>
					<div className='text-center'>
						<Typography
							variant='h3'
							className='text-purple-600 dark:text-purple-400 mb-2'>
							95%
						</Typography>
						<Typography
							variant='body'
							className='text-gray-600 dark:text-gray-400'>
							Customer Satisfaction
						</Typography>
					</div>
				</motion.div>
			</div>
		</section>
	);
};
