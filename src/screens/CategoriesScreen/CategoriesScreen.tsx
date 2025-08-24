/** @format */

import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Typography } from "../../components/atoms/Typography/Typography";
import { Icon } from "../../components/atoms/Icon/Icon";
import { useCategories } from "../../hooks/useCategories";
import { Shirt, Watch, ShoppingBag, Footprints, ArrowLeft } from "lucide-react";

export const CategoriesScreen: React.FC = () => {
	const navigate = useNavigate();
	const { data: categories, isLoading } = useCategories();

	// Fallback categories if backend data is not available
	const fallbackCategories = [
		{
			id: "clothing",
			name: "Clothing",
			description: "Timeless apparel for every occasion",
			icon: Shirt,
			image: "/images/category-clothing.jpg",
			color: "from-blue-500 to-purple-600",
		},
		{
			id: "accessories",
			name: "Accessories",
			description: "Complete your look with our curated accessories",
			icon: Watch,
			image: "/images/category-accessories.jpg",
			color: "from-green-500 to-teal-600",
		},
		{
			id: "bags",
			name: "Bags",
			description: "Functional and stylish bags for everyday use",
			icon: ShoppingBag,
			image: "/images/category-bags.jpg",
			color: "from-orange-500 to-red-600",
		},
		{
			id: "footwear",
			name: "Footwear",
			description: "Comfortable and durable shoes for all occasions",
			icon: Footprints,
			image: "/images/category-footwear.jpg",
			color: "from-purple-500 to-pink-600",
		},
	];

	const displayCategories = categories?.length
		? categories
		: fallbackCategories;

	const handleCategoryClick = (categoryId: string) => {
		navigate(`/products?category=${categoryId}`);
	};

	const handleBackClick = () => {
		navigate(-1);
	};

	if (isLoading) {
		return (
			<section className='py-20 bg-white'>
				<div className='container mx-auto px-6'>
					<div className='text-center'>
						<Typography variant='h2' className='mb-4'>
							Loading Categories...
						</Typography>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className='py-20 bg-white'>
			<div className='container mx-auto px-6'>
				{/* Back Button */}
				<motion.div
					initial={{ opacity: 0, x: -30 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6 }}
					className='mb-8'>
					<button
						onClick={handleBackClick}
						className='inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors'>
						<Icon icon={ArrowLeft} size={20} className='mr-2' />
						Back
					</button>
				</motion.div>

				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className='text-center mb-16'>
					<Typography variant='h1' className='mb-4'>
						All Categories
					</Typography>
					<Typography
						variant='body'
						className='max-w-2xl mx-auto text-gray-600'>
						Explore our complete collection of categories designed to elevate
						your style
					</Typography>
				</motion.div>

				{/* Categories Grid */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
					{displayCategories.map((category, index) => (
						<motion.div
							key={category.id}
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
							className='group cursor-pointer'
							onClick={() => handleCategoryClick(category.id)}>
							<div className='relative overflow-hidden rounded-lg aspect-square mb-4'>
								{/* Category Image */}
								<img
									src={category.image || "/images/category-placeholder.jpg"}
									alt={category.name}
									className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
									onError={(e) => {
										const target = e.target as HTMLImageElement;
										target.src = "/images/category-placeholder.jpg";
									}}
								/>

								{/* Category Icon Overlay */}
								<div className='absolute top-4 right-4'>
									<div
										className={`w-12 h-12 bg-gradient-to-br ${
											"color" in category
												? category.color
												: "from-gray-500 to-gray-600"
										} rounded-full flex items-center justify-center bg-white/90 backdrop-blur-sm`}>
										<Icon
											icon={"icon" in category ? category.icon : Shirt}
											size={24}
											className='text-gray-700'
										/>
									</div>
								</div>

								{/* Hover Overlay */}
								<div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300' />
							</div>

							{/* Category Info */}
							<div className='text-center'>
								<Typography
									variant='h4'
									className='mb-2 group-hover:text-blue-600 transition-colors'>
									{category.name}
								</Typography>
								<Typography variant='body' className='text-gray-600 text-sm'>
									{category.description}
								</Typography>
							</div>
						</motion.div>
					))}
				</div>

				{/* Category Count */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.4 }}
					className='text-center mt-12'>
					<Typography variant='body' className='text-gray-600'>
						{displayCategories.length} categories available
					</Typography>
				</motion.div>
			</div>
		</section>
	);
};
