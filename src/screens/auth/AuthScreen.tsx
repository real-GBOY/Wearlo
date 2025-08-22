/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { AuthForm } from "../../components/molecules/AuthForm";
import { AnimatedThemeToggler } from "../../components/magicui";

export const AuthScreen: React.FC = () => {
	const [mode, setMode] = useState<"login" | "signup">("login");
	const [isLoading, setIsLoading] = useState(false);

	const handleModeChange = (newMode: "login" | "signup") => {
		setMode(newMode);
	};

	const handleSubmit = async (data: any) => {
		setIsLoading(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1500));
		setIsLoading(false);
		// Here you would typically make the actual API call
		console.log("Auth form submitted:", data);
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4'>
			{/* Theme Toggle */}
			<motion.div
				initial={{ opacity: 0, scale: 0 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ delay: 0.5, duration: 0.3 }}
				className='absolute top-6 right-6'>
				<AnimatedThemeToggler className='p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-all duration-200 hover:shadow-xl' />
			</motion.div>

			{/* Main Content */}
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.2 }}
				className='w-full max-w-md'>
				{/* Logo/Brand Section */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					className='text-center mb-8'>
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{
							duration: 0.5,
							delay: 0.6,
							type: "spring",
							stiffness: 200,
						}}
						className='w-16 h-16 bg-black dark:bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center'>
						<span className='text-2xl font-bold text-white dark:text-black'>
							W
						</span>
					</motion.div>
					<motion.h1
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.8 }}
						className='text-2xl font-bold text-gray-900 dark:text-white'>
						Wearlo
					</motion.h1>
				</motion.div>

				{/* Auth Form Card */}
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5, delay: 0.6 }}
					className='bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8'>
					<AuthForm
						mode={mode}
						onModeChange={handleModeChange}
						onSubmit={handleSubmit}
						isLoading={isLoading}
					/>
				</motion.div>

				{/* Footer */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1.2 }}
					className='text-center mt-8 text-sm text-gray-500 dark:text-gray-400'>
					<p>
						By continuing, you agree to our Terms of Service and Privacy Policy
					</p>
				</motion.div>
			</motion.div>
		</div>
	);
};
