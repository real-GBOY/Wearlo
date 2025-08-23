/** @format */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Plus,
	Filter,
	Download,
	Upload,
	Edit,
	Trash2,
	Eye,
	Package,
	Tag,
} from "lucide-react";
import { cn } from "../../utils/cn";
import DataTable from "../../components/molecules/DataTable";
import Card from "../../components/atoms/Card";
import { Button } from "../../components/atoms/Button";
import { Input } from "../../components/atoms/Input";
import Select from "../../components/atoms/Select";
import {
	productService,
	Product,
	CreateProductData,
	ProductSize,
	categoryService,
	Category,
} from "../../services";

const ProductManagementScreen: React.FC = () => {
	const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
	const [showFilters, setShowFilters] = useState(false);
	const [showAddForm, setShowAddForm] = useState(false);
	const [filterCategory, setFilterCategory] = useState("");
	const [products, setProducts] = useState<Product[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalProducts, setTotalProducts] = useState(0);
	const [formData, setFormData] = useState<CreateProductData>({
		name: "",
		description: "",
		price: 0,
		discount: 0,
		stock: 0,
		category: "",
		sizes: [{ label: "M", stock: 0 }],
		image: undefined,
	});

	const productColumns: {
		key: keyof Product;
		label: string;
		render?: (value: any, product: Product) => React.ReactNode;
	}[] = [
		{
			key: "name",
			label: "Product",
			render: (value: string, product: Product) => (
				<div className='flex items-center space-x-3'>
					<img
						src={product.images?.[0] || "https://via.placeholder.com/100x100"}
						alt={product.name}
						className='w-10 h-10 rounded-lg object-cover'
					/>
					<div>
						<p className='font-medium text-gray-900 dark:text-gray-100'>
							{product.name}
						</p>
						<p className='text-sm text-gray-500 dark:text-gray-400'>
							{product.description}
						</p>
					</div>
				</div>
			),
		},
		{
			key: "price",
			label: "Price",
			render: (value: number, product: Product) => (
				<div>
					<p className='font-medium text-gray-900 dark:text-gray-100'>
						${product.price}
					</p>
					{product.discount && product.discount > 0 && (
						<p className='text-sm text-green-600 dark:text-green-400'>
							-${product.discount} off
						</p>
					)}
				</div>
			),
		},
		{
			key: "stock",
			label: "Stock",
			render: (value: number, product: Product) => (
				<div>
					<p className='font-medium text-gray-900 dark:text-gray-100'>
						{product.stock}
					</p>
					<p className='text-sm text-gray-500 dark:text-gray-400'>
						{product.sizes?.length || 0} sizes
					</p>
				</div>
			),
		},
		{
			key: "category",
			label: "Category",
			render: (value: string, product: Product) => (
				<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'>
					{product.categoryName || product.category}
				</span>
			),
		},
		{
			key: "createdAt",
			label: "Created",
			render: (value: string) => new Date(value).toLocaleDateString(),
		},
	];

	// Fetch products and categories on component mount
	useEffect(() => {
		fetchProducts();
		fetchCategories();
	}, [currentPage]);

	const fetchProducts = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await productService.getAll(currentPage, 10);
			console.log("Fetched products:", data);
			setProducts(data.items);
			setTotalProducts(data.total);
		} catch (err) {
			setError("Failed to fetch products");
			console.error("Error fetching products:", err);
		} finally {
			setLoading(false);
		}
	};

	const fetchCategories = async () => {
		try {
			const data = await categoryService.getAll();
			setCategories(data);
		} catch (err) {
			console.error("Error fetching categories:", err);
		}
	};

	const filteredProducts = products.filter((product) => {
		if (filterCategory && product.category !== filterCategory) return false;
		return true;
	});

	// Debug logging
	console.log("Products state:", products);
	console.log("Filtered products:", filteredProducts);

	const handleBulkAction = async (action: string) => {
		if (selectedProducts.length === 0) return;

		setLoading(true);
		setError(null);

		try {
			switch (action) {
				case "delete":
					// TODO: Implement bulk delete API call
					console.log("Deleting products:", selectedProducts);
					break;
				default:
					console.log(`${action} selected products:`, selectedProducts);
			}

			// Refresh the list after bulk action
			await fetchProducts();
			setSelectedProducts([]);
		} catch (err) {
			setError(`Failed to ${action} products`);
			console.error(`Error ${action}ing products:`, err);
		} finally {
			setLoading(false);
		}
	};

	const handleProductAction = (action: string, product: Product) => {
		switch (action) {
			case "view":
				console.log("View product:", product);
				break;
			case "edit":
				console.log("Edit product:", product);
				// TODO: Implement edit functionality
				break;
			case "delete":
				handleDeleteProduct(product._id);
				break;
			default:
				console.log(`${action} product:`, product);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			await productService.create(formData);
			// Refresh products list
			await fetchProducts();
			// Reset form and close
			setFormData({
				name: "",
				description: "",
				price: 0,
				discount: 0,
				stock: 0,
				category: "",
				sizes: [{ label: "M", stock: 0 }],
				image: undefined,
			});
			setShowAddForm(false);
			setSuccess("Product created successfully!");
		} catch (err) {
			setError("Failed to create product");
			console.error("Error creating product:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setFormData((prev) => ({ ...prev, image: file }));
		}
	};

	const handleSizeChange = (
		index: number,
		field: keyof ProductSize,
		value: string | number
	) => {
		setFormData((prev) => ({
			...prev,
			sizes: prev.sizes.map((size, i) =>
				i === index ? { ...size, [field]: value } : size
			),
		}));
	};

	const addSize = () => {
		setFormData((prev) => ({
			...prev,
			sizes: [...prev.sizes, { label: "", stock: 0 }],
		}));
	};

	const removeSize = (index: number) => {
		setFormData((prev) => ({
			...prev,
			sizes: prev.sizes.filter((_, i) => i !== index),
		}));
	};

	const handleDeleteProduct = async (productId: string) => {
		if (window.confirm("Are you sure you want to delete this product?")) {
			setLoading(true);
			setError(null);
			try {
				await productService.delete(productId);
				await fetchProducts(); // Refresh the list
				setSuccess("Product deleted successfully!");
			} catch (err) {
				setError("Failed to delete product");
				console.error("Error deleting product:", err);
			} finally {
				setLoading(false);
			}
		}
	};

	const categoryOptions = [
		{ value: "", label: "All Categories" },
		...categories.map((cat) => ({ value: cat._id, label: cat.name })),
	];

	return (
		<div className='space-y-6'>
			{/* Success Message */}
			{success && (
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className='bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4'>
					<div className='flex items-center justify-between'>
						<p className='text-sm text-green-800 dark:text-green-200'>
							{success}
						</p>
						<button
							onClick={() => setSuccess(null)}
							className='text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300'>
							×
						</button>
					</div>
				</motion.div>
			)}

			{/* Error Message */}
			{error && (
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4'>
					<div className='flex items-center justify-between'>
						<p className='text-sm text-red-800 dark:text-red-200'>{error}</p>
						<button
							onClick={() => setError(null)}
							className='text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300'>
							×
						</button>
					</div>
				</motion.div>
			)}

			{/* Page Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
						Product Management
					</h1>
					<p className='text-gray-600 dark:text-gray-400 mt-1'>
						Manage your products and inventory
					</p>
				</div>
				<div className='flex items-center space-x-3'>
					<Button
						variant='outline'
						onClick={() => setShowFilters(!showFilters)}
						disabled={loading}>
						<Filter className='h-4 w-4 mr-2' />
						Filters
					</Button>
					<Button variant='outline'>
						<Download className='h-4 w-4 mr-2' />
						Export
					</Button>
					<Button variant='outline' onClick={fetchProducts} disabled={loading}>
						<Download className='h-4 w-4 mr-2' />
						Refresh
					</Button>
					<Button variant='outline'>
						<Upload className='h-4 w-4 mr-2' />
						Import
					</Button>
					<Button onClick={() => setShowAddForm(true)} disabled={loading}>
						<Plus className='h-4 w-4 mr-2' />
						Add Product
					</Button>
				</div>
			</div>

			{/* Add Product Form */}
			<AnimatePresence>
				{showAddForm && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.2 }}
						className='overflow-hidden'>
						<Card>
							<div className='p-6'>
								<h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>
									Add New Product
								</h3>
								<form onSubmit={handleSubmit} className='space-y-4'>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
										<div>
											<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
												Product Name
											</label>
											<Input
												type='text'
												value={formData.name}
												onChange={(e) =>
													setFormData((prev) => ({
														...prev,
														name: e.target.value,
													}))
												}
												placeholder='Enter product name'
												required
											/>
										</div>
										<div>
											<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
												Category
											</label>
											<Select
												value={formData.category}
												onChange={(value) =>
													setFormData((prev) => ({
														...prev,
														category: value,
													}))
												}
												options={categories.map((cat) => ({
													value: cat._id,
													label: cat.name,
												}))}
											/>
										</div>
									</div>
									<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
										<div>
											<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
												Price ($)
											</label>
											<Input
												type='number'
												value={formData.price}
												onChange={(e) =>
													setFormData((prev) => ({
														...prev,
														price: parseFloat(e.target.value) || 0,
													}))
												}
												placeholder='0.00'
												step='0.01'
												min='0'
												required
											/>
										</div>
										<div>
											<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
												Discount ($)
											</label>
											<Input
												type='number'
												value={formData.discount}
												onChange={(e) =>
													setFormData((prev) => ({
														...prev,
														discount: parseFloat(e.target.value) || 0,
													}))
												}
												placeholder='0.00'
												step='0.01'
												min='0'
											/>
										</div>
										<div>
											<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
												Stock
											</label>
											<Input
												type='number'
												value={formData.stock}
												onChange={(e) =>
													setFormData((prev) => ({
														...prev,
														stock: parseInt(e.target.value) || 0,
													}))
												}
												placeholder='0'
												min='0'
												required
											/>
										</div>
									</div>
									<div>
										<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
											Description
										</label>
										<textarea
											value={formData.description}
											onChange={(e) =>
												setFormData((prev) => ({
													...prev,
													description: e.target.value,
												}))
											}
											placeholder='Enter product description'
											rows={3}
											className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
											required
										/>
									</div>
									<div>
										<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
											Product Image
										</label>
										<input
											type='file'
											accept='image/*'
											onChange={handleImageChange}
											className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
										/>
									</div>
									<div>
										<div className='flex items-center justify-between mb-2'>
											<label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
												Sizes & Stock
											</label>
											<Button
												type='button'
												variant='outline'
												size='sm'
												onClick={addSize}>
												<Plus className='h-4 w-4 mr-1' />
												Add Size
											</Button>
										</div>
										<div className='space-y-2'>
											{formData.sizes.map((size, index) => (
												<div
													key={index}
													className='flex items-center space-x-2'>
													<Input
														type='text'
														value={size.label}
														onChange={(e) =>
															handleSizeChange(index, "label", e.target.value)
														}
														placeholder='Size (e.g., S, M, L)'
														className='w-24'
														required
													/>
													<Input
														type='number'
														value={size.stock}
														onChange={(e) =>
															handleSizeChange(
																index,
																"stock",
																parseInt(e.target.value) || 0
															)
														}
														placeholder='Stock'
														min='0'
														className='w-24'
														required
													/>
													{formData.sizes.length > 1 && (
														<Button
															type='button'
															variant='outline'
															size='sm'
															onClick={() => removeSize(index)}
															className='text-red-600 hover:text-red-700'>
															<Trash2 className='h-4 w-4' />
														</Button>
													)}
												</div>
											))}
										</div>
									</div>
									<div className='flex items-center space-x-3'>
										<Button type='submit' disabled={loading}>
											{loading ? (
												<>
													<div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
													Creating...
												</>
											) : (
												<>
													<Plus className='h-4 w-4 mr-2' />
													Create Product
												</>
											)}
										</Button>
										<Button
											type='button'
											variant='outline'
											onClick={() => setShowAddForm(false)}
											disabled={loading}>
											Cancel
										</Button>
									</div>
								</form>
							</div>
						</Card>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Filters */}
			<AnimatePresence>
				{showFilters && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.2 }}
						className='overflow-hidden'>
						<Card>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4'>
								<div>
									<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
										Category
									</label>
									<Select
										value={filterCategory}
										onChange={(value) => setFilterCategory(value)}
										options={categoryOptions}
									/>
								</div>
								<div className='flex items-end'>
									<Button
										variant='outline'
										onClick={() => setFilterCategory("")}
										className='w-full'
										disabled={loading}>
										Clear Filters
									</Button>
								</div>
							</div>
						</Card>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Bulk Actions */}
			{selectedProducts.length > 0 && (
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4'>
					<div className='flex items-center justify-between'>
						<p className='text-sm text-blue-800 dark:text-blue-200'>
							{selectedProducts.length} product
							{selectedProducts.length !== 1 ? "s" : ""} selected
						</p>
						<div className='flex items-center space-x-2'>
							<Button
								variant='outline'
								size='sm'
								onClick={() => handleBulkAction("delete")}
								className='text-red-600 hover:text-red-700'
								disabled={loading}>
								Delete
							</Button>
						</div>
					</div>
				</motion.div>
			)}

			{/* Products Table */}
			<Card>
				<div className='flex items-center justify-between mb-4'>
					<div className='flex items-center space-x-4'>
						<h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
							Products
						</h2>
						<span className='text-sm text-gray-500 dark:text-gray-400'>
							{loading ? "Loading..." : `${filteredProducts.length} products`}
						</span>
					</div>
					<div className='flex items-center space-x-2'>
						<Package className='h-5 w-5 text-gray-400' />
						<span className='text-sm text-gray-500 dark:text-gray-400'>
							Total: {totalProducts}
						</span>
					</div>
				</div>

				<DataTable
					data={filteredProducts}
					columns={productColumns}
					searchable={true}
					sortable={true}
					pagination={true}
					pageSize={10}
					loading={loading}
					onView={(product) => handleProductAction("view", product)}
					onEdit={(product) => handleProductAction("edit", product)}
					onDelete={(product) => handleProductAction("delete", product)}
					actions={(product) => (
						<div className='flex items-center space-x-2'>
							<button
								onClick={() => handleProductAction("view", product)}
								className='p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors'
								title='View'>
								<Eye className='h-4 w-4' />
							</button>
							<button
								onClick={() => handleProductAction("edit", product)}
								className='p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors'
								title='Edit'>
								<Edit className='h-4 w-4' />
							</button>
							<button
								onClick={() => handleProductAction("delete", product)}
								className='p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors'
								title='Delete'>
								<Trash2 className='h-4 w-4' />
							</button>
						</div>
					)}
				/>
			</Card>

			{/* Quick Stats */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
				<Card className='text-center'>
					<div className='p-4'>
						<Package className='h-8 w-8 text-blue-500 mx-auto mb-2' />
						<p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
							{totalProducts}
						</p>
						<p className='text-sm text-gray-500 dark:text-gray-400'>
							Total Products
						</p>
					</div>
				</Card>
				<Card className='text-center'>
					<div className='p-4'>
						<Tag className='h-8 w-8 text-green-500 mx-auto mb-2' />
						<p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
							{categories.length}
						</p>
						<p className='text-sm text-gray-500 dark:text-gray-400'>
							Categories
						</p>
					</div>
				</Card>
				<Card className='text-center'>
					<div className='p-4'>
						<div className='h-8 w-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-2'>
							<Package className='h-5 w-5 text-purple-600 dark:text-purple-400' />
						</div>
						<p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
							{products.filter((p) => p.images && p.images.length > 0).length}
						</p>
						<p className='text-sm text-gray-500 dark:text-gray-400'>
							Products with Images
						</p>
					</div>
				</Card>
			</div>
		</div>
	);
};

export default ProductManagementScreen;
