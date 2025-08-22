/** @format */

import React from "react";
import { motion } from "framer-motion";

interface ButtonProps {
	children: React.ReactNode;
	variant?: "primary" | "secondary" | "outline";
	size?: "sm" | "md" | "lg";
	type?: "button" | "submit" | "reset";
	onClick?: () => void;
	disabled?: boolean;
	className?: string;
}

export const Button: React.FC<ButtonProps> = ({
	children,
	variant = "primary",
	size = "md",
	type = "button",
	onClick,
	disabled = false,
	className = "",
}) => {
	const baseClasses =
		"font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

	const variantClasses = {
		primary:
			"bg-black text-white hover:bg-gray-800 focus:ring-gray-500 dark:bg-white dark:text-black dark:hover:bg-gray-200",
		secondary:
			"bg-white text-black border border-black hover:bg-black hover:text-white focus:ring-gray-500 dark:bg-black dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black",
		outline:
			"border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800",
	};

	const sizeClasses = {
		sm: "px-4 py-2 text-sm",
		md: "px-6 py-3 text-base",
		lg: "px-8 py-4 text-lg",
	};

	const disabledClasses = disabled
		? "opacity-50 cursor-not-allowed"
		: "cursor-pointer";

	return (
		<motion.button
			type={type}
			whileHover={!disabled ? { scale: 1.02 } : {}}
			whileTap={!disabled ? { scale: 0.98 } : {}}
			className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
			onClick={onClick}
			disabled={disabled}>
			{children}
		</motion.button>
	);
};
