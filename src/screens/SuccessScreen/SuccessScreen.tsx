/** @format */

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Package, Mail, Home, User } from "lucide-react";

export const SuccessScreen: React.FC = () => {
	const location = useLocation();
	const orderData = location.state || {};

	return (
		<div className='min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12'>
			<div className='container mx-auto px-6'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className='max-w-2xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden'
				>
					{/* Header */}
					<div className='bg-gradient-to-r from-green-500 to-green-600 px-8 py-12 text-center text-white'>
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className='mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-white/20 mb-6'
						>
							<CheckCircle className='h-10 w-10' />
						</motion.div>
						<motion.h1
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.4 }}
							className='text-4xl font-bold mb-4'
						>
							Payment Successful! 🎉
						</motion.h1>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.6 }}
							className='text-xl text-green-100'
						>
							Thank you for your purchase!
						</motion.p>
					</div>

					{/* Order Details */}
					<div className='px-8 py-8'>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.8 }}
							className='space-y-6'
						>
							{/* Order Summary */}
							<div className='bg-gray-50 rounded-lg p-6'>
								<h2 className='text-2xl font-semibold text-gray-900 mb-4 flex items-center'>
									<Package className='h-6 w-6 mr-2 text-green-600' />
									Order Summary
								</h2>
								<div className='space-y-3'>
									{orderData.orderId && (
										<div className='flex justify-between'>
											<span className='text-gray-600'>Order ID:</span>
											<span className='font-medium'>{orderData.orderId}</span>
										</div>
									)}
									{orderData.customerName && (
										<div className='flex justify-between'>
											<span className='text-gray-600'>Customer:</span>
											<span className='font-medium'>{orderData.customerName}</span>
										</div>
									)}
									{orderData.orderTotal && (
										<div className='flex justify-between'>
											<span className='text-gray-600'>Total Amount:</span>
											<span className='font-medium text-green-600'>
												EGP {orderData.orderTotal.toFixed(2)}
											</span>
										</div>
									)}
									<div className='flex justify-between'>
										<span className='text-gray-600'>Status:</span>
										<span className='font-medium text-green-600'>Confirmed</span>
									</div>
								</div>
							</div>

							{/* Next Steps */}
							<div className='bg-blue-50 rounded-lg p-6'>
								<h3 className='text-lg font-semibold text-blue-900 mb-3 flex items-center'>
									<Mail className='h-5 w-5 mr-2' />
									What's Next?
								</h3>
								<ul className='space-y-2 text-blue-800'>
									<li>• You'll receive an order confirmation email shortly</li>
									<li>• We'll notify you when your order ships</li>
									<li>• Track your order in your account dashboard</li>
								</ul>
							</div>

							{/* Action Buttons */}
							<div className='flex flex-col sm:flex-row gap-4'>
								<Link
									to='/'
									className='flex-1 bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center'
								>
									<Home className='h-5 w-5 mr-2' />
									Continue Shopping
								</Link>
								<Link
									to='/profile'
									className='flex-1 bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center'
								>
									<User className='h-5 w-5 mr-2' />
									View Orders
								</Link>
							</div>
						</motion.div>
					</div>
				</motion.div>
			</div>
		</div>
	);
};
