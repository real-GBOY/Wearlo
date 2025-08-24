/** @format */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle } from "lucide-react";
import { AuthForm } from "../../molecules/AuthForm";
import { useAuth } from "../../../contexts/AuthContext";

interface AuthModalProps {
	isOpen: boolean;
	onClose: () => void;
	initialMode?: "login" | "signup";
}

export const AuthModal: React.FC<AuthModalProps> = ({
	isOpen,
	onClose,
	initialMode = "login",
}) => {
	const [mode, setMode] = useState<"login" | "signup">(initialMode);
	const [showSuccess, setShowSuccess] = useState(false);
	const { login, signup, loginMutation, signupMutation } = useAuth();

	// Handle escape key press
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) {
				handleClose();
			}
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			// Prevent body scroll when modal is open
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	const handleModeChange = (newMode: "login" | "signup") => {
		setMode(newMode);
	};

	const handleSubmit = async (data: any) => {
		try {
			if (mode === "login") {
				await login(data.email, data.password);
			} else {
				await signup(
					data.name,
					data.email,
					data.password,
					data.phone,
					data.address,
					data.city,
					data.zip,
					data.country
				);
			}
			// Show success message briefly before closing
			setShowSuccess(true);
			setTimeout(() => {
				setShowSuccess(false);
				onClose();
			}, 1500);
		} catch (error) {
			console.error("Authentication error:", error);
			// Error handling is done in the context mutations
		}
	};

	const handleBackdropClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			handleClose();
		}
	};

	const handleClose = () => {
		onClose();
		// Reset mode when closing
		setMode(initialMode);
		setShowSuccess(false);
	};

	// Determine loading state based on current mode
	const isLoading =
		mode === "login" ? loginMutation.isPending : signupMutation.isPending;

	// Get error message based on current mode
	const error =
		mode === "login"
			? loginMutation.error?.message ||
			  (loginMutation.error as any)?.response?.data?.message
			: signupMutation.error?.message ||
			  (signupMutation.error as any)?.response?.data?.message;

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
					className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'
					onClick={handleBackdropClick}>
					<motion.div
						initial={{ opacity: 0, scale: 0.9, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.9, y: 20 }}
						transition={{
							duration: 0.3,
							type: "spring",
							stiffness: 300,
							damping: 30,
						}}
						className='relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden'
						onClick={(e) => e.stopPropagation()}>
						{/* Close Button */}
						<motion.button
							initial={{ opacity: 0, scale: 0 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.2, duration: 0.2 }}
							onClick={handleClose}
							className='absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 hover:bg-gray-100 rounded-full'>
							<X size={20} />
						</motion.button>

						{/* Modal Content */}
						<div className='p-8'>
							{showSuccess ? (
								<motion.div
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									className='text-center space-y-4'>
									<motion.div
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										transition={{ delay: 0.1, type: "spring" }}
										className='mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center'>
										<CheckCircle className='w-8 h-8 text-green-600' />
									</motion.div>
									<motion.h2
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.2 }}
										className='text-2xl font-bold text-gray-900'>
										{mode === "login" ? "Welcome Back!" : "Account Created!"}
									</motion.h2>
									<motion.p
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.3 }}
										className='text-gray-600'>
										{mode === "login"
											? "You have successfully signed in to your account."
											: "Your account has been created successfully. Welcome to Wearlo!"}
									</motion.p>
								</motion.div>
							) : (
								<AuthForm
									mode={mode}
									onModeChange={handleModeChange}
									onSubmit={handleSubmit}
									isLoading={isLoading}
									error={error}
								/>
							)}
						</div>

						{/* Decorative Elements */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.4 }}
							className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200'
						/>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
