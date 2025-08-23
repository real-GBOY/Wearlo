/** @format */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Search,
	Bell,
	Sun,
	Moon,
	User,
	Settings,
	LogOut,
	ChevronDown,
	X,
	Menu,
} from "lucide-react";
import { cn } from "../../../utils/cn";
import { useTheme } from "../../../contexts/ThemeContext";
import { Notification } from "../../../types";
import Badge from "../../atoms/Badge";

interface DashboardHeaderProps {
	onMenuToggle: () => void;
	notifications?: Notification[];
	onNotificationClick?: (notification: Notification) => void;
	onMarkAllRead?: () => void;
	user?: {
		name: string;
		email: string;
		avatar?: string;
		role: string;
	};
	onLogout?: () => void;
	className?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
	onMenuToggle,
	notifications = [],
	onNotificationClick,
	onMarkAllRead,
	user = {
		name: "Admin User",
		email: "admin@wearlo.com",
		role: "Administrator",
	},
	onLogout,
	className,
}) => {
	const { theme, toggleTheme } = useTheme();
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	const searchRef = useRef<HTMLDivElement>(null);
	const notificationsRef = useRef<HTMLDivElement>(null);
	const userMenuRef = useRef<HTMLDivElement>(null);

	const unreadNotifications = notifications.filter((n) => !n.read);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				searchRef.current &&
				!searchRef.current.contains(event.target as Node)
			) {
				setIsSearchOpen(false);
			}
			if (
				notificationsRef.current &&
				!notificationsRef.current.contains(event.target as Node)
			) {
				setIsNotificationsOpen(false);
			}
			if (
				userMenuRef.current &&
				!userMenuRef.current.contains(event.target as Node)
			) {
				setIsUserMenuOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		// Implement search functionality
		console.log("Searching for:", searchTerm);
		setIsSearchOpen(false);
		setSearchTerm("");
	};

	const formatNotificationTime = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffInMinutes = Math.floor(
			(now.getTime() - date.getTime()) / (1000 * 60)
		);

		if (diffInMinutes < 1) return "Just now";
		if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
		if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
		return date.toLocaleDateString();
	};

	return (
		<motion.header
			className={cn(
				"bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3",
				"flex items-center justify-between",
				className
			)}
			initial={{ y: -20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.3 }}>
			{/* Left Section */}
			<div className='flex items-center space-x-4'>
				<button
					onClick={onMenuToggle}
					className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden'>
					<Menu className='h-5 w-5 text-gray-600 dark:text-gray-400' />
				</button>

				{/* Search Bar */}
				<div className='relative' ref={searchRef}>
					<AnimatePresence>
						{isSearchOpen ? (
							<motion.form
								initial={{ width: 0, opacity: 0 }}
								animate={{ width: 300, opacity: 1 }}
								exit={{ width: 0, opacity: 0 }}
								transition={{ duration: 0.2 }}
								onSubmit={handleSearch}
								className='flex items-center'>
								<input
									type='text'
									placeholder='Search...'
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
									autoFocus
								/>
								<button
									type='button'
									onClick={() => setIsSearchOpen(false)}
									className='ml-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'>
									<X className='h-4 w-4' />
								</button>
							</motion.form>
						) : (
							<button
								onClick={() => setIsSearchOpen(true)}
								className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'>
								<Search className='h-5 w-5 text-gray-600 dark:text-gray-400' />
							</button>
						)}
					</AnimatePresence>
				</div>
			</div>

			{/* Right Section */}
			<div className='flex items-center space-x-4'>
				{/* Theme Toggle */}
				<button
					onClick={toggleTheme}
					className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'>
					{theme === "dark" ? (
						<Sun className='h-5 w-5 text-yellow-500' />
					) : (
						<Moon className='h-5 w-5 text-gray-600' />
					)}
				</button>

				{/* Notifications */}
				<div className='relative' ref={notificationsRef}>
					<button
						onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
						className='relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'>
						<Bell className='h-5 w-5 text-gray-600 dark:text-gray-400' />
						{unreadNotifications.length > 0 && (
							<Badge
								variant='error'
								size='sm'
								className='absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center'>
								{unreadNotifications.length > 9
									? "9+"
									: unreadNotifications.length}
							</Badge>
						)}
					</button>

					<AnimatePresence>
						{isNotificationsOpen && (
							<motion.div
								initial={{ opacity: 0, y: 10, scale: 0.95 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								exit={{ opacity: 0, y: 10, scale: 0.95 }}
								transition={{ duration: 0.2 }}
								className='absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg z-50'>
								<div className='p-4 border-b border-gray-200 dark:border-gray-700'>
									<div className='flex items-center justify-between'>
										<h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
											Notifications
										</h3>
										{unreadNotifications.length > 0 && (
											<button
												onClick={onMarkAllRead}
												className='text-sm text-blue-600 dark:text-blue-400 hover:underline'>
												Mark all read
											</button>
										)}
									</div>
								</div>

								<div className='max-h-96 overflow-y-auto'>
									{notifications.length === 0 ? (
										<div className='p-4 text-center text-gray-500 dark:text-gray-400'>
											No notifications
										</div>
									) : (
										notifications.map((notification) => (
											<div
												key={notification.id}
												onClick={() => onNotificationClick?.(notification)}
												className={cn(
													"p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors",
													"hover:bg-gray-50 dark:hover:bg-gray-700",
													!notification.read && "bg-blue-50 dark:bg-blue-900/10"
												)}>
												<div className='flex items-start space-x-3'>
													<div className='flex-shrink-0'>
														<Badge
															variant={notification.type}
															size='sm'
															className='w-2 h-2 rounded-full'
														/>
													</div>
													<div className='flex-1 min-w-0'>
														<p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
															{notification.title}
														</p>
														<p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
															{notification.message}
														</p>
														<p className='text-xs text-gray-400 dark:text-gray-500 mt-2'>
															{formatNotificationTime(notification.createdAt)}
														</p>
													</div>
												</div>
											</div>
										))
									)}
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				{/* User Menu */}
				<div className='relative' ref={userMenuRef}>
					<button
						onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
						className='flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'>
						<div className='w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center'>
							{user.avatar ? (
								<img
									src={user.avatar}
									alt={user.name}
									className='w-8 h-8 rounded-full object-cover'
								/>
							) : (
								<User className='h-4 w-4 text-gray-600 dark:text-gray-400' />
							)}
						</div>
						<div className='hidden md:block text-left'>
							<p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
								{user.name}
							</p>
							<p className='text-xs text-gray-500 dark:text-gray-400'>
								{user.role}
							</p>
						</div>
						<ChevronDown className='h-4 w-4 text-gray-400' />
					</button>

					<AnimatePresence>
						{isUserMenuOpen && (
							<motion.div
								initial={{ opacity: 0, y: 10, scale: 0.95 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								exit={{ opacity: 0, y: 10, scale: 0.95 }}
								transition={{ duration: 0.2 }}
								className='absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg z-50'>
								<div className='p-4 border-b border-gray-200 dark:border-gray-700'>
									<p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
										{user.name}
									</p>
									<p className='text-sm text-gray-500 dark:text-gray-400'>
										{user.email}
									</p>
								</div>

								<div className='py-2'>
									<button
										onClick={() => {
											setIsUserMenuOpen(false);
											// Navigate to profile/settings
										}}
										className='flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'>
										<Settings className='h-4 w-4 mr-3' />
										Settings
									</button>
									<button
										onClick={() => {
											setIsUserMenuOpen(false);
											onLogout?.();
										}}
										className='flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors'>
										<LogOut className='h-4 w-4 mr-3' />
										Logout
									</button>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</motion.header>
	);
};

export default DashboardHeader;
