/** @format */

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Grid, List } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { ProductCard } from "../../components/molecules/ProductCard/ProductCard";
import { Typography } from "../../components/atoms/Typography/Typography";
import { Input } from "../../components/atoms/Input/Input";
import Select from "../../components/atoms/Select/Select";
import { Button } from "../../components/atoms/Button/Button";
import { Icon } from "../../components/atoms/Icon/Icon";
import { useProducts, useCategories } from "../../hooks";
import { Product } from "../../types";

export const ProductsScreen: React.FC = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState(() => {
		// Initialize category from URL params
		const categoryFromUrl = searchParams.get("category");
		return categoryFromUrl || "all";
	});
	const [sortBy, setSortBy] = useState("name");
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 12;

	// Reset to first page when filters change
	const resetToFirstPage = () => {
		setCurrentPage(1);
	};

	// Debounced search to improve performance
	const debouncedSearch = useCallback((value: string) => {
		const timeoutId = setTimeout(() => {
			setSearchTerm(value);
			resetToFirstPage();
		}, 300);
		return () => clearTimeout(timeoutId);
	}, []);

	// Fetch data from backend
	const {
		data: productsData,
		isLoading: productsLoading,
		error: productsError,
	} = useProducts(1, 1000); // Fetch all products for filtering
	const {
		data: categoriesData,
		isLoading: categoriesLoading,
		error: categoriesError,
	} = useCategories();

	// Get products and categories from the fetched data
	const products = productsData?.items || [];
	const categories = categoriesData || [];

	// Function to get category display name for the current filter
	const getCategoryDisplayName = useCallback(
		(categoryId: string) => {
			const category = categories.find(
				(cat) => cat._id === categoryId || cat.name === categoryId
			);
			return category?.name || categoryId;
		},
		[categories]
	);

	// Debug logging
	useEffect(() => {
		console.log("Products data:", products);
		console.log("Categories data:", categories);
	}, [products, categories]);

	// Update URL when category filter changes
	useEffect(() => {
		if (selectedCategory === "all") {
			searchParams.delete("category");
		} else {
			searchParams.set("category", selectedCategory);
		}
		setSearchParams(searchParams);
	}, [selectedCategory, searchParams, setSearchParams]);

	// Get unique categories for filtering
	const categoryOptions = useMemo(() => {
		if (!categories.length) return ["all"];
		// Include both category names and IDs for filtering
		const categoryOptions = categories.map((cat) => ({
			value: cat.name,
			label: cat.name,
			id: cat._id,
		}));
		console.log("Available categories for filter:", categoryOptions);
		return ["all", ...categoryOptions.map((cat) => cat.value)];
	}, [categories]);

	// Filter and sort products
	const filteredProducts = useMemo(() => {
		if (!products.length) return [];

		console.log("Filtering products:", {
			searchTerm,
			selectedCategory,
			sortBy,
			totalProducts: products.length,
		});

		let filtered = products.filter((product: Product) => {
			// Search filter
			const matchesSearch =
				product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				product.description.toLowerCase().includes(searchTerm.toLowerCase());

			// Category filter - handle both category ID and categoryName
			let matchesCategory = false;
			if (selectedCategory === "all") {
				matchesCategory = true;
			} else {
				// Check if product has categoryName that matches
				if (product.categoryName && product.categoryName === selectedCategory) {
					matchesCategory = true;
				}
				// Check if product category object has name that matches
				else if (
					typeof product.category === "object" &&
					product.category?.name === selectedCategory
				) {
					matchesCategory = true;
				}
				// Check if product category is a string ID that matches
				else if (
					typeof product.category === "string" &&
					product.category === selectedCategory
				) {
					matchesCategory = true;
				}
				// Check if product category object has ID that matches
				else if (
					typeof product.category === "object" &&
					product.category?._id === selectedCategory
				) {
					matchesCategory = true;
				}
			}

			console.log(`Product "${product.name}":`, {
				searchMatch: matchesSearch,
				categoryMatch: matchesCategory,
				productCategory: product.category,
				productCategoryName: product.categoryName,
				selectedCategory,
			});

			return matchesSearch && matchesCategory;
		});

		console.log("Filtered products count:", filtered.length);

		// Sort products
		switch (sortBy) {
			case "name":
				filtered.sort((a, b) => a.name.localeCompare(b.name));
				break;
			case "price-low":
				filtered.sort((a, b) => a.price - b.price);
				break;
			case "price-high":
				filtered.sort((a, b) => b.price - a.price);
				break;
			case "newest":
				// Sort by createdAt if available
				filtered.sort(
					(a, b) =>
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				);
				break;
			default:
				break;
		}

		return filtered;
	}, [products, searchTerm, selectedCategory, sortBy]);

	// Pagination
	const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
	const paginatedProducts = filteredProducts.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.5 },
		},
	};

	// Loading state
	if (productsLoading || categoriesLoading) {
		return (
			<div className='container mx-auto px-6 py-12'>
				<div className='text-center'>
					<Typography variant='h1' className='mb-4'>
						Loading...
					</Typography>
					<Typography variant='body' className='text-gray-600'>
						Please wait while we fetch the latest products and categories.
					</Typography>
				</div>
			</div>
		);
	}

	// Error state
	if (productsError || categoriesError) {
		return (
			<div className='container mx-auto px-6 py-12'>
				<div className='text-center'>
					<Typography variant='h1' className='mb-4 text-red-600'>
						Error Loading Data
					</Typography>
					<Typography variant='body' className='text-gray-600'>
						{productsError
							? "Failed to load products."
							: "Failed to load categories."}
						Please try refreshing the page.
					</Typography>
				</div>
			</div>
		);
	}

	return (
		<div className='container mx-auto px-6 py-12'>
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className='text-center mb-12'>
				<Typography variant='h1' className='mb-4'>
					Our Collection
				</Typography>
				<Typography variant='body' className='max-w-2xl mx-auto text-gray-600'>
					Discover our curated selection of timeless pieces designed for the
					modern individual
				</Typography>
			</motion.div>

			{/* Filters and Search */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.2 }}
				className='mb-8 space-y-4'>
				{/* Active Filters Indicator */}
				{(searchTerm || selectedCategory !== "all" || sortBy !== "name") && (
					<div className='flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-lg'>
						<Filter size={16} />
						<span>Active filters:</span>
						{searchTerm && (
							<span className='bg-blue-100 px-2 py-1 rounded'>
								Search: "{searchTerm}"
							</span>
						)}
						{selectedCategory !== "all" && (
							<span className='bg-blue-100 px-2 py-1 rounded'>
								Category: {selectedCategory}
							</span>
						)}
						{sortBy !== "name" && (
							<span className='bg-blue-100 px-2 py-1 rounded'>
								Sort:{" "}
								{sortBy === "price-low"
									? "Price: Low to High"
									: sortBy === "price-high"
									? "Price: High to Low"
									: sortBy === "newest"
									? "Newest First"
									: sortBy}
							</span>
						)}
					</div>
				)}
				<div className='flex flex-col lg:flex-row gap-4 items-center justify-between'>
					{/* Search */}
					<div className='relative flex-1 max-w-md'>
						<Icon
							icon={Search}
							className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
							size={20}
						/>
						<Input
							type='text'
							placeholder='Search products...'
							value={searchTerm}
							onChange={(e) => {
								const value = e.target.value;
								setSearchTerm(value);
								// Use debounced search for better performance
								if (value.length === 0) {
									resetToFirstPage();
								} else {
									debouncedSearch(value);
								}
							}}
							className='pl-10'
						/>
					</div>

					{/* Category Filter */}
					<Select
						options={categoryOptions.map((category) => ({
							value: category,
							label:
								category === "all"
									? "All Categories"
									: category.charAt(0).toUpperCase() + category.slice(1),
						}))}
						value={selectedCategory}
						onChange={(value) => {
							setSelectedCategory(value);
							resetToFirstPage();
						}}
						className='min-w-[150px]'
					/>

					{/* Sort */}
					<Select
						options={[
							{ value: "name", label: "Name A-Z" },
							{ value: "price-low", label: "Price: Low to High" },
							{ value: "price-high", label: "Price: High to Low" },
							{ value: "newest", label: "Newest First" },
						]}
						value={sortBy}
						onChange={(value) => {
							setSortBy(value);
							resetToFirstPage();
						}}
						className='min-w-[150px]'
					/>

					{/* View Mode Toggle */}
					<div className='flex items-center space-x-2 border border-gray-300 rounded-lg p-1'>
						<button
							onClick={() => setViewMode("grid")}
							className={`p-2 rounded-md transition-colors ${
								viewMode === "grid"
									? "bg-gray-200 text-gray-900"
									: "text-gray-500 hover:text-gray-700"
							}`}>
							<Grid size={18} />
						</button>
						<button
							onClick={() => setViewMode("list")}
							className={`p-2 rounded-md transition-colors ${
								viewMode === "list"
									? "bg-gray-200 text-gray-900"
									: "text-gray-500 hover:text-gray-700"
							}`}>
							<List size={18} />
						</button>
					</div>

					{/* Reset Filters Button */}
					{(searchTerm || selectedCategory !== "all" || sortBy !== "name") && (
						<Button
							variant='outline'
							onClick={() => {
								setSearchTerm("");
								setSelectedCategory("all");
								setSortBy("name");
								setCurrentPage(1);
							}}
							className='min-w-[120px]'>
							Reset Filters
						</Button>
					)}
				</div>

				{/* Current Category Display */}
				{selectedCategory !== "all" && (
					<div className='mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
						<Typography variant='body' className='text-blue-800'>
							Currently viewing:{" "}
							<span className='font-semibold'>
								{getCategoryDisplayName(selectedCategory)}
							</span>
						</Typography>
					</div>
				)}

				{/* Results Count */}
				<div className='text-sm text-gray-600'>
					{searchTerm || selectedCategory !== "all" ? (
						<>
							Showing {filteredProducts.length} of {products.length} products
							{filteredProducts.length !== products.length && (
								<span className='ml-2 text-blue-600'>(Filtered results)</span>
							)}
						</>
					) : (
						`Showing ${filteredProducts.length} products`
					)}
				</div>
			</motion.div>

			{/* Products Grid */}
			<motion.div
				variants={containerVariants}
				initial='hidden'
				animate='visible'
				className={`grid gap-6 ${
					viewMode === "grid"
						? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
						: "grid-cols-1"
				}`}>
				{paginatedProducts.map((product) => (
					<motion.div key={product.id} variants={itemVariants}>
						<ProductCard product={product} />
					</motion.div>
				))}
			</motion.div>

			{/* Pagination */}
			{totalPages > 1 && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					className='flex items-center justify-center space-x-2 mt-12'>
					<Button
						variant='outline'
						onClick={() => handlePageChange(currentPage - 1)}
						disabled={currentPage === 1}
						size='sm'>
						Previous
					</Button>

					{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
						<Button
							key={page}
							variant={currentPage === page ? "primary" : "outline"}
							onClick={() => handlePageChange(page)}
							size='sm'
							className='min-w-[40px]'>
							{page}
						</Button>
					))}

					<Button
						variant='outline'
						onClick={() => handlePageChange(currentPage + 1)}
						disabled={currentPage === totalPages}
						size='sm'>
						Next
					</Button>
				</motion.div>
			)}

			{/* No Results */}
			{filteredProducts.length === 0 && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className='text-center py-20'>
					<Icon
						icon={Search}
						size={64}
						className='mx-auto mb-4 text-gray-400'
					/>
					<Typography variant='h3' className='mb-2'>
						No products found
					</Typography>
					<Typography variant='body' className='text-gray-600 mb-4'>
						{searchTerm || selectedCategory !== "all" ? (
							<>Try adjusting your search terms or filters</>
						) : (
							<>No products are currently available</>
						)}
					</Typography>
					{(searchTerm || selectedCategory !== "all") && (
						<Button
							variant='outline'
							onClick={() => {
								setSearchTerm("");
								setSelectedCategory("all");
								setSortBy("name");
								setCurrentPage(1);
							}}
							className='mt-4'>
							Clear All Filters
						</Button>
					)}
				</motion.div>
			)}
		</div>
	);
};
