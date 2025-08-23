/** @format */

import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../../utils/cn";

interface CardProps {
	children: React.ReactNode;
	className?: string;
	hover?: boolean;
	padding?: "sm" | "md" | "lg";
	shadow?: "sm" | "md" | "lg";
}

const Card: React.FC<CardProps> = ({
	children,
	className,
	hover = true,
	padding = "md",
	shadow = "md",
}) => {
	const paddingClasses = {
		sm: "p-3",
		md: "p-6",
		lg: "p-8",
	};

	const shadowClasses = {
		sm: "shadow-sm",
		md: "shadow-md",
		lg: "shadow-lg",
	};

	return (
		<motion.div
			className={cn(
				"bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700",
				paddingClasses[padding],
				shadowClasses[shadow],
				hover && "transition-all duration-200 ease-in-out",
				className
			)}
			whileHover={
				hover
					? {
							y: -2,
							boxShadow:
								"0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
							borderColor: "rgb(59 130 246)",
					  }
					: {}
			}
			transition={{ duration: 0.2 }}>
			{children}
		</motion.div>
	);
};

export default Card;
