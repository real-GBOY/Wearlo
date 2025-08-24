/** @format */

import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../../utils/cn";

interface BadgeProps {
	children: React.ReactNode;
	variant?:
		| "success"
		| "warning"
		| "error"
		| "info"
		| "default"
		| "destructive";
	size?: "sm" | "md" | "lg";
	className?: string;
}

const Badge: React.FC<BadgeProps> = ({
	children,
	variant = "default",
	size = "md",
	className,
}) => {
	const variantClasses = {
		success: "bg-green-100 text-green-800 border-green-200",
		warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
		error: "bg-red-100 text-red-800 border-red-200",
		info: "bg-blue-100 text-blue-800 border-blue-200",
		default: "bg-gray-100 text-gray-800 border-gray-200",
		destructive: "bg-red-100 text-red-800 border-red-200",
	};

	const sizeClasses = {
		sm: "px-2 py-1 text-xs",
		md: "px-3 py-1.5 text-sm",
		lg: "px-4 py-2 text-base",
	};

	return (
		<motion.span
			className={cn(
				"inline-flex items-center font-medium rounded-full border",
				variantClasses[variant],
				sizeClasses[size],
				className
			)}
			initial={{ scale: 0.9, opacity: 0 }}
			animate={{ scale: 1, opacity: 1 }}
			transition={{ duration: 0.2 }}>
			{children}
		</motion.span>
	);
};

export default Badge;
