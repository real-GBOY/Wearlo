/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Typography } from "../../atoms/Typography/Typography";
import { Input } from "../../atoms/Input/Input";
import { Button } from "../../atoms/Button/Button";
import { Icon } from "../../atoms/Icon/Icon";
import { Mail, Gift, TrendingUp, Users } from "lucide-react";

export const NewsletterSignup: React.FC = () => {
	const [email, setEmail] = useState("");
	const [isSubscribed, setIsSubscribed] = useState(false);

	const benefits = [
		{
			icon: Gift,
			title: "Exclusive Offers",
			description: "Get early access to sales and special promotions",
		},
		{
			icon: TrendingUp,
			title: "New Arrivals",
			description: "Be the first to know about our latest collections",
		},
		{
			icon: Users,
			title: "VIP Access",
			description: "Join our community of fashion-forward individuals",
		},
	];

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (email) {
			// Here you would typically send the email to your backend
			console.log("Subscribing email:", email);
			setIsSubscribed(true);
			setEmail("");

			// Reset subscription status after 3 seconds
			setTimeout(() => setIsSubscribed(false), 3000);
		}
	};

	return (
		<section className='py-20 bg-gradient-to-br from-blue-600 to-purple-700 text-white'>
			<div className='container mx-auto px-6'>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
					{/* Left Column - Newsletter Form */}
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8 }}
						className='space-y-6'>
						<Typography variant='h2' className='mb-4'>
							Stay in the Loop
						</Typography>
						<Typography variant='body' className='text-blue-100 mb-6 text-lg'>
							Subscribe to our newsletter and never miss out on the latest
							trends, exclusive offers, and new arrivals.
						</Typography>

						{/* Newsletter Form */}
						<form onSubmit={handleSubmit} className='space-y-4'>
							<div className='flex flex-col sm:flex-row gap-4'>
								<Input
									type='email'
									placeholder='Enter your email address'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className='flex-1'
									required
								/>
								<Button
									type='submit'
									variant='secondary'
									size='lg'
									className='whitespace-nowrap'>
									<Icon icon={Mail} size={20} className='mr-2' />
									Subscribe
								</Button>
							</div>

							{/* Success Message */}
							{isSubscribed && (
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									className='text-green-200 text-sm font-medium'>
									🎉 Thanks for subscribing! Check your email for confirmation.
								</motion.div>
							)}

							<Typography variant='body' className='text-blue-200 text-sm'>
								By subscribing, you agree to our Privacy Policy and consent to
								receive updates from our company.
							</Typography>
						</form>
					</motion.div>

					{/* Right Column - Benefits */}
					<motion.div
						initial={{ opacity: 0, x: 50 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className='space-y-6'>
						<Typography variant='h3' className='mb-6'>
							Why Subscribe?
						</Typography>

						<div className='space-y-4'>
							{benefits.map((benefit, index) => (
								<motion.div
									key={benefit.title}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6, delay: index * 0.1 }}
									className='flex items-start space-x-4'>
									<div className='flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center'>
										<Icon
											icon={benefit.icon}
											size={24}
											className='text-white'
										/>
									</div>
									<div>
										<Typography variant='h4' className='mb-1 text-white'>
											{benefit.title}
										</Typography>
										<Typography variant='body' className='text-blue-100'>
											{benefit.description}
										</Typography>
									</div>
								</motion.div>
							))}
						</div>

						{/* Social Proof */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.4 }}
							className='pt-6 border-t border-white/20'>
							<Typography variant='body' className='text-blue-200 text-sm'>
								Join over <span className='font-semibold'>10,000+</span> fashion
								enthusiasts who are already part of our community.
							</Typography>
						</motion.div>
					</motion.div>
				</div>
			</div>
		</section>
	);
};
