/** @format */

import React, { useState, useEffect, useRef } from "react";
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
import ProductViewModal from "../../components/molecules/ProductViewModal";
import {
	productService,
	categoryService,
	CreateProductData,
} from "../../services";
import { Product, Category, ProductSize } from "../../types";

const ProductManagementScreen: React.FC = () => {
	const formRef = useRef<HTMLFormElement>(null);
	const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
	const [showFilters, setShowFilters] = useState(false);
	const [showAddForm, setShowAddForm] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editingProductId, setEditingProductId] = useState<string | null>(null);
	const [existingImages, setExistingImages] = useState<string[]>([]);
	const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
	const [uploadProgress, setUploadProgress] = useState<number>(0);
	const [isDragOver, setIsDragOver] = useState(false);
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
		discount: 0, // This will now represent percentage
		stock: 0,
		category: "",
		sizes: [{ label: "M", stock: 0 }],
		images: [],
	});

	// View modal state
	const [viewModalOpen, setViewModalOpen] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

	// Helper function to calculate discounted price
	const calculateDiscountedPrice = (
		price: number,
		discountPercentage: number | undefined
	) => {
		if (!discountPercentage || discountPercentage <= 0) return price;
		return price - (price * discountPercentage) / 100;
	};

	// Helper function to format discount display
	const formatDiscountDisplay = (
		price: number,
		discountPercentage: number | undefined
	) => {
		if (!discountPercentage || discountPercentage <= 0) return null;
		const discountedPrice = calculateDiscountedPrice(price, discountPercentage);
		return {
			originalPrice: price,
			discountedPrice,
			savings: price - discountedPrice,
			discountPercentage,
		};
	};

	// Image validation functions
	const validateImageFile = (
		file: File
	): { valid: boolean; error?: string } => {
		// File type validation
		const allowedTypes = [
			"image/jpeg",
			"image/jpg",
			"image/png",
			"image/gif",
			"image/webp",
		];
		if (!allowedTypes.includes(file.type)) {
			return {
				valid: false,
				error: "Only JPG, PNG, GIF, and WEBP files are allowed",
			};
		}

		// File size validation (5MB)
		const maxSize = 5 * 1024 * 1024; // 5MB in bytes
		if (file.size > maxSize) {
			return { valid: false, error: "File size must be less than 5MB" };
		}

		return { valid: true };
	};

	const validateImageCount = (
		currentCount: number,
		newCount: number
	): { valid: boolean; error?: string } => {
		const totalCount = currentCount + newCount;
		if (totalCount > 5) {
			return { valid: false, error: "Maximum 5 images allowed per product" };
		}
		return { valid: true };
	};

	// Form validation function
	const validateForm = (): { valid: boolean; errors: string[] } => {
		const errors: string[] = [];

		if (!formData.name.trim()) {
			errors.push("Product name is required");
		}
		if (!formData.description.trim()) {
			errors.push("Product description is required");
		}
		if (formData.price <= 0) {
			errors.push("Price must be greater than 0");
		}
		if (formData.stock < 0) {
			errors.push("Stock cannot be negative");
		}
		if (!formData.category) {
			errors.push("Category is required");
		}
		if (formData.sizes.length === 0) {
			errors.push("At least one size is required");
		}

		// Validate sizes
		formData.sizes.forEach((size, index) => {
			if (!size.label.trim()) {
				errors.push(`Size ${index + 1} label is required`);
			}
			if (size.stock < 0) {
				errors.push(`Size ${index + 1} stock cannot be negative`);
			}
		});

		// Validate discount
		if (
			formData.discount !== undefined &&
			(formData.discount < 0 || formData.discount > 100)
		) {
			errors.push("Discount must be between 0 and 100 percent");
		}

		return { valid: errors.length === 0, errors };
	};

	const productColumns: {
		key: keyof Product;
		label: string;
		render?: (value: any, product: Product) => React.ReactNode;
	}[] = [
		{
			key: "name",
			label: "Product",
			render: (value: string, product: Product) => (
				<div className='flex items-start space-x-2 sm:space-x-3'>
					<img
						src={product.images?.[0] || "https://via.placeholder.com/100x100"}
						alt={product.name}
						className='w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover flex-shrink-0'
					/>
					<div className='flex-1 min-w-0'>
						<div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1'>
							<p className='font-medium text-gray-900 text-sm sm:text-base truncate'>
								{product.name}
							</p>
							<span className='text-xs text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded flex-shrink-0'>
								ID: {product._id?.slice(-8) || product.id?.slice(-8) || "N/A"}
							</span>
						</div>
						<p className='text-xs sm:text-sm text-gray-500 line-clamp-2'>
							{product.description}
						</p>
						{/* Stock Summary in Product Column */}
						{product.sizes && product.sizes.length > 0 && (
							<div className='mt-2'>
								{/* Total Stock Indicator */}
								<div className='mb-1 flex items-center gap-2'>
									<span className='text-xs text-gray-600 font-medium'>
										Total Stock:
									</span>
									<span
										className={`text-xs font-semibold ${(() => {
											const totalStock = product.sizes.reduce(
												(sum, size) => sum + size.stock,
												0
											);
											return totalStock === 0
												? "text-red-600"
												: totalStock < 10
												? "text-yellow-600"
												: "text-green-600";
										})()}`}>
										{product.sizes.reduce((sum, size) => sum + size.stock, 0)}
									</span>
								</div>
								{/* Individual Size Badges */}
								<div className='flex flex-wrap gap-1'>
									{product.sizes.map((size, index) => (
										<span
											key={index}
											className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${
												size.stock === 0
													? "bg-red-100 text-red-800 border border-red-200"
													: size.stock < 5
													? "bg-yellow-100 text-yellow-800 border border-yellow-200"
													: "bg-green-100 text-green-800 border border-green-200"
											}`}>
											{size.label}:{" "}
											{size.stock === 0 ? "Out of Stock" : size.stock}
										</span>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			),
		},
		{
			key: "price",
			label: "Price",
			render: (value: number, product: Product) => {
				const discountInfo = formatDiscountDisplay(
					product.price,
					product.discount
				);
				if (!discountInfo) {
					return (
						<div>
							<p className='font-medium text-gray-900 text-sm sm:text-base'>
								EGP {product.price.toFixed(2)}
							</p>
						</div>
					);
				}
				return (
					<div className='space-y-1'>
						<p className='font-medium text-gray-900 text-sm sm:text-base line-through text-gray-500'>
							EGP {discountInfo.originalPrice.toFixed(2)}
						</p>
						<p className='text-xs sm:text-sm text-green-600'>
							-{discountInfo.discountPercentage}% off
						</p>
						<p className='text-xs sm:text-sm text-gray-500'>
							Final: EGP {discountInfo.discountedPrice.toFixed(2)}
						</p>
					</div>
				);
			},
		},
		{
			key: "stock",
			label: "Stock",
			render: (value: number, product: Product) => (
				<div>
					<p className='font-medium text-gray-900 text-sm sm:text-base'>
						{product.stock}
					</p>
					<div className='text-xs sm:text-sm text-gray-500'>
						{product.sizes?.length || 0} sizes
						{product.sizes && product.sizes.length > 0 && (
							<div className='mt-1 space-y-1'>
								{product.sizes.map((size, index) => (
									<div
										key={index}
										className='flex items-center justify-between text-xs'>
										<span className='font-medium'>{size.label}:</span>
										<span
											className={`${
												size.stock === 0
													? "text-red-600 font-semibold"
													: "text-gray-600"
											}`}>
											{size.stock === 0 ? "Out of Stock" : size.stock}
										</span>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			),
		},
		{
			key: "category",
			label: "Category",
			render: (value: any, product: Product) => {
				// Handle different category formats
				let categoryDisplay = "";
				if (product.categoryName) {
					categoryDisplay = product.categoryName;
				} else if (
					typeof product.category === "object" &&
					product.category?.name
				) {
					categoryDisplay = product.category.name;
				} else if (typeof product.category === "string") {
					categoryDisplay = product.category;
				} else {
					categoryDisplay = "Unknown Category";
				}

				return (
					<span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
						{categoryDisplay}
					</span>
				);
			},
		},
		{
			key: "createdAt",
			label: "Created",
			render: (value: string) => (
				<span className='text-xs sm:text-sm text-gray-600'>
					{new Date(value).toLocaleDateString()}
				</span>
			),
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
			setProducts(data.items);
			setTotalProducts(data.total);
		} catch (err) {
			setError("Failed to fetch products");
		} finally {
			setLoading(false);
		}
	};

	const fetchCategories = async () => {
		try {
			const data = await categoryService.getAll();
			setCategories(data);
		} catch (err) {
			// Silently handle category fetch errors
		}
	};

	const filteredProducts = products.filter((product) => {
		if (filterCategory) {
			// Handle different category formats for filtering
			let productCategoryId = "";
			if (typeof product.category === "string") {
				productCategoryId = product.category;
			} else if (
				typeof product.category === "object" &&
				product.category?._id
			) {
				productCategoryId = product.category._id;
			}

			if (productCategoryId !== filterCategory) return false;
		}
		return true;
	});

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
		} finally {
			setLoading(false);
		}
	};

	const handleProductAction = (action: string, product: Product) => {
		switch (action) {
			case "view":
				setSelectedProduct(product);
				setViewModalOpen(true);
				break;
			case "edit":
				// Populate form with existing product data
				// Extract category ID properly - handle both string and object formats
				let categoryId = "";
				if (typeof product.category === "string") {
					categoryId = product.category;
				} else if (
					typeof product.category === "object" &&
					product.category?._id
				) {
					categoryId = product.category._id;
				}

				const editFormData = {
					name: product.name,
					description: product.description,
					price: product.price,
					discount: product.discount || 0,
					stock: product.stock,
					category: categoryId,
					sizes: product.sizes || [{ label: "M", stock: 0 }],
					images: [], // We'll handle existing images separately
				};
				setFormData(editFormData);
				setExistingImages(product.images || []);
				setEditingProductId(product._id);
				setIsEditing(true);
				setShowAddForm(true);
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

		// Custom form validation
		const validation = validateForm();
		if (!validation.valid) {
			setError(`Validation failed: ${validation.errors.join(", ")}`);
			return;
		}

		// Additional validation for backend API requirements
		if (isEditing && editingProductId) {
			// Ensure we have at least one field to update
			const hasChanges =
				formData.name ||
				formData.description ||
				formData.price > 0 ||
				formData.discount !== undefined ||
				formData.stock >= 0 ||
				formData.category ||
				(formData.sizes && formData.sizes.length > 0) ||
				(formData.images && formData.images.length > 0) ||
				imagesToRemove.length > 0;

			if (!hasChanges) {
				setError(
					"No changes detected. Please modify at least one field before updating."
				);
				return;
			}
		}

		setLoading(true);
		setError(null);

		try {
			if (isEditing && editingProductId) {
				// Update existing product
				console.log("Updating product:", editingProductId);

				// Create update data - only include fields that have values
				const updateData: any = {};

				// Only include fields that have been modified or have values
				if (formData.name) updateData.name = formData.name;
				if (formData.description) updateData.description = formData.description;
				if (formData.price > 0) updateData.price = Number(formData.price);
				if (formData.discount !== undefined)
					updateData.discount = Number(formData.discount);
				if (formData.stock >= 0) updateData.stock = Number(formData.stock);
				if (formData.category) updateData.category = formData.category;

				// Handle sizes - ensure they have the correct structure
				if (formData.sizes && formData.sizes.length > 0) {
					updateData.sizes = formData.sizes.map((size) => ({
						label: size.label.trim(),
						stock: Number(size.stock),
					}));
				}

				// Check if this is a basic update (no image changes) or full update
				const hasNewImages = formData.images && formData.images.length > 0;
				const hasRemovedImages = imagesToRemove.length > 0;
				const isBasicUpdate = !hasNewImages && !hasRemovedImages;

				if (isBasicUpdate) {
					// Use the basic update endpoint for text-only changes
					console.log("Using basic update endpoint (no image changes)");
					await productService.updateBasic(editingProductId, updateData);
				} else {
					// Use the full update endpoint for changes involving images
					console.log("Using full update endpoint (with image changes)");

					// Handle images - only include if there are new images
					if (formData.images && formData.images.length > 0) {
						updateData.images = formData.images;
					}

					// Note: Removed imagesToRemove field as the backend doesn't support it
					// This was causing the "Unexpected field" Multer error

					// Validate that we have at least one field to update
					const fieldCount = Object.keys(updateData).length;
					if (fieldCount === 0) {
						setError(
							"No valid fields to update. Please modify at least one field."
						);
						return;
					}

					await productService.update(editingProductId, updateData);
				}
				console.log("Product updated successfully!");
				setSuccess("Product updated successfully!");
			} else {
				// Create new product
				await productService.create(formData);
				setSuccess("Product created successfully!");
			}

			// Refresh products list
			await fetchProducts();
			// Reset form and close
			resetForm();
		} catch (err) {
			const action = isEditing ? "update" : "create";
			setError(
				`Failed to ${action} product: ${
					err instanceof Error ? err.message : "Unknown error"
				}`
			);
		} finally {
			setLoading(false);
		}
	};

	const resetForm = () => {
		setFormData({
			name: "",
			description: "",
			price: 0,
			discount: 0,
			stock: 0,
			category: "",
			sizes: [{ label: "M", stock: 0 }],
			images: [],
		});
		setShowAddForm(false);
		setIsEditing(false);
		setEditingProductId(null);
		setExistingImages([]);
		setImagesToRemove([]);
		setUploadProgress(0);
		setIsDragOver(false);
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			const newFiles = Array.from(files);
			const validationErrors: string[] = [];

			// Validate each file
			newFiles.forEach((file) => {
				const validation = validateImageFile(file);
				if (!validation.valid) {
					validationErrors.push(`${file.name}: ${validation.error}`);
				}
			});

			// Check image count validation
			const countValidation = validateImageCount(
				existingImages.length - imagesToRemove.length,
				newFiles.length
			);
			if (!countValidation.valid) {
				validationErrors.push(countValidation.error!);
			}

			// If there are validation errors, show them and don't add files
			if (validationErrors.length > 0) {
				setError(`Image validation failed: ${validationErrors.join(", ")}`);
				return;
			}

			// Add valid files
			setFormData((prev) => ({
				...prev,
				images: [...(prev.images || []), ...newFiles],
			}));
			setError(null); // Clear any previous errors
		}
	};

	// Remove existing image
	const removeExistingImage = (imageUrl: string) => {
		setImagesToRemove((prev) => [...prev, imageUrl]);
	};

	// Restore removed image
	const restoreExistingImage = (imageUrl: string) => {
		setImagesToRemove((prev) => prev.filter((url) => url !== imageUrl));
	};

	// Remove new image
	const removeNewImage = (index: number) => {
		setFormData((prev) => ({
			...prev,
			images: (prev.images || []).filter((_, i) => i !== index),
		}));
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
			} finally {
				setLoading(false);
			}
		}
	};

	const closeViewModal = () => {
		setViewModalOpen(false);
		setSelectedProduct(null);
	};

	const categoryOptions = [
		{ value: "", label: "All Categories" },
		...categories.map((cat) => ({ value: cat._id, label: cat.name })),
	];

	return (
		<div className='space-y-4 sm:space-y-6 px-4 sm:px-6 lg:px-8'>
			{/* Success Message */}
			{success && (
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className='bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4'>
					<div className='flex items-center justify-between'>
						<p className='text-sm text-green-800'>{success}</p>
						<button
							onClick={() => setSuccess(null)}
							className='text-green-600 hover:text-green-800'>
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
					className='bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4'>
					<div className='flex items-center justify-between'>
						<p className='text-sm text-red-800'>{error}</p>
						<button
							onClick={() => setError(null)}
							className='text-red-600 hover:text-red-800'>
							×
						</button>
					</div>
				</motion.div>
			)}

			{/* Page Header */}
			<div className='flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0'>
				<div>
					<h1 className='text-xl sm:text-2xl font-bold text-gray-900'>
						Product Management
					</h1>
					<p className='text-sm sm:text-base text-gray-600 mt-1'>
						Manage your products and inventory
					</p>
				</div>
				<div className='flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3'>
					<div className='flex items-center space-x-2'>
						<Button
							variant='outline'
							onClick={() => setShowFilters(!showFilters)}
							disabled={loading}
							className='flex-1 sm:flex-none'>
							<Filter className='h-4 w-4 mr-2' />
							<span className='hidden sm:inline'>Filters</span>
						</Button>
						<Button variant='outline' className='flex-1 sm:flex-none'>
							<Download className='h-4 w-4 mr-2' />
							<span className='hidden sm:inline'>Export</span>
						</Button>
					</div>
					<div className='flex items-center space-x-2'>
						<Button
							variant='outline'
							onClick={fetchProducts}
							disabled={loading}
							className='flex-1 sm:flex-none'>
							<Download className='h-4 w-4 mr-2' />
							<span className='hidden sm:inline'>Refresh</span>
						</Button>
						<Button variant='outline' className='flex-1 sm:flex-none'>
							<Upload className='h-4 w-4 mr-2' />
							<span className='hidden sm:inline'>Import</span>
						</Button>
					</div>
					<Button
						onClick={() => {
							resetForm();
							setShowAddForm(true);
						}}
						disabled={loading}
						className='w-full sm:w-auto'>
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
								<h3 className='text-lg font-semibold text-gray-900 mb-4'>
									{isEditing ? "Edit Product" : "Add New Product"}
									{isEditing && (
										<div className='text-sm font-normal text-gray-600 mt-1'>
											{(() => {
												const hasNewImages =
													formData.images && formData.images.length > 0;
												const hasRemovedImages = imagesToRemove.length > 0;
												const isBasicUpdate =
													!hasNewImages && !hasRemovedImages;

												return isBasicUpdate ? (
													<span className='text-green-600'>
														🔄 Using Basic Update (no image changes)
													</span>
												) : (
													<span className='text-blue-600'>
														📸 Using Full Update (with image changes)
													</span>
												);
											})()}
										</div>
									)}
								</h3>
								<form
									ref={formRef}
									onSubmit={handleSubmit}
									className='space-y-4'>
									<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-2'>
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
											<label className='block text-sm font-medium text-gray-700 mb-2'>
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
									<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-2'>
												Price (EGP)
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
											<label className='block text-sm font-medium text-gray-700 mb-2'>
												Discount (%)
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
												placeholder='0'
												step='0.1'
												min='0'
												max='100'
											/>
											{formData.discount &&
												formData.discount > 0 &&
												formData.price > 0 && (
													<div className='mt-2 text-sm text-gray-600'>
														<p>
															Original Price: EGP {formData.price.toFixed(2)}
														</p>
														<p>Discount: {formData.discount}%</p>
														<p className='font-semibold text-green-600'>
															Final Price: EGP{" "}
															{calculateDiscountedPrice(
																formData.price,
																formData.discount
															).toFixed(2)}
														</p>
														<p className='text-xs text-gray-500'>
															You save: EGP{" "}
															{(
																(formData.price * (formData.discount || 0)) /
																100
															).toFixed(2)}
														</p>
													</div>
												)}
										</div>
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-2'>
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
										<label className='block text-sm font-medium text-gray-700 mb-2'>
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
											className='w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
											required
										/>
									</div>
									<div>
										<label className='block text-sm font-medium text-gray-700 mb-2'>
											Product Images
										</label>
										<div
											className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors ${
												isDragOver ? "border-blue-500" : ""
											}`}
											onDragOver={(e) => {
												e.preventDefault();
												setIsDragOver(true);
											}}
											onDragLeave={(e) => {
												e.preventDefault();
												setIsDragOver(false);
											}}
											onDrop={(e) => {
												e.preventDefault();
												setIsDragOver(false);
												const files = Array.from(e.dataTransfer.files);
												const validationErrors: string[] = [];

												files.forEach((file) => {
													const validation = validateImageFile(file);
													if (!validation.valid) {
														validationErrors.push(
															`${file.name}: ${validation.error}`
														);
													}
												});

												const countValidation = validateImageCount(
													(formData.images?.length || 0) -
														imagesToRemove.length,
													files.length
												);
												if (!countValidation.valid) {
													validationErrors.push(countValidation.error!);
												}

												if (validationErrors.length > 0) {
													setError(
														`Image validation failed: ${validationErrors.join(
															", "
														)}`
													);
													return;
												}

												setFormData((prev) => ({
													...prev,
													images: [...(prev.images || []), ...files],
												}));
												setError(null);
											}}>
											<Upload className='mx-auto h-12 w-12 text-gray-400 mb-4' />
											<div className='text-sm text-gray-600 mb-4'>
												<p className='font-medium'>
													Drop images here or click to browse
												</p>
												<p className='text-xs mt-1'>
													Supports: JPG, PNG, GIF (Max 5 images)
												</p>
											</div>
											<input
												type='file'
												accept='image/*'
												multiple
												onChange={handleImageChange}
												className='hidden'
												id='image-upload'
											/>
											<label
												htmlFor='image-upload'
												className='cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'>
												Choose Images
											</label>
										</div>

										{formData.images && formData.images.length > 0 && (
											<div className='mt-4'>
												<div className='flex items-center justify-between mb-3'>
													<h4 className='text-sm font-medium text-gray-700'>
														New Images to Upload ({formData.images.length}/5)
													</h4>
													<Button
														type='button'
														variant='outline'
														size='sm'
														onClick={() =>
															setFormData((prev) => ({ ...prev, images: [] }))
														}
														className='text-red-600 hover:text-red-700'>
														Clear All
													</Button>
												</div>
												<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'>
													{formData.images.map((image, index) => (
														<div key={index} className='relative group'>
															<div className='relative w-full aspect-square'>
																<img
																	src={URL.createObjectURL(image)}
																	alt={`New image ${index + 1}`}
																	className='w-full h-full object-cover rounded-lg border-2 border-blue-200'
																/>
																<div className='absolute inset-0 bg-blue-500 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg' />
															</div>

															{/* Image Actions */}
															<div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
																<button
																	type='button'
																	onClick={() => removeNewImage(index)}
																	className='bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors'>
																	<Trash2 className='h-4 w-4' />
																</button>
															</div>

															{/* Reorder Buttons */}
															<div className='absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1'>
																{index > 0 && (
																	<button
																		type='button'
																		onClick={() => {
																			const newImages = [
																				...(formData.images || []),
																			];
																			[newImages[index], newImages[index - 1]] =
																				[
																					newImages[index - 1],
																					newImages[index],
																				];
																			setFormData((prev) => ({
																				...prev,
																				images: newImages,
																			}));
																		}}
																		className='bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 transition-colors'>
																		<svg
																			className='h-3 w-3'
																			fill='none'
																			stroke='currentColor'
																			viewBox='0 0 24 24'>
																			<path
																				strokeLinecap='round'
																				strokeLinejoin='round'
																				strokeWidth={2}
																				d='M5 15l7-7 7 7'
																			/>
																		</svg>
																	</button>
																)}
																{index < (formData.images?.length || 0) - 1 && (
																	<button
																		type='button'
																		onClick={() => {
																			const newImages = [
																				...(formData.images || []),
																			];
																			[newImages[index], newImages[index + 1]] =
																				[
																					newImages[index + 1],
																					newImages[index],
																				];
																			setFormData((prev) => ({
																				...prev,
																				images: newImages,
																			}));
																		}}
																		className='bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 transition-colors'>
																		<svg
																			className='h-3 w-3'
																			fill='none'
																			stroke='currentColor'
																			viewBox='0 0 24 24'>
																			<path
																				strokeLinecap='round'
																				strokeLinejoin='round'
																				strokeWidth={2}
																				d='M19 9l-7 7-7-7'
																			/>
																		</svg>
																	</button>
																)}
															</div>

															{/* Image Number Badge */}
															<div className='absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full'>
																{index + 1}
															</div>

															{/* File Info */}
															<div className='absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
																<p className='text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded'>
																	{(image.size / 1024 / 1024).toFixed(1)}MB
																</p>
															</div>
														</div>
													))}
												</div>
												<p className='text-xs text-gray-500 mt-2'>
													First image will be the main product image. Drag to
													reorder or use arrow buttons.
												</p>
											</div>
										)}
									</div>

									{/* Upload Progress Indicator */}
									{loading && (
										<div className='mt-4'>
											<div className='flex items-center justify-between mb-2'>
												<span className='text-sm font-medium text-gray-700'>
													Uploading...
												</span>
												<span className='text-sm text-gray-500'>
													{uploadProgress}%
												</span>
											</div>
											<div className='w-full bg-gray-200 rounded-full h-2'>
												<div
													className='bg-blue-600 h-2 rounded-full transition-all duration-300'
													style={{ width: `${uploadProgress}%` }}
												/>
											</div>
										</div>
									)}

									{/* Existing Images Display (when editing) */}
									{isEditing && existingImages.length > 0 && (
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-2'>
												Current Product Images (
												{existingImages.length - imagesToRemove.length}{" "}
												remaining)
											</label>
											<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'>
												{existingImages.map((imageUrl, index) => {
													const isRemoved = imagesToRemove.includes(imageUrl);
													return (
														<div
															key={index}
															className={`relative group ${
																isRemoved ? "opacity-50" : ""
															}`}>
															<div className='relative w-full aspect-square'>
																<img
																	src={imageUrl}
																	alt={`Current image ${index + 1}`}
																	className={`w-full h-full object-cover rounded-lg border-2 transition-all duration-200 ${
																		isRemoved
																			? "border-red-300"
																			: "border-gray-200"
																	}`}
																/>
																<div
																	className={`absolute inset-0 transition-all duration-200 rounded-lg ${
																		isRemoved
																			? "bg-red-500 bg-opacity-20"
																			: "bg-black bg-opacity-0 group-hover:bg-opacity-20"
																	}`}
																/>
															</div>

															{/* Image Number Badge */}
															<div
																className={`absolute top-2 left-2 text-white text-xs px-2 py-1 rounded-full transition-colors ${
																	isRemoved
																		? "bg-red-500"
																		: "bg-black bg-opacity-50"
																}`}>
																{index + 1}
															</div>

															{/* Action Button */}
															<div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
																{isRemoved ? (
																	<button
																		type='button'
																		onClick={() =>
																			restoreExistingImage(imageUrl)
																		}
																		className='bg-green-500 text-white rounded-full p-1.5 hover:bg-green-600 transition-colors'>
																		<svg
																			className='h-4 w-4'
																			fill='none'
																			stroke='currentColor'
																			viewBox='0 0 24 24'>
																			<path
																				strokeLinecap='round'
																				strokeLinejoin='round'
																				strokeWidth={2}
																				d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
																			/>
																		</svg>
																	</button>
																) : (
																	<button
																		type='button'
																		onClick={() =>
																			removeExistingImage(imageUrl)
																		}
																		className='bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors'>
																		<Trash2 className='h-4 w-4' />
																	</button>
																)}
															</div>

															{/* Status Text */}
															<div className='absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
																<p
																	className={`text-xs text-white px-2 py-1 rounded ${
																		isRemoved
																			? "bg-red-500"
																			: "bg-black bg-opacity-50"
																	}`}>
																	{isRemoved
																		? "Will be removed"
																		: "Current Image"}
																</p>
															</div>
														</div>
													);
												})}
											</div>
											<p className='text-xs text-gray-500 mt-2'>
												{imagesToRemove.length > 0
													? `${imagesToRemove.length} image(s) marked for removal. Click the restore button to keep them.`
													: "These are the current product images. New images will be added to them."}
											</p>
										</div>
									)}

									<div>
										<div className='flex items-center justify-between mb-2'>
											<label className='block text-sm font-medium text-gray-700'>
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
										{/* Total Stock Warning */}
										{(() => {
											const totalStock = formData.sizes.reduce(
												(sum, size) => sum + size.stock,
												0
											);
											if (totalStock === 0) {
												return (
													<div className='mb-3 p-2 bg-red-50 border border-red-200 rounded-lg'>
														<div className='flex items-center text-red-800'>
															<span className='text-sm font-medium'>
																⚠️ Warning:
															</span>
															<span className='text-sm ml-2'>
																Total stock across all sizes is 0
															</span>
														</div>
													</div>
												);
											}
											return null;
										})()}
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
													<div className='relative'>
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
															className={`w-24 ${
																size.stock === 0
																	? "border-red-300 bg-red-50"
																	: ""
															}`}
															required
														/>
														{size.stock === 0 && (
															<div className='absolute -top-6 left-0 text-xs text-red-600 font-medium'>
																Out of Stock
															</div>
														)}
													</div>
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
										{/* Total Stock Summary */}
										<div className='mt-3 p-2 bg-gray-50 border border-gray-200 rounded-lg'>
											<div className='flex items-center justify-between text-sm'>
												<span className='text-gray-600 font-medium'>
													Total Stock:
												</span>
												<span
													className={`font-semibold ${(() => {
														const totalStock = formData.sizes.reduce(
															(sum, size) => sum + size.stock,
															0
														);
														return totalStock === 0
															? "text-red-600"
															: totalStock < 10
															? "text-yellow-600"
															: "text-green-600";
													})()}`}>
													{formData.sizes.reduce(
														(sum, size) => sum + size.stock,
														0
													)}
												</span>
											</div>
										</div>
									</div>
									<div className='flex items-center space-x-3'>
										<Button type='submit' disabled={loading}>
											{loading ? (
												<>
													<div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
													{isEditing ? "Updating..." : "Creating..."}
												</>
											) : (
												<>
													<Plus className='h-4 w-4 mr-2' />
													{isEditing ? "Update Product" : "Create Product"}
												</>
											)}
										</Button>
										<Button
											type='button'
											variant='outline'
											onClick={resetForm}
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
							<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 p-4'>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
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
					className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
					<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0'>
						<p className='text-sm text-blue-800'>
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
				<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0'>
					<div className='flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4'>
						<h2 className='text-lg font-semibold text-gray-900'>Products</h2>
						<span className='text-sm text-gray-500'>
							{loading ? "Loading..." : `${filteredProducts.length} products`}
						</span>
					</div>
					<div className='flex items-center space-x-2'>
						<Package className='h-5 w-5 text-gray-400' />
						<span className='text-sm text-gray-500'>
							Total: {totalProducts}
						</span>
					</div>
				</div>

				{/* Mobile-friendly table wrapper */}
				<div className='-mx-4 sm:mx-0'>
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
							<div className='flex items-center space-x-1 sm:space-x-2'>
								<button
									onClick={() => handleProductAction("view", product)}
									className='p-1 text-blue-600 hover:text-blue-800 transition-colors'
									title='View'>
									<Eye className='h-3 w-3 sm:h-4 sm:w-4' />
								</button>
								<button
									onClick={() => handleProductAction("edit", product)}
									className='p-1 text-green-600 hover:text-green-800 transition-colors'
									title='Edit'>
									<Edit className='h-3 w-3 sm:h-4 sm:w-4' />
								</button>
								<button
									onClick={() => handleProductAction("delete", product)}
									className='p-1 text-red-600 hover:text-red-800 transition-colors'
									title='Delete'>
									<Trash2 className='h-3 w-3 sm:h-4 sm:w-4' />
								</button>
							</div>
						)}
					/>
				</div>
			</Card>

			{/* Quick Stats */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
				<Card className='text-center'>
					<div className='p-4'>
						<Package className='h-8 w-8 text-blue-500 mx-auto mb-2' />
						<p className='text-2xl font-bold text-gray-900'>{totalProducts}</p>
						<p className='text-sm text-gray-500'>Total Products</p>
					</div>
				</Card>
				<Card className='text-center'>
					<div className='p-4'>
						<Tag className='h-8 w-8 text-green-500 mx-auto mb-2' />
						<p className='text-2xl font-bold text-gray-900'>
							{categories.length}
						</p>
						<p className='text-sm text-gray-500'>Categories</p>
					</div>
				</Card>
				<Card className='text-center'>
					<div className='p-4'>
						<div className='h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2'>
							<Package className='h-5 w-5 text-purple-600' />
						</div>
						<p className='text-2xl font-bold text-gray-900'>
							{products.filter((p) => p.images && p.images.length > 0).length}
						</p>
						<p className='text-sm text-gray-500'>Products with Images</p>
					</div>
				</Card>
			</div>

			{/* View Modal */}
			<ProductViewModal
				product={selectedProduct}
				isOpen={viewModalOpen}
				onClose={closeViewModal}
			/>
		</div>
	);
};

export default ProductManagementScreen;
