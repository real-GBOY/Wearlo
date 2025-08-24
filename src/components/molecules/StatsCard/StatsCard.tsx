/** @format */

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "../../../utils/cn";

interface StatsCardProps {
	title: string;
	value: string | number;
	change?: number;
	changeType?: "increase" | "decrease";
	icon: LucideIcon;
	iconColor?: string;
	className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
	title,
	value,
	change,
	changeType,
	icon: Icon,
	iconColor = "text-blue-600",
	className,
}) => {
	const formatChange = (changeValue: number) => {
		const absValue = Math.abs(changeValue);
		return `${changeValue >= 0 ? "+" : "-"}${absValue.toFixed(1)}%`;
	};

	const getChangeColor = (changeValue: number) => {
		if (changeValue >= 0) return "text-green-600";
		return "text-red-600";
	};

	return (
		<motion.div
			className={cn(
				"bg-white rounded-lg border border-gray-200 p-6",
				"hover:shadow-lg transition-all duration-200",
				className
			)}
			whileHover={{ y: -2 }}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}>
			<div className='flex items-center justify-between'>
				<div className='flex-1'>
					<p className='text-sm font-medium text-gray-600 mb-1'>{title}</p>
					<p className='text-2xl font-bold text-gray-900'>{value}</p>
					{change !== undefined && (
						<div className='flex items-center mt-2'>
							{changeType === "increase" ? (
								<TrendingUp className='h-4 w-4 text-green-600 mr-1' />
							) : (
								<TrendingDown className='h-4 w-4 text-red-600 mr-1' />
							)}
							<span
								className={cn("text-sm font-medium", getChangeColor(change))}>
								{formatChange(change)}
							</span>
							<span className='text-sm text-gray-500 ml-1'>
								from last month
							</span>
						</div>
					)}
				</div>
				<div
					className={cn(
						"p-3 rounded-full bg-gray-50",
						iconColor
							.replace("text-", "bg-")
							.replace("-600", "-100")
							.replace("-400", "-900/20")
					)}>
					<Icon className={cn("h-6 w-6", iconColor)} />
				</div>
			</div>
		</motion.div>
	);
};

export default StatsCard;
