/** @format */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Plus,
	Filter,
	Download,
	Upload,
	Edit,
	Trash2,
	Eye,
	Archive,
	AlertTriangle,
} from "lucide-react";
import { cn } from "../../utils/cn";
import DataTable from "../../components/molecules/DataTable";
import Card from "../../components/atoms/Card";
import Badge from "../../components/atoms/Badge";
import { Button } from "../../components/atoms/Button";
import { Input } from "../../components/atoms/Input";
import Select from "../../components/atoms/Select";
import { categoryService, Category, CreateCategoryData } from "../../services";
import { useEffect } from "react";

const CategoryManagementScreen: React.FC = () => {
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [showFilters, setShowFilters] = useState(false);
	const [showAddForm, setShowAddForm] = useState(false);
	const [filterStatus, setFilterStatus] = useState("");
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [formData, setFormData] = useState<CreateCategoryData>({
		name: "",
		description: "",
		image: undefined,
	});

	const categoryColumns: {
		key: keyof Category;
		label: string;
		render?: (value: any, category: Category) => React.ReactNode;
	}[] = [
		{
			key: "name",
			label: "Category",
			render: (value: string, category: Category) => (
				<div className='flex items-center space-x-3'>
					<img
						src={category.image || "https://via.placeholder.com/100x100"}
						alt={category.name}
						className='w-10 h-10 rounded-lg object-cover'
					/>
					<div>
						<p className='font-medium text-gray-900 dark:text-gray-100'>
							{category.name}
						</p>
						<p className='text-sm text-gray-500 dark:text-gray-400'>
							{category.description}
						</p>
					</div>
				</div>
			),
		},
		{
			key: "createdAt",
			label: "Created",
			render: (value: string) => new Date(value).toLocaleDateString(),
		},
	];

	// Fetch categories on component mount
	useEffect(() => {
		fetchCategories();
	}, []);

	const fetchCategories = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await categoryService.getAll();
			console.log("Fetched categories:", data);
			setCategories(data);
		} catch (err) {
			setError("Failed to fetch categories");
			console.error("Error fetching categories:", err);
		} finally {
			setLoading(false);
		}
	};

	const filteredCategories = categories.filter((category) => {
		// Since status field doesn't exist in the API response, we'll skip status filtering for now
		// if (filterStatus && category.status !== filterStatus) return false;
		return true;
	});

	// Debug logging
	console.log("Categories state:", categories);
	console.log("Filtered categories:", filteredCategories);

	const handleBulkAction = async (action: string) => {
		if (selectedCategories.length === 0) return;

		setLoading(true);
		setError(null);

		try {
			switch (action) {
				case "delete":
					// TODO: Implement bulk delete API call
					console.log("Deleting categories:", selectedCategories);
					break;
				default:
					console.log(`${action} selected categories:`, selectedCategories);
			}

			// Refresh the list after bulk action
			await fetchCategories();
			setSelectedCategories([]);
		} catch (err) {
			setError(`Failed to ${action} categories`);
			console.error(`Error ${action}ing categories:`, err);
		} finally {
			setLoading(false);
		}
	};

	const handleCategoryAction = (action: string, category: Category) => {
		switch (action) {
			case "view":
				console.log("View category:", category);
				break;
			case "edit":
				console.log("Edit category:", category);
				// TODO: Implement edit functionality
				break;
			case "delete":
				handleDeleteCategory(category._id);
				break;
			default:
				console.log(`${action} category:`, category);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			await categoryService.create(formData);
			// Refresh categories list
			await fetchCategories();
			// Reset form and close
			setFormData({ name: "", description: "", image: undefined });
			setShowAddForm(false);
			setSuccess("Category created successfully!");
		} catch (err) {
			setError("Failed to create category");
			console.error("Error creating category:", err);
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

	const handleDeleteCategory = async (categoryId: string) => {
		if (window.confirm("Are you sure you want to delete this category?")) {
			setLoading(true);
			setError(null);
			try {
				await categoryService.delete(categoryId);
				await fetchCategories(); // Refresh the list
				setSuccess("Category deleted successfully!");
			} catch (err) {
				setError("Failed to delete category");
				console.error("Error deleting category:", err);
			} finally {
				setLoading(false);
			}
		}
	};

	// Status filtering is not applicable since the API doesn't return status field
	// const statusOptions = [
	// 	{ value: "", label: "All Statuses" },
	// 	{ value: "active", label: "Active" },
	// 	{ value: "inactive", label: "Inactive" },
	// ];

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
						Category Management
					</h1>
					<p className='text-gray-600 dark:text-gray-400 mt-1'>
						Manage your product categories and organization
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
					<Button
						variant='outline'
						onClick={fetchCategories}
						disabled={loading}>
						<Download className='h-4 w-4 mr-2' />
						Refresh
					</Button>
					<Button variant='outline'>
						<Upload className='h-4 w-4 mr-2' />
						Import
					</Button>
					<Button onClick={() => setShowAddForm(true)} disabled={loading}>
						<Plus className='h-4 w-4 mr-2' />
						Add Category
					</Button>
				</div>
			</div>

			{/* Add Category Form */}
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
									Add New Category
								</h3>
								<form onSubmit={handleSubmit} className='space-y-4'>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
										<div>
											<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
												Category Name
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
												placeholder='Enter category name'
												required
											/>
										</div>
										<div>
											<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
												Category Image
											</label>
											<input
												type='file'
												accept='image/*'
												onChange={handleImageChange}
												className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
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
											placeholder='Enter category description'
											rows={3}
											className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
											required
										/>
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
													Create Category
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
										Status filtering is not available
									</label>
									<p className='text-sm text-gray-500 dark:text-gray-400'>
										Status information is not provided by the API
									</p>
								</div>
								<div className='flex items-end'>
									<Button
										variant='outline'
										onClick={() => setFilterStatus("")}
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
			{selectedCategories.length > 0 && (
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4'>
					<div className='flex items-center justify-between'>
						<p className='text-sm text-blue-800 dark:text-blue-200'>
							{selectedCategories.length} categor
							{selectedCategories.length !== 1 ? "ies" : "y"} selected
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

			{/* Categories Table */}
			<Card>
				<div className='flex items-center justify-between mb-4'>
					<div className='flex items-center space-x-4'>
						<h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
							Categories
						</h2>
						<span className='text-sm text-gray-500 dark:text-gray-400'>
							{loading
								? "Loading..."
								: `${filteredCategories.length} categories`}
						</span>
					</div>
					<div className='flex items-center space-x-2'>
						<Archive className='h-5 w-5 text-gray-400' />
						<span className='text-sm text-gray-500 dark:text-gray-400'>
							Total: {categories.length}
						</span>
					</div>
				</div>

				<DataTable
					data={filteredCategories}
					columns={categoryColumns}
					searchable={true}
					sortable={true}
					pagination={true}
					pageSize={10}
					loading={loading}
					onView={(category) => handleCategoryAction("view", category)}
					onEdit={(category) => handleCategoryAction("edit", category)}
					onDelete={(category) => handleCategoryAction("delete", category)}
					actions={(category) => (
						<div className='flex items-center space-x-2'>
							<button
								onClick={() => handleCategoryAction("view", category)}
								className='p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors'
								title='View'>
								<Eye className='h-4 w-4' />
							</button>
							<button
								onClick={() => handleCategoryAction("edit", category)}
								className='p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors'
								title='Edit'>
								<Edit className='h-4 w-4' />
							</button>
							<button
								onClick={() => handleCategoryAction("delete", category)}
								className='p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors'
								title='Delete'>
								<Trash2 className='h-4 w-4' />
							</button>
						</div>
					)}
				/>
			</Card>

			{/* Quick Stats */}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<Card className='text-center'>
					<div className='p-4'>
						<Archive className='h-8 w-8 text-blue-500 mx-auto mb-2' />
						<p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
							{categories.length}
						</p>
						<p className='text-sm text-gray-500 dark:text-gray-400'>
							Total Categories
						</p>
					</div>
				</Card>
				<Card className='text-center'>
					<div className='p-4'>
						<div className='h-8 w-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-2'>
							<Archive className='h-5 w-5 text-blue-600 dark:text-blue-400' />
						</div>
						<p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
							{categories.length}
						</p>
						<p className='text-sm text-gray-500 dark:text-gray-400'>
							Categories with Images
						</p>
					</div>
				</Card>
			</div>
		</div>
	);
};

export default CategoryManagementScreen;
