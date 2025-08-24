/** @format */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	Package,
	TrendingUp,
	AlertTriangle,
	DollarSign,
	BarChart3,
	RefreshCw,
	Plus,
	Download,
	Filter,
} from "lucide-react";
import { Button } from "../../components/atoms/Button";
import { Typography } from "../../components/atoms/Typography";
import Badge from "../../components/atoms/Badge";
import DataTable from "../../components/molecules/DataTable";
import StockAlertsWidget from "../../components/molecules/StockAlertsWidget";
import StockUpdateModal from "../../components/molecules/StockUpdateModal";
import { stockService } from "../../services/stockService";
import { StockOverview, StockUpdateRequest } from "../../types";

interface StockDashboardStats {
	totalProducts: number;
	inStock: number;
	outOfStock: number;
	lowStock: number;
	totalValue: number;
	lowStockThreshold: number;
}

const StockDashboardScreen: React.FC = () => {
	const [stockOverview, setStockOverview] = useState<StockOverview[]>([]);
	const [stats, setStats] = useState<StockDashboardStats>({
		totalProducts: 0,
		inStock: 0,
		outOfStock: 0,
		lowStock: 0,
		totalValue: 0,
		lowStockThreshold: 10,
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const [categoryFilter, setCategoryFilter] = useState<string>("all");
	const [stockStatusFilter, setStockStatusFilter] = useState<string>("all");

	// Modal states
	const [stockUpdateModalOpen, setStockUpdateModalOpen] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<StockOverview | null>(
		null
	);

	const fetchStockOverview = async () => {
		try {
			setLoading(true);
			const response = await stockService.getOverview();
			setStockOverview(response.data);
			setStats({
				totalProducts: response.totalProducts,
				inStock: response.inStock,
				outOfStock: response.outOfStock,
				lowStock: response.lowStock,
				totalValue: response.data.reduce(
					(sum, item) => sum + item.totalStock * 0,
					0
				), // Placeholder for price calculation
				lowStockThreshold: 10,
			});
			setTotalPages(Math.ceil(response.data.length / 20));
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to fetch stock overview"
			);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchStockOverview();
	}, []);

	const handleStockUpdate = async (data: StockUpdateRequest) => {
		if (!selectedProduct) return;

		try {
			if (data.size) {
				await stockService.updateSizeStock(
					selectedProduct.productId,
					data.size,
					data
				);
			} else {
				await stockService.updateProductStock(selectedProduct.productId, data);
			}

			// Refresh the stock overview
			await fetchStockOverview();
		} catch (error) {
			throw error;
		}
	};

	const handleOpenStockUpdate = (product: StockOverview) => {
		setSelectedProduct(product);
		setStockUpdateModalOpen(true);
	};

	const closeStockUpdateModal = () => {
		setStockUpdateModalOpen(false);
		setSelectedProduct(null);
	};

	// Filter and paginate data
	const filteredData = stockOverview.filter((item) => {
		const matchesSearch =
			item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.category.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesCategory =
			categoryFilter === "all" || item.category === categoryFilter;
		const matchesStatus =
			stockStatusFilter === "all" || item.stockStatus === stockStatusFilter;

		return matchesSearch && matchesCategory && matchesStatus;
	});

	const paginatedData = filteredData.slice(
		(currentPage - 1) * 20,
		currentPage * 20
	);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const StatCard: React.FC<{
		title: string;
		value: string | number;
		icon: React.ReactNode;
		trend?: string;
		className?: string;
		onClick?: () => void;
	}> = ({ title, value, icon, trend, className, onClick }) => (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className={`bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:border-gray-300 transition-colors ${className}`}
			onClick={onClick}>
			<div className='flex items-center justify-between'>
				<div>
					<p className='text-sm font-medium text-gray-600'>{title}</p>
					<p className='text-2xl font-bold text-gray-900'>{value}</p>
					{trend && <p className='text-sm text-green-600'>{trend}</p>}
				</div>
				<div className='p-3 bg-blue-100 rounded-lg'>{icon}</div>
			</div>
		</motion.div>
	);

	const columns = [
		{
			key: "name" as keyof StockOverview,
			label: "Product Name",
			sortable: true,
			width: "w-1/4",
		},
		{
			key: "category" as keyof StockOverview,
			label: "Category",
			sortable: true,
			width: "w-1/6",
		},
		{
			key: "totalStock" as keyof StockOverview,
			label: "Total Stock",
			sortable: true,
			width: "w-1/6",
			render: (value: number, item: StockOverview) => (
				<div className='flex items-center space-x-2'>
					<span
						className={
							stockService.isLowStock(value, stats.lowStockThreshold)
								? "text-red-600 font-semibold"
								: ""
						}>
						{value}
					</span>
					{stockService.isLowStock(value, stats.lowStockThreshold) && (
						<AlertTriangle className='h-4 w-4 text-red-500' />
					)}
				</div>
			),
		},
		{
			key: "stockStatus" as keyof StockOverview,
			label: "Status",
			sortable: true,
			width: "w-1/6",
			render: (value: "In Stock" | "Out of Stock" | "Low Stock") => (
				<Badge variant={stockService.getStockStatusBadgeVariant(value)}>
					{value}
				</Badge>
			),
		},
		{
			key: "lastUpdated" as keyof StockOverview,
			label: "Last Updated",
			sortable: true,
			width: "w-1/6",
			render: (value: string) => (
				<span className='text-sm text-gray-600'>
					{new Date(value).toLocaleDateString()}
				</span>
			),
		},
	];

	if (error) {
		return (
			<div className='p-6 text-center'>
				<div className='text-red-600 text-lg font-semibold mb-4'>{error}</div>
				<Button onClick={fetchStockOverview}>Retry</Button>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-50 p-6'>
			<div className='max-w-7xl mx-auto space-y-6'>
				{/* Header */}
				<div className='flex items-center justify-between'>
					<div>
						<Typography
							variant='h1'
							className='text-3xl font-bold text-gray-900'>
							Stock Dashboard
						</Typography>
						<Typography variant='body1' className='text-gray-600 mt-2'>
							Monitor and manage your product inventory in real-time
						</Typography>
					</div>
					<div className='flex items-center space-x-3'>
						<Button variant='outline' className='flex items-center space-x-2'>
							<Download className='h-4 w-4' />
							<span>Export</span>
						</Button>
						<Button
							onClick={fetchStockOverview}
							className='flex items-center space-x-2'>
							<RefreshCw className='h-4 w-4' />
							<span>Refresh</span>
						</Button>
					</div>
				</div>

				{/* Stats Grid */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
					<StatCard
						title='Total Products'
						value={stats.totalProducts}
						icon={<Package className='h-6 w-6 text-blue-600' />}
						trend='+12% from last month'
					/>
					<StatCard
						title='In Stock'
						value={stats.inStock}
						icon={<TrendingUp className='h-6 w-6 text-green-600' />}
						trend='+8% from last month'
					/>
					<StatCard
						title='Low Stock Items'
						value={stats.lowStock}
						icon={<AlertTriangle className='h-6 w-6 text-orange-600' />}
						trend='Requires attention'
						className={stats.lowStock > 0 ? "ring-2 ring-orange-200" : ""}
					/>
					<StatCard
						title='Out of Stock'
						value={stats.outOfStock}
						icon={<Package className='h-6 w-6 text-red-600' />}
						trend='Critical'
						className={stats.outOfStock > 0 ? "ring-2 ring-red-200" : ""}
					/>
				</div>

				{/* Main Content Grid */}
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					{/* Stock Overview Table */}
					<div className='lg:col-span-2'>
						<div className='bg-white rounded-lg border border-gray-200'>
							<div className='p-6 border-b border-gray-200'>
								<div className='flex items-center justify-between'>
									<div>
										<Typography
											variant='h2'
											className='text-xl font-semibold text-gray-900'>
											Stock Overview
										</Typography>
										<Typography variant='body2' className='text-gray-600 mt-1'>
											Real-time inventory status for all products
										</Typography>
									</div>
									<Button
										onClick={() => setStockUpdateModalOpen(true)}
										className='flex items-center space-x-2'>
										<Plus className='h-4 w-4' />
										<span>Update Stock</span>
									</Button>
								</div>

								{/* Filters */}
								<div className='flex items-center space-x-4 mt-4'>
									<div className='flex-1'>
										<input
											type='text'
											placeholder='Search products...'
											value={searchTerm}
											onChange={(e) => setSearchTerm(e.target.value)}
											className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
										/>
									</div>
									<select
										value={categoryFilter}
										onChange={(e) => setCategoryFilter(e.target.value)}
										className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'>
										<option value='all'>All Categories</option>
										{Array.from(
											new Set(stockOverview.map((item) => item.category))
										).map((category) => (
											<option key={category} value={category}>
												{category}
											</option>
										))}
									</select>
									<select
										value={stockStatusFilter}
										onChange={(e) => setStockStatusFilter(e.target.value)}
										className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'>
										<option value='all'>All Status</option>
										<option value='In Stock'>In Stock</option>
										<option value='Low Stock'>Low Stock</option>
										<option value='Out of Stock'>Out of Stock</option>
									</select>
								</div>
							</div>

							<DataTable
								data={paginatedData}
								columns={columns}
								searchable={false}
								sortable={true}
								pagination={false}
								onEdit={(item) => handleOpenStockUpdate(item)}
								onView={(item) => handleOpenStockUpdate(item)}
								loading={loading}
								emptyMessage='No products found in stock overview'
							/>

							{/* Custom Pagination */}
							{totalPages > 1 && (
								<div className='px-6 py-4 border-t border-gray-200 flex items-center justify-between'>
									<div className='text-sm text-gray-700'>
										Showing {(currentPage - 1) * 20 + 1} to{" "}
										{Math.min(currentPage * 20, filteredData.length)} of{" "}
										{filteredData.length} results
									</div>
									<div className='flex items-center space-x-2'>
										<Button
											variant='outline'
											onClick={() => handlePageChange(currentPage - 1)}
											disabled={currentPage === 1}
											className='px-3 py-1'>
											Previous
										</Button>
										<span className='px-3 py-1 text-sm text-gray-700'>
											Page {currentPage} of {totalPages}
										</span>
										<Button
											variant='outline'
											onClick={() => handlePageChange(currentPage + 1)}
											disabled={currentPage === totalPages}
											className='px-3 py-1'>
											Next
										</Button>
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Right Sidebar */}
					<div className='space-y-6'>
						{/* Stock Alerts Widget */}
						<StockAlertsWidget
							threshold={stats.lowStockThreshold}
							maxAlerts={5}
							onViewProduct={(productId) => {
								const product = stockOverview.find(
									(p) => p.productId === productId
								);
								if (product) {
									handleOpenStockUpdate(product);
								}
							}}
						/>

						{/* Quick Actions */}
						<div className='bg-white rounded-lg border border-gray-200 p-6'>
							<Typography
								variant='h3'
								className='text-lg font-semibold text-gray-900 mb-4'>
								Quick Actions
							</Typography>
							<div className='space-y-3'>
								<Button
									variant='outline'
									className='w-full justify-start'
									onClick={() => setStockUpdateModalOpen(true)}>
									<Plus className='h-4 w-4 mr-2' />
									Update Stock
								</Button>
								<Button variant='outline' className='w-full justify-start'>
									<BarChart3 className='h-4 w-4 mr-2' />
									Generate Report
								</Button>
								<Button variant='outline' className='w-full justify-start'>
									<Download className='h-4 w-4 mr-2' />
									Export Data
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Stock Update Modal */}
			<StockUpdateModal
				isOpen={stockUpdateModalOpen}
				onClose={closeStockUpdateModal}
				onSubmit={handleStockUpdate}
				productName={selectedProduct?.name || ""}
				currentStock={selectedProduct?.totalStock || 0}
				sizeLabel={selectedProduct?.sizeStock[0]?.label}
			/>
		</div>
	);
};

export default StockDashboardScreen;
