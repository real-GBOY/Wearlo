/** @format */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Package, Eye, TrendingDown } from "lucide-react";
import { Button } from "../../atoms/Button";
import { Typography } from "../../atoms/Typography";
import Badge from "../../atoms/Badge";
import { stockService } from "../../../services/stockService";
import { StockAlert } from "../../../types";

interface StockAlertsWidgetProps {
	threshold?: number;
	maxAlerts?: number;
	onViewProduct?: (productId: string) => void;
	className?: string;
}

const StockAlertsWidget: React.FC<StockAlertsWidgetProps> = ({
	threshold = 10,
	maxAlerts = 5,
	onViewProduct,
	className = "",
}) => {
	const [alerts, setAlerts] = useState<StockAlert[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [stats, setStats] = useState({
		totalAlerts: 0,
		outOfStock: 0,
		lowStock: 0,
	});

	useEffect(() => {
		fetchAlerts();
	}, [threshold]);

	const fetchAlerts = async () => {
		try {
			setLoading(true);
			const response = await stockService.getAlerts(threshold);
			setAlerts(response.data.slice(0, maxAlerts));
			setStats({
				totalAlerts: response.totalAlerts,
				outOfStock: response.outOfStock,
				lowStock: response.lowStock,
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to fetch alerts");
		} finally {
			setLoading(false);
		}
	};

	const getAlertIcon = (alertLevel: "Out of Stock" | "Low Stock") => {
		if (alertLevel === "Out of Stock") {
			return <Package className='h-4 w-4 text-red-500' />;
		}
		return <TrendingDown className='h-4 w-4 text-orange-500' />;
	};

	const getAlertBadgeVariant = (alertLevel: "Out of Stock" | "Low Stock") => {
		if (alertLevel === "Out of Stock") {
			return "destructive" as const;
		}
		return "warning" as const;
	};

	if (loading) {
		return (
			<div
				className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
				<div className='animate-pulse space-y-4'>
					<div className='h-4 bg-gray-200 rounded w-1/3'></div>
					<div className='space-y-3'>
						<div className='h-12 bg-gray-200 rounded'></div>
						<div className='h-12 bg-gray-200 rounded'></div>
						<div className='h-12 bg-gray-200 rounded'></div>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div
				className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
				<div className='text-center'>
					<AlertTriangle className='h-8 w-8 text-red-500 mx-auto mb-2' />
					<Typography variant='body2' className='text-red-600 mb-3'>
						{error}
					</Typography>
					<Button onClick={fetchAlerts} variant='outline' size='sm'>
						Retry
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
			{/* Header */}
			<div className='p-6 border-b border-gray-200'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center space-x-3'>
						<div className='p-2 bg-red-100 rounded-lg'>
							<AlertTriangle className='h-5 w-5 text-red-600' />
						</div>
						<div>
							<Typography variant='h3' className='text-gray-900'>
								Stock Alerts
							</Typography>
							<Typography variant='body2' className='text-gray-600'>
								Threshold: {threshold} units
							</Typography>
						</div>
					</div>
					<div className='text-right'>
						<Typography variant='h4' className='text-red-600 font-bold'>
							{stats.totalAlerts}
						</Typography>
						<Typography variant='body2' className='text-gray-600'>
							Total Alerts
						</Typography>
					</div>
				</div>
			</div>

			{/* Stats Row */}
			<div className='px-6 py-4 bg-gray-50 border-b border-gray-200'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center space-x-4'>
						<div className='flex items-center space-x-2'>
							<div className='w-3 h-3 bg-red-500 rounded-full'></div>
							<Typography variant='body2' className='text-gray-700'>
								Out of Stock: {stats.outOfStock}
							</Typography>
						</div>
						<div className='flex items-center space-x-2'>
							<div className='w-3 h-3 bg-orange-500 rounded-full'></div>
							<Typography variant='body2' className='text-gray-700'>
								Low Stock: {stats.lowStock}
							</Typography>
						</div>
					</div>
				</div>
			</div>

			{/* Alerts List */}
			<div className='p-6'>
				{alerts.length === 0 ? (
					<div className='text-center py-8'>
						<Package className='h-12 w-12 text-green-500 mx-auto mb-3' />
						<Typography variant='h4' className='text-gray-900 mb-2'>
							All Good!
						</Typography>
						<Typography variant='body2' className='text-gray-600'>
							No stock alerts at the moment. All products are well-stocked.
						</Typography>
					</div>
				) : (
					<div className='space-y-4'>
						{alerts.map((alert) => (
							<motion.div
								key={alert.productId}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								className='border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors'>
								<div className='flex items-start justify-between'>
									<div className='flex-1'>
										<div className='flex items-center space-x-2 mb-2'>
											{getAlertIcon(alert.alertLevel)}
											<Typography
												variant='body1'
												className='font-medium text-gray-900'>
												{alert.name}
											</Typography>
											<Badge variant={getAlertBadgeVariant(alert.alertLevel)}>
												{alert.alertLevel}
											</Badge>
										</div>

										<div className='flex items-center space-x-4 text-sm text-gray-600 mb-3'>
											<span>Category: {alert.category}</span>
											<span>Total Stock: {alert.totalStock}</span>
										</div>

										{alert.lowStockSizes.length > 0 && (
											<div className='space-y-2'>
												<Typography
													variant='body2'
													className='text-gray-700 font-medium'>
													Low Stock Sizes:
												</Typography>
												<div className='flex flex-wrap gap-2'>
													{alert.lowStockSizes.map((size) => (
														<div
															key={size.label}
															className='bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium'>
															{size.label}: {size.stock}
														</div>
													))}
												</div>
											</div>
										)}
									</div>

									{onViewProduct && (
										<Button
											variant='outline'
											size='sm'
											onClick={() => onViewProduct(alert.productId)}
											className='ml-4'>
											<Eye className='h-4 w-4 mr-1' />
											View
										</Button>
									)}
								</div>
							</motion.div>
						))}
					</div>
				)}

				{/* View All Button */}
				{alerts.length > 0 && alerts.length < stats.totalAlerts && (
					<div className='mt-6 text-center'>
						<Typography variant='body2' className='text-gray-600 mb-2'>
							Showing {alerts.length} of {stats.totalAlerts} alerts
						</Typography>
						<Button variant='outline' size='sm'>
							View All Alerts
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};

export default StockAlertsWidget;
