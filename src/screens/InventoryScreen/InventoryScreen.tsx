/** @format */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	Plus,
	Package,
	TrendingUp,
	AlertTriangle,
	DollarSign,
	RefreshCw,
} from "lucide-react";
import DataTable from "../../components/molecules/DataTable";
import { Button } from "../../components/atoms/Button";
import Badge from "../../components/atoms/Badge";
import ProductViewModal from "../../components/molecules/ProductViewModal";
import ProductEditModal from "../../components/molecules/ProductEditModal";
import StockUpdateModal from "../../components/molecules/StockUpdateModal";
import { productService } from "../../services/productService";
import { stockService } from "../../services/stockService";
import { Product, StockUpdateRequest } from "../../types";

interface InventoryStats {
	totalProducts: number;
	lowStockItems: number;
	totalValue: number;
	activeProducts: number;
}

const InventoryScreen: React.FC = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [stats, setStats] = useState<InventoryStats>({
		totalProducts: 0,
		lowStockItems: 0,
		totalValue: 0,
		activeProducts: 0,
	});

	// Modal states
	const [viewModalOpen, setViewModalOpen] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [stockUpdateModalOpen, setStockUpdateModalOpen] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

	const fetchProducts = async (page: number = 1) => {
		try {
			setLoading(true);
			const response = await productService.getAll(page, 20);
			setProducts(response.items);
			setTotalPages(Math.ceil(response.total / 20));
			setCurrentPage(page);

			// Calculate stats
			const lowStockThreshold = 10;
			const lowStockItems = response.items.filter(
				(p) => p.stock <= lowStockThreshold
			).length;
			const totalValue = response.items.reduce(
				(sum, p) => sum + p.price * p.stock,
				0
			);
			const activeProducts = response.items.filter((p) => p.stock > 0).length;

			setStats({
				totalProducts: response.total,
				lowStockItems,
				totalValue,
				activeProducts,
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to fetch products");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchProducts();
	}, []);

	const handlePageChange = (page: number) => {
		fetchProducts(page);
	};

	const handleEdit = (product: Product) => {
		setSelectedProduct(product);
		setEditModalOpen(true);
	};

	const handleDelete = async (product: Product) => {
		if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
			try {
				await productService.delete(product.id);
				await fetchProducts(currentPage);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to delete product"
				);
			}
		}
	};

	const handleView = (product: Product) => {
		setSelectedProduct(product);
		setViewModalOpen(true);
	};

	const handleStockUpdate = (product: Product) => {
		setSelectedProduct(product);
		setStockUpdateModalOpen(true);
	};

	const handleStockUpdateSubmit = async (data: StockUpdateRequest) => {
		if (!selectedProduct) return;

		try {
			// Update the product stock using the stock service
			if (data.size) {
				await stockService.updateSizeStock(selectedProduct.id, data.size, data);
			} else {
				await stockService.updateProductStock(selectedProduct.id, data);
			}

			// Refresh the products to show updated stock
			await fetchProducts(currentPage);
		} catch (error) {
			throw error;
		}
	};

	const handleEditSave = async (updatedProduct: Product) => {
		try {
			// Update the product in the local state
			setProducts((prevProducts) =>
				prevProducts.map((p) =>
					p.id === updatedProduct.id ? updatedProduct : p
				)
			);

			// Recalculate stats
			await fetchProducts(currentPage);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to update product");
		}
	};

	const closeViewModal = () => {
		setViewModalOpen(false);
		setSelectedProduct(null);
	};

	const closeEditModal = () => {
		setEditModalOpen(false);
		setSelectedProduct(null);
	};

	const closeStockUpdateModal = () => {
		setStockUpdateModalOpen(false);
		setSelectedProduct(null);
	};

	const columns = [
		{
			key: "name" as keyof Product,
			label: "Product Name",
			sortable: true,
			width: "w-1/4",
		},
		{
			key: "categoryName" as keyof Product,
			label: "Category",
			sortable: true,
			width: "w-1/6",
		},
		{
			key: "stock" as keyof Product,
			label: "Stock",
			sortable: true,
			width: "w-1/6",
			render: (value: number) => (
				<div className='flex items-center space-x-2'>
					<span className={value <= 10 ? "text-red-600 font-semibold" : ""}>
						{value}
					</span>
					{value <= 10 && <AlertTriangle className='h-4 w-4 text-red-500' />}
				</div>
			),
		},
		{
			key: "price" as keyof Product,
			label: "Price",
			sortable: true,
			width: "w-1/6",
			render: (value: number) => (
				<span className='font-medium'>${value.toFixed(2)}</span>
			),
		},
		{
			key: "discount" as keyof Product,
			label: "Discount",
			sortable: true,
			width: "w-1/6",
			render: (value: number | undefined) => (
				<span
					className={value ? "text-green-600 font-medium" : "text-gray-400"}>
					{value ? `${value}%` : "No discount"}
				</span>
			),
		},
		{
			key: "status" as keyof Product,
			label: "Status",
			sortable: true,
			width: "w-1/6",
			render: (value: any, product: Product) => {
				const stockStatus = stockService.calculateStockStatus(
					product.stock,
					10
				);
				return (
					<Badge variant={stockService.getStockStatusBadgeVariant(stockStatus)}>
						{stockStatus}
					</Badge>
				);
			},
		},
		{
			key: "actions" as keyof Product,
			label: "Actions",
			sortable: false,
			width: "w-1/6",
			render: (value: any, product: Product) => (
				<div className='flex items-center space-x-2'>
					<Button
						variant='outline'
						size='sm'
						onClick={() => handleStockUpdate(product)}
						className='text-xs px-2 py-1'>
						<Package className='h-3 w-3 mr-1' />
						Update Stock
					</Button>
				</div>
			),
		},
	];

	const StatCard: React.FC<{
		title: string;
		value: string | number;
		icon: React.ReactNode;
		trend?: string;
		className?: string;
	}> = ({ title, value, icon, trend, className }) => (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
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

	if (error) {
		return (
			<div className='p-6 text-center'>
				<div className='text-red-600 text-lg font-semibold mb-4'>{error}</div>
				<Button onClick={() => fetchProducts()}>Retry</Button>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-50 p-6'>
			<div className='max-w-7xl mx-auto space-y-6'>
				{/* Header */}
				<div className='flex items-center justify-between'>
					<div>
						<h1 className='text-3xl font-bold text-gray-900'>
							Inventory Management
						</h1>
						<p className='text-gray-600 mt-2'>
							Monitor and manage your product inventory
						</p>
					</div>
					<div className='flex items-center space-x-3'>
						<Button
							onClick={() => fetchProducts()}
							className='flex items-center space-x-2'>
							<RefreshCw className='h-4 w-4' />
							<span>Refresh</span>
						</Button>
						<Button className='flex items-center space-x-2'>
							<Plus className='h-4 w-4' />
							<span>Add Product</span>
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
						title='Low Stock Items'
						value={stats.lowStockItems}
						icon={<AlertTriangle className='h-6 w-6 text-orange-600' />}
						trend='Requires attention'
						className={stats.lowStockItems > 0 ? "ring-2 ring-orange-200" : ""}
					/>
					<StatCard
						title='Total Inventory Value'
						value={`$${stats.totalValue.toLocaleString()}`}
						icon={<DollarSign className='h-6 w-6 text-green-600' />}
						trend='+8% from last month'
					/>
					<StatCard
						title='Active Products'
						value={stats.activeProducts}
						icon={<TrendingUp className='h-6 w-6 text-purple-600' />}
						trend='+5% from last month'
					/>
				</div>

				{/* Inventory Table */}
				<div className='bg-white rounded-lg border border-gray-200'>
					<div className='p-6 border-b border-gray-200'>
						<h2 className='text-xl font-semibold text-gray-900'>
							Product Inventory
						</h2>
						<p className='text-gray-600 mt-1'>
							Manage your product catalog and stock levels
						</p>
					</div>

					<DataTable
						data={products}
						columns={columns}
						searchable={true}
						sortable={true}
						pagination={false}
						onEdit={handleEdit}
						onDelete={handleDelete}
						onView={handleView}
						loading={loading}
						emptyMessage='No products found in inventory'
					/>

					{/* Custom Pagination */}
					{totalPages > 1 && (
						<div className='px-6 py-4 border-t border-gray-200 flex items-center justify-between'>
							<div className='text-sm text-gray-700'>
								Showing {(currentPage - 1) * 20 + 1} to{" "}
								{Math.min(currentPage * 20, stats.totalProducts)} of{" "}
								{stats.totalProducts} results
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

			{/* Modals */}
			<ProductViewModal
				product={selectedProduct}
				isOpen={viewModalOpen}
				onClose={closeViewModal}
			/>

			<ProductEditModal
				product={selectedProduct}
				isOpen={editModalOpen}
				onClose={closeEditModal}
				onSave={handleEditSave}
			/>

			<StockUpdateModal
				isOpen={stockUpdateModalOpen}
				onClose={closeStockUpdateModal}
				onSubmit={handleStockUpdateSubmit}
				productName={selectedProduct?.name || ""}
				currentStock={selectedProduct?.stock || 0}
				loading={false}
			/>
		</div>
	);
};

export default InventoryScreen;
