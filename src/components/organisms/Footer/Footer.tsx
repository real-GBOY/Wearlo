/** @format */

import React from "react";
import {
	Facebook,
	Twitter,
	Instagram,
	Linkedin,
	Mail,
	Phone,
	MapPin,
} from "lucide-react";
import { Typography } from "../../atoms/Typography/Typography";

export const Footer: React.FC = () => {
	return (
		<footer className='bg-gray-900 text-white'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
					{/* Company Info */}
					<div className='space-y-4'>
						<Typography variant='h3' className='text-white font-bold'>
							Wearlo
						</Typography>
						<Typography variant='body' className='text-gray-300'>
							Your premier destination for fashion and lifestyle products.
							Quality, style, and innovation in every piece.
						</Typography>
						<div className='flex space-x-4'>
							<a
								href='#'
								className='text-gray-400 hover:text-white transition-colors'>
								<Facebook size={20} />
							</a>
							<a
								href='#'
								className='text-gray-400 hover:text-white transition-colors'>
								<Twitter size={20} />
							</a>
							<a
								href='#'
								className='text-gray-400 hover:text-white transition-colors'>
								<Instagram size={20} />
							</a>
							<a
								href='#'
								className='text-gray-400 hover:text-white transition-colors'>
								<Linkedin size={20} />
							</a>
						</div>
					</div>

					{/* Quick Links */}
					<div className='space-y-4'>
						<Typography variant='h4' className='text-white font-semibold'>
							Quick Links
						</Typography>
						<ul className='space-y-2'>
							<li>
								<a
									href='/'
									className='text-gray-300 hover:text-white transition-colors'>
									Home
								</a>
							</li>
							<li>
								<a
									href='/products'
									className='text-gray-300 hover:text-white transition-colors'>
									Products
								</a>
							</li>
							<li>
								<a
									href='/about'
									className='text-gray-300 hover:text-white transition-colors'>
									About Us
								</a>
							</li>
							<li>
								<a
									href='/contact'
									className='text-gray-300 hover:text-white transition-colors'>
									Contact
								</a>
							</li>
						</ul>
					</div>

					{/* Customer Service */}
					<div className='space-y-4'>
						<Typography variant='h4' className='text-white font-semibold'>
							Customer Service
						</Typography>
						<ul className='space-y-2'>
							<li>
								<a
									href='/help'
									className='text-gray-300 hover:text-white transition-colors'>
									Help Center
								</a>
							</li>
							<li>
								<a
									href='/shipping'
									className='text-gray-300 hover:text-white transition-colors'>
									Shipping Info
								</a>
							</li>
							<li>
								<a
									href='/returns'
									className='text-gray-300 hover:text-white transition-colors'>
									Returns
								</a>
							</li>
							<li>
								<a
									href='/size-guide'
									className='text-gray-300 hover:text-white transition-colors'>
									Size Guide
								</a>
							</li>
						</ul>
					</div>

					{/* Contact Info */}
					<div className='space-y-4'>
						<Typography variant='h4' className='text-white font-semibold'>
							Contact Us
						</Typography>
						<div className='space-y-3'>
							<div className='flex items-center space-x-3'>
								<MapPin size={16} className='text-gray-400' />
								<Typography variant='body' className='text-gray-300'>
									123 Fashion St, Cairo, Egypt
								</Typography>
							</div>
							<div className='flex items-center space-x-3'>
								<Phone size={16} className='text-gray-400' />
								<Typography variant='body' className='text-gray-300'>
									+20 123 456 789
								</Typography>
							</div>
							<div className='flex items-center space-x-3'>
								<Mail size={16} className='text-gray-400' />
								<Typography variant='body' className='text-gray-300'>
									info@wearlo.com
								</Typography>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom Section */}
				<div className='border-t border-gray-800 mt-12 pt-8'>
					<div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
						<Typography
							variant='body'
							className='text-gray-400 text-center md:text-left'>
							© 2024 Wearlo. All rights reserved.
						</Typography>
						<div className='flex space-x-6'>
							<a
								href='/privacy'
								className='text-gray-400 hover:text-white transition-colors'>
								Privacy Policy
							</a>
							<a
								href='/terms'
								className='text-gray-400 hover:text-white transition-colors'>
								Terms of Service
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};
