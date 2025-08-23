/** @format */

import React from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "../../components/atoms/Button";
import { useNavigate } from "react-router-dom";

const NotFoundScreen: React.FC = () => {
	const navigate = useNavigate();

	const handleGoHome = () => {
		navigate("/");
	};

	const handleGoBack = () => {
		navigate(-1);
	};

	const handleSearch = () => {
		// You can implement search functionality here
		navigate("/");
	};

	return (
		<div className='min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4'>
			<div className='max-w-2xl mx-auto text-center'>
				{/* 404 Number */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className='mb-8'>
					<div className='text-8xl md:text-9xl font-bold text-gray-900 dark:text-gray-100 select-none'>
						404
					</div>
				</motion.div>

				{/* Main Content */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className='mb-12'>
					<h1 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
						PAGE NOT FOUND
					</h1>
					<p className='text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto leading-relaxed'>
						The page you're looking for doesn't exist or has been moved. Let's
						get you back on track.
					</p>
				</motion.div>

				{/* Action Buttons */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					className='flex flex-col sm:flex-row gap-4 justify-center items-center mb-8'>
					<Button
						onClick={handleGoHome}
						className='w-full sm:w-auto px-8 py-3 text-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'>
						<Home className='w-5 h-5 mr-2' />
						GO HOME
					</Button>
					<Button
						variant='outline'
						onClick={handleGoBack}
						className='w-full sm:w-auto px-8 py-3 text-lg border-gray-900 dark:border-white text-gray-900 dark:text-white hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900'>
						<ArrowLeft className='w-5 h-5 mr-2' />
						GO BACK
					</Button>
				</motion.div>

				{/* Status/Breadcrumb */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 0.6 }}
					className='mb-12'>
					<p className='text-sm text-gray-400 dark:text-gray-500'>
						ERROR • PAGE NOT FOUND • 404
					</p>
				</motion.div>

				{/* Search/Explore Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.8 }}
					className='bg-gray-50 dark:bg-gray-800 rounded-xl p-8 max-w-lg mx-auto'>
					<div className='flex items-center justify-center mb-4'>
						<Search className='w-6 h-6 text-gray-500 dark:text-gray-400 mr-2' />
						<span className='text-lg font-medium text-gray-900 dark:text-gray-100'>
							Looking for something specific?
						</span>
					</div>
					<p className='text-gray-600 dark:text-gray-400 mb-6'>
						Try searching our products or browse our featured collections
					</p>
					<Button
						variant='outline'
						onClick={handleSearch}
						className='w-full sm:w-auto px-8 py-3 text-lg border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'>
						EXPLORE PRODUCTS
					</Button>
				</motion.div>
			</div>
		</div>
	);
};

export default NotFoundScreen;
