/** @format */

import React from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search, Package, AlertTriangle } from "lucide-react";
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
		<div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4'>
			<div className='max-w-4xl mx-auto text-center'>
				{/* 404 Number */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className='relative mb-8'>
					<div className='text-9xl md:text-[12rem] font-bold text-gray-200 dark:text-gray-700 select-none'>
						404
					</div>
					<div className='absolute inset-0 flex items-center justify-center'>
						<AlertTriangle className='w-24 h-24 md:w-32 md:h-32 text-red-500 dark:text-red-400' />
					</div>
				</motion.div>

				{/* Main Content */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className='mb-12'>
					<h1 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6'>
						Page Not Found
					</h1>
					<p className='text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed'>
						Oops! The page you're looking for seems to have wandered off. Don't
						worry, we'll help you find your way back.
					</p>
				</motion.div>

				{/* Action Buttons */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					className='flex flex-col sm:flex-row gap-4 justify-center items-center mb-16'>
					<Button
						onClick={handleGoHome}
						className='w-full sm:w-auto px-8 py-3 text-lg'>
						<Home className='w-5 h-5 mr-2' />
						Go Home
					</Button>
					<Button
						variant='outline'
						onClick={handleGoBack}
						className='w-full sm:w-auto px-8 py-3 text-lg'>
						<ArrowLeft className='w-5 h-5 mr-2' />
						Go Back
					</Button>
					<Button
						variant='outline'
						onClick={handleSearch}
						className='w-full sm:w-auto px-8 py-3 text-lg'>
						<Search className='w-5 h-5 mr-2' />
						Search
					</Button>
				</motion.div>

				{/* Quick Links */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.6 }}
					className='mb-12'>
					<h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6'>
						Popular Pages
					</h2>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto'>
						<button
							onClick={() => navigate("/products")}
							className='group p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:shadow-md bg-white dark:bg-gray-800'>
							<Package className='w-8 h-8 text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform duration-200' />
							<p className='font-medium text-gray-900 dark:text-gray-100'>
								Products
							</p>
							<p className='text-sm text-gray-500 dark:text-gray-400'>
								Browse our catalog
							</p>
						</button>
						<button
							onClick={() => navigate("/categories")}
							className='group p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 transition-all duration-200 hover:shadow-md bg-white dark:bg-gray-800'>
							<div className='w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-200'>
								<Package className='w-5 h-5 text-green-600 dark:text-green-400' />
							</div>
							<p className='font-medium text-gray-900 dark:text-gray-100'>
								Categories
							</p>
							<p className='text-sm text-gray-500 dark:text-gray-400'>
								Explore by type
							</p>
						</button>
						<button
							onClick={() => navigate("/dashboard")}
							className='group p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200 hover:shadow-md bg-white dark:bg-gray-800'>
							<div className='w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-200'>
								<Home className='w-5 h-5 text-purple-600 dark:text-purple-400' />
							</div>
							<p className='font-medium text-gray-900 dark:text-gray-100'>
								Dashboard
							</p>
							<p className='text-sm text-gray-500 dark:text-gray-400'>
								Manage your store
							</p>
						</button>
					</div>
				</motion.div>

				{/* Help Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.8 }}
					className='bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto'>
					<h3 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>
						Need Help?
					</h3>
					<p className='text-gray-600 dark:text-gray-400 mb-6'>
						If you're still having trouble finding what you're looking for, our
						support team is here to help.
					</p>
					<div className='flex flex-col sm:flex-row gap-3 justify-center'>
						<Button variant='outline' className='w-full sm:w-auto'>
							Contact Support
						</Button>
						<Button variant='outline' className='w-full sm:w-auto'>
							View Documentation
						</Button>
					</div>
				</motion.div>

				{/* Footer Note */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 1 }}
					className='mt-12 text-center'>
					<p className='text-sm text-gray-500 dark:text-gray-400'>
						Error Code: 404 |
						<span className='text-blue-500 dark:text-blue-400 ml-1'>
							Report this issue
						</span>
					</p>
				</motion.div>
			</div>
		</div>
	);
};

export default NotFoundScreen;
