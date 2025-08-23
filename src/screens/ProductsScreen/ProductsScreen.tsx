/** @format */

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Grid, List } from "lucide-react";
import { ProductCard } from "../../components/molecules/ProductCard/ProductCard";
import { Typography } from "../../components/atoms/Typography/Typography";
import { Input } from "../../components/atoms/Input/Input";
import Select from "../../components/atoms/Select/Select";
import { Button } from "../../components/atoms/Button/Button";
import { Icon } from "../../components/atoms/Icon/Icon";
import { useProducts, useCategories } from "../../hooks";
import { Product } from "../../services/productService";

export const ProductsScreen: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [sortBy, setSortBy] = useState("name");
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 12;

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

	// Get unique categories for filtering
	const categoryOptions = useMemo(() => {
		if (!categories.length) return ["all"];
		const uniqueCategories = [...new Set(categories.map((cat) => cat.name))];
		return ["all", ...uniqueCategories];
	}, [categories]);

	// Filter and sort products
	const filteredProducts = useMemo(() => {
		if (!products.length) return [];

		let filtered = products.filter((product: Product) => {
			const matchesSearch =
				product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				product.description.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesCategory =
				selectedCategory === "all" ||
				(product.categoryName || product.category) === selectedCategory;
			return matchesSearch && matchesCategory;
		});

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
					<Typography
						variant='body'
						className='text-gray-600 dark:text-gray-400'>
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
					<Typography
						variant='body'
						className='text-gray-600 dark:text-gray-400'>
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
				<Typography
					variant='body'
					className='max-w-2xl mx-auto text-gray-600 dark:text-gray-400'>
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
							onChange={(e) => setSearchTerm(e.target.value)}
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
						onChange={setSelectedCategory}
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
						onChange={setSortBy}
						className='min-w-[150px]'
					/>

					{/* View Mode Toggle */}
					<div className='flex items-center space-x-2 border border-gray-300 dark:border-gray-600 rounded-lg p-1'>
						<button
							onClick={() => setViewMode("grid")}
							className={`p-2 rounded-md transition-colors ${
								viewMode === "grid"
									? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
									: "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
							}`}>
							<Grid size={18} />
						</button>
						<button
							onClick={() => setViewMode("list")}
							className={`p-2 rounded-md transition-colors ${
								viewMode === "list"
									? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
									: "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
							}`}>
							<List size={18} />
						</button>
					</div>
				</div>

				{/* Results Count */}
				<div className='text-sm text-gray-600 dark:text-gray-400'>
					Showing {filteredProducts.length} of {products.length} products
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
					<Typography
						variant='body'
						className='text-gray-600 dark:text-gray-400'>
						Try adjusting your search terms or filters
					</Typography>
				</motion.div>
			)}
		</div>
	);
};
