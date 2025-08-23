/** @format */

import React from "react";
import { motion } from "framer-motion";
import {
	DollarSign,
	ShoppingCart,
	Package,
	Users,
	TrendingUp,
	AlertTriangle,
	Clock,
	Activity,
} from "lucide-react";
import { cn } from "../../utils/cn";
import StatsCard from "../../components/molecules/StatsCard";
import DataTable from "../../components/molecules/DataTable";
import Card from "../../components/atoms/Card";
import Badge from "../../components/atoms/Badge";
import {
	mockAnalytics,
	mockOrders,
	mockDashboardProducts,
	mockNotifications,
} from "../../data/dashboardData";

const DashboardOverviewScreen: React.FC = () => {
	const recentOrders = mockOrders.slice(0, 5);
	const lowStockProducts = mockDashboardProducts.filter(
		(p) => p.stock <= p.lowStockThreshold
	);
	const recentNotifications = mockNotifications.slice(0, 5);

	const orderColumns = [
		{ key: "id", label: "Order ID", width: "w-32" },
		{ key: "customerName", label: "Customer" },
		{
			key: "total",
			label: "Total",
			render: (value: number) => `$${value.toFixed(2)}`,
		},
		{
			key: "status",
			label: "Status",
			render: (value: string) => {
				const statusConfig = {
					pending: { variant: "warning" as const, label: "Pending" },
					processing: { variant: "info" as const, label: "Processing" },
					shipped: { variant: "info" as const, label: "Shipped" },
					delivered: { variant: "success" as const, label: "Delivered" },
					cancelled: { variant: "error" as const, label: "Cancelled" },
				};
				const config = statusConfig[value as keyof typeof statusConfig];
				return <Badge variant={config.variant}>{config.label}</Badge>;
			},
		},
		{
			key: "createdAt",
			label: "Date",
			render: (value: string) => new Date(value).toLocaleDateString(),
		},
	];

	const getStatusVariant = (stock: number, threshold: number) => {
		if (stock === 0) return "error";
		if (stock <= threshold) return "warning";
		return "success";
	};

	const getStatusLabel = (stock: number, threshold: number) => {
		if (stock === 0) return "Out of Stock";
		if (stock <= threshold) return "Low Stock";
		return "In Stock";
	};

	return (
		<div className='space-y-6'>
			{/* Page Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
						Dashboard Overview
					</h1>
					<p className='text-gray-600 dark:text-gray-400 mt-1'>
						Welcome back! Here's what's happening with your store today.
					</p>
				</div>
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
					View Reports
				</motion.button>
			</div>

			{/* Stats Cards */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
				<StatsCard
					title='Total Revenue'
					value={`$${mockAnalytics.totalRevenue.toLocaleString()}`}
					change={mockAnalytics.revenueGrowth}
					changeType='increase'
					icon={DollarSign}
					iconColor='text-green-600'
				/>
				<StatsCard
					title='Total Orders'
					value={mockAnalytics.totalOrders}
					change={mockAnalytics.orderGrowth}
					changeType='increase'
					icon={ShoppingCart}
					iconColor='text-blue-600'
				/>
				<StatsCard
					title='Total Products'
					value={mockAnalytics.totalProducts}
					icon={Package}
					iconColor='text-purple-600'
				/>
				<StatsCard
					title='Total Users'
					value={mockAnalytics.totalUsers}
					icon={Users}
					iconColor='text-orange-600'
				/>
			</div>

			{/* Main Content Grid */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* Recent Orders */}
				<div className='lg:col-span-2'>
					<Card>
						<div className='flex items-center justify-between mb-4'>
							<h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
								Recent Orders
							</h2>
							<button className='text-sm text-blue-600 dark:text-blue-400 hover:underline'>
								View All
							</button>
						</div>
						<DataTable
							data={recentOrders}
							columns={orderColumns}
							searchable={false}
							pagination={false}
							onView={(order) => console.log("View order:", order)}
							onEdit={(order) => console.log("Edit order:", order)}
							className='border-0 shadow-none'
						/>
					</Card>
				</div>

				{/* Low Stock Alerts */}
				<div className='space-y-6'>
					<Card>
						<div className='flex items-center justify-between mb-4'>
							<h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
								Low Stock Alerts
							</h2>
							<AlertTriangle className='h-5 w-5 text-yellow-500' />
						</div>
						<div className='space-y-3'>
							{lowStockProducts.map((product) => (
								<div
									key={product.id}
									className='flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800'>
									<div className='flex-1'>
										<p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
											{product.name}
										</p>
										<p className='text-xs text-gray-500 dark:text-gray-400'>
											SKU: {product.sku}
										</p>
									</div>
									<div className='text-right'>
										<Badge
											variant={getStatusVariant(
												product.stock,
												product.lowStockThreshold
											)}
											size='sm'>
											{product.stock} left
										</Badge>
									</div>
								</div>
							))}
							{lowStockProducts.length === 0 && (
								<p className='text-sm text-gray-500 dark:text-gray-400 text-center py-4'>
									All products are well stocked!
								</p>
							)}
						</div>
					</Card>

					{/* Recent Activity */}
					<Card>
						<div className='flex items-center justify-between mb-4'>
							<h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
								Recent Activity
							</h2>
							<Activity className='h-5 w-5 text-blue-500' />
						</div>
						<div className='space-y-3'>
							{recentNotifications.map((notification) => (
								<div
									key={notification.id}
									className={cn(
										"flex items-start space-x-3 p-3 rounded-lg",
										!notification.read && "bg-blue-50 dark:bg-blue-900/10"
									)}>
									<div className='flex-shrink-0 mt-1'>
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
										<div className='flex items-center mt-2 text-xs text-gray-400 dark:text-gray-500'>
											<Clock className='h-3 w-3 mr-1' />
											{new Date(notification.createdAt).toLocaleDateString()}
										</div>
									</div>
								</div>
							))}
						</div>
					</Card>
				</div>
			</div>

			{/* Top Selling Products */}
			<Card>
				<div className='flex items-center justify-between mb-6'>
					<h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
						Top Selling Products
					</h2>
					<TrendingUp className='h-5 w-5 text-green-500' />
				</div>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{mockAnalytics.topSellingProducts.map((product, index) => (
						<motion.div
							key={product.id}
							className='p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow'
							whileHover={{ y: -2 }}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: index * 0.1 }}>
							<div className='flex items-center justify-between mb-2'>
								<span className='text-sm font-medium text-gray-900 dark:text-gray-100'>
									#{index + 1}
								</span>
								<Badge variant='success' size='sm'>
									{product.sales} sold
								</Badge>
							</div>
							<h3 className='font-medium text-gray-900 dark:text-gray-100 mb-2'>
								{product.name}
							</h3>
							<p className='text-lg font-bold text-green-600 dark:text-green-400'>
								${product.revenue.toLocaleString()}
							</p>
						</motion.div>
					))}
				</div>
			</Card>
		</div>
	);
};

export default DashboardOverviewScreen;
