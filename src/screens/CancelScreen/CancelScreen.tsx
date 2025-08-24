/** @format */

import React from "react";
import { Link } from "react-router-dom";

export const CancelScreen: React.FC = () => {
	return (
		<div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100'>
			<div className='max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center'>
				<div className='mb-6'>
					<div className='mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100'>
						<svg
							className='h-8 w-8 text-red-600'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M6 18L18 6M6 6l12 12'
							/>
						</svg>
					</div>
				</div>

				<h1 className='text-3xl font-bold text-gray-900 mb-4'>
					❌ Payment Cancelled. Try again.
				</h1>

				<p className='text-gray-600 mb-8'>
					Your payment was cancelled. No charges were made to your account. You
					can try the payment again or return to shopping.
				</p>

				<div className='space-y-3'>
					<Link
						to='/'
						className='block w-full bg-red-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors duration-200'>
						Return to Shop
					</Link>

					<Link
						to='/checkout'
						className='block w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors duration-200'>
						Try Again
					</Link>
				</div>
			</div>
		</div>
	);
};
