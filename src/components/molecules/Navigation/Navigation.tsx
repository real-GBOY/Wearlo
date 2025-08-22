/** @format */

import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { User, LogOut, Settings } from "lucide-react";
import { Typography } from "../../atoms/Typography/Typography";
import { Icon } from "../../atoms/Icon/Icon";
import { AuthModal } from "../../organisms/AuthModal";
import { AnimatedThemeToggler } from "../../magicui/animated-theme-toggler";
import { useAuth } from "../../../contexts/AuthContext";
import { AnimatePresence } from "framer-motion";

export const Navigation: React.FC = () => {
	const location = useLocation();
	const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
	const { user, isAuthenticated, logout } = useAuth();
	const userMenuRef = useRef<HTMLDivElement>(null);

	const navItems = [
		{ path: "/", label: "Home" },
		{ path: "/products", label: "Products" },
	];

	// Close user menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				userMenuRef.current &&
				!userMenuRef.current.contains(event.target as Node)
			) {
				setIsUserMenuOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// Close user menu when user logs out
	useEffect(() => {
		if (!isAuthenticated) {
			setIsUserMenuOpen(false);
		}
	}, [isAuthenticated]);

	const handleAuthClick = () => {
		setIsAuthModalOpen(true);
	};

	const handleCloseAuthModal = () => {
		setIsAuthModalOpen(false);
	};

	const handleLogout = () => {
		logout();
		setIsUserMenuOpen(false);
	};

	const handleUserMenuToggle = () => {
		setIsUserMenuOpen(!isUserMenuOpen);
	};

	return (
		<>
			<nav className='flex items-center justify-between'>
				<Link to='/'>
					<Typography
						variant='h3'
						className='hover:text-gray-600 dark:hover:text-gray-400 transition-colors'>
						WEARLO
					</Typography>
				</Link>

				<div className='flex items-center space-x-8'>
					<div className='hidden md:flex space-x-6'>
						{navItems.map((item) => (
							<Link key={item.path} to={item.path}>
								<motion.span
									whileHover={{ y: -2 }}
									className={`text-lg transition-colors ${
										location.pathname === item.path
											? "text-black dark:text-white"
											: "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
									}`}>
									{item.label}
								</motion.span>
							</Link>
						))}
					</div>

					<div className='flex items-center space-x-4'>
						{isAuthenticated ? (
							<div className='relative' ref={userMenuRef}>
								<motion.button
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									onClick={handleUserMenuToggle}
									className='flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'>
									<div className='w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center'>
										<span className='text-white text-sm font-medium'>
											{user?.name?.charAt(0)?.toUpperCase() || "U"}
										</span>
									</div>
									<span className='hidden sm:block text-sm font-medium'>
										{user?.name}
									</span>
								</motion.button>

								{/* User Dropdown Menu */}
								<AnimatePresence>
									{isUserMenuOpen && (
										<motion.div
											initial={{ opacity: 0, y: -10, scale: 0.95 }}
											animate={{ opacity: 1, y: 0, scale: 1 }}
											exit={{ opacity: 0, y: -10, scale: 0.95 }}
											transition={{ duration: 0.2 }}
											className='absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50'>
											<div className='p-3 border-b border-gray-200 dark:border-gray-700'>
												<p className='text-sm font-medium text-gray-900 dark:text-white'>
													{user?.name}
												</p>
												<p className='text-xs text-gray-500 dark:text-gray-400'>
													{user?.email}
												</p>
											</div>
											<div className='p-1'>
												<button
													onClick={() => {
														setIsUserMenuOpen(false);
														// TODO: Navigate to profile/settings
													}}
													className='w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors'>
													<Settings size={16} />
													<span>Settings</span>
												</button>
												<button
													onClick={handleLogout}
													className='w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors'>
													<LogOut size={16} />
													<span>Sign Out</span>
												</button>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						) : (
							<motion.button
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								onClick={handleAuthClick}
								className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'>
								<User size={20} />
							</motion.button>
						)}

						<AnimatedThemeToggler className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white' />
					</div>
				</div>
			</nav>

			<AuthModal
				isOpen={isAuthModalOpen}
				onClose={handleCloseAuthModal}
				initialMode='login'
			/>
		</>
	);
};
