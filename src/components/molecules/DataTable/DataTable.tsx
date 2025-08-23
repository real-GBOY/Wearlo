/** @format */

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Search,
	ChevronUp,
	ChevronDown,
	MoreHorizontal,
	Edit,
	Trash2,
	Eye,
} from "lucide-react";
import { cn } from "../../../utils/cn";
import Badge from "../../atoms/Badge";

interface Column<T> {
	key: keyof T;
	label: string;
	sortable?: boolean;
	render?: (value: any, item: T) => React.ReactNode;
	width?: string;
}

interface DataTableProps<T> {
	data: T[];
	columns: Column<T>[];
	searchable?: boolean;
	sortable?: boolean;
	pagination?: boolean;
	pageSize?: number;
	actions?: (item: T) => React.ReactNode;
	onEdit?: (item: T) => void;
	onDelete?: (item: T) => void;
	onView?: (item: T) => void;
	loading?: boolean;
	emptyMessage?: string;
	className?: string;
}

function DataTable<T extends { id: string | number }>({
	data,
	columns,
	searchable = true,
	sortable = true,
	pagination = true,
	pageSize = 10,
	actions,
	onEdit,
	onDelete,
	onView,
	loading = false,
	emptyMessage = "No data available",
	className,
}: DataTableProps<T>) {
	const [searchTerm, setSearchTerm] = useState("");
	const [sortConfig, setSortConfig] = useState<{
		key: keyof T;
		direction: "asc" | "desc";
	} | null>(null);
	const [currentPage, setCurrentPage] = useState(1);

	// Filter data based on search term
	const filteredData = useMemo(() => {
		if (!searchTerm) return data;

		return data.filter((item) =>
			Object.values(item).some((value) =>
				String(value).toLowerCase().includes(searchTerm.toLowerCase())
			)
		);
	}, [data, searchTerm]);

	// Sort data
	const sortedData = useMemo(() => {
		if (!sortConfig) return filteredData;

		return [...filteredData].sort((a, b) => {
			const aValue = a[sortConfig.key];
			const bValue = b[sortConfig.key];

			if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
			if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
			return 0;
		});
	}, [filteredData, sortConfig]);

	// Paginate data
	const paginatedData = useMemo(() => {
		if (!pagination) return sortedData;

		const startIndex = (currentPage - 1) * pageSize;
		return sortedData.slice(startIndex, startIndex + pageSize);
	}, [sortedData, currentPage, pageSize, pagination]);

	const totalPages = Math.ceil(filteredData.length / pageSize);

	const handleSort = (key: keyof T) => {
		if (!sortable) return;

		setSortConfig((current) => {
			if (current?.key === key) {
				return {
					key,
					direction: current.direction === "asc" ? "desc" : "asc",
				};
			}
			return { key, direction: "asc" };
		});
	};

	const getSortIcon = (key: keyof T) => {
		if (!sortable || sortConfig?.key !== key) {
			return <div className='w-4 h-4' />;
		}

		return sortConfig.direction === "asc" ? (
			<ChevronUp className='w-4 h-4' />
		) : (
			<ChevronDown className='w-4 h-4' />
		);
	};

	const renderCell = (item: T, column: Column<T>) => {
		const value = item[column.key];

		if (column.render) {
			return column.render(value, item);
		}

		return String(value);
	};

	if (loading) {
		return (
			<div
				className={cn(
					"bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700",
					className
				)}>
				<div className='p-6'>
					<div className='animate-pulse space-y-4'>
						<div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4'></div>
						<div className='space-y-3'>
							{[...Array(5)].map((_, i) => (
								<div
									key={i}
									className='h-4 bg-gray-200 dark:bg-gray-700 rounded'></div>
							))}
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div
			className={cn(
				"bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700",
				className
			)}>
			{/* Search Bar */}
			{searchable && (
				<div className='p-4 border-b border-gray-200 dark:border-gray-700'>
					<div className='relative'>
						<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
						<input
							type='text'
							placeholder='Search...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className='w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
						/>
					</div>
				</div>
			)}

			{/* Table */}
			<div className='overflow-x-auto'>
				<table className='w-full'>
					<thead className='bg-gray-50 dark:bg-gray-700'>
						<tr>
							{columns.map((column) => (
								<th
									key={String(column.key)}
									className={cn(
										"px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider",
										sortable &&
											column.sortable !== false &&
											"cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600",
										column.width
									)}
									onClick={() =>
										column.sortable !== false && handleSort(column.key)
									}>
									<div className='flex items-center space-x-1'>
										<span>{column.label}</span>
										{sortable &&
											column.sortable !== false &&
											getSortIcon(column.key)}
									</div>
								</th>
							))}
							{(onEdit || onDelete || onView || actions) && (
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
									Actions
								</th>
							)}
						</tr>
					</thead>
					<tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
						<AnimatePresence>
							{paginatedData.map((item, index) => (
								<motion.tr
									key={item.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{ duration: 0.2, delay: index * 0.05 }}
									className='hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150'>
									{columns.map((column) => (
										<td
											key={String(column.key)}
											className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100'>
											{renderCell(item, column)}
										</td>
									))}
									{(onEdit || onDelete || onView || actions) && (
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
											{actions ? (
												actions(item)
											) : (
												<div className='flex items-center space-x-2'>
													{onView && (
														<button
															onClick={() => onView(item)}
															className='p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors'>
															<Eye className='h-4 w-4' />
														</button>
													)}
													{onEdit && (
														<button
															onClick={() => onEdit(item)}
															className='p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors'>
															<Edit className='h-4 w-4' />
														</button>
													)}
													{onDelete && (
														<button
															onClick={() => onDelete(item)}
															className='p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors'>
															<Trash2 className='h-4 w-4' />
														</button>
													)}
												</div>
											)}
										</td>
									)}
								</motion.tr>
							))}
						</AnimatePresence>
					</tbody>
				</table>
			</div>

			{/* Empty State */}
			{paginatedData.length === 0 && (
				<div className='p-8 text-center'>
					<p className='text-gray-500 dark:text-gray-400'>{emptyMessage}</p>
				</div>
			)}

			{/* Pagination */}
			{pagination && totalPages > 1 && (
				<div className='px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between'>
					<div className='text-sm text-gray-700 dark:text-gray-300'>
						Showing {(currentPage - 1) * pageSize + 1} to{" "}
						{Math.min(currentPage * pageSize, filteredData.length)} of{" "}
						{filteredData.length} results
					</div>
					<div className='flex items-center space-x-2'>
						<button
							onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
							disabled={currentPage === 1}
							className='px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'>
							Previous
						</button>
						<span className='px-3 py-1 text-sm text-gray-700 dark:text-gray-300'>
							Page {currentPage} of {totalPages}
						</span>
						<button
							onClick={() =>
								setCurrentPage((prev) => Math.min(prev + 1, totalPages))
							}
							disabled={currentPage === totalPages}
							className='px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'>
							Next
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default DataTable;
