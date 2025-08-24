/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
	Search,
	Filter,
	RefreshCw,
	MoreVertical,
	Eye,
	Edit,
	Trash2,
	UserPlus,
	Download,
	Mail,
	Phone,
	Calendar,
	Shield,
	CheckCircle,
	XCircle,
	AlertCircle,
	ChevronLeft,
	ChevronRight,
	Users,
	UserCheck,
	UserX,
} from "lucide-react";
import { Typography } from "../../components/atoms/Typography/Typography";
import { Button } from "../../components/atoms/Button/Button";
import { Input } from "../../components/atoms/Input/Input";
import { Select } from "../../components";
import { useUsers } from "../../hooks/useUsers";
import { User } from "../../types";
import { toast } from "react-hot-toast";

export const CustomersManagementScreen: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedRole, setSelectedRole] = useState<string>("");
	const [selectedStatus, setSelectedStatus] = useState<string>("");
	const [showFilters, setShowFilters] = useState(false);

	const {
		users,
		total,
		page,
		limit,
		totalPages,
		userStats,
		isLoading,
		statsLoading,
		error,
		updateFilters,
		resetFilters,
		updateStatus,
		updateRole,
		deleteUser,
		isUpdatingStatus,
		isUpdatingRole,
		isDeleting,
		refetch,
	} = useUsers({
		limit: 10,
		page: 1,
	});

	// Handle search
	const handleSearch = (value: string) => {
		setSearchTerm(value);
		updateFilters({ search: value, page: 1 });
	};

	// Handle role filter
	const handleRoleFilter = (role: string) => {
		setSelectedRole(role);
		updateFilters({ role: role || undefined, page: 1 });
	};

	// Handle status filter
	const handleStatusFilter = (status: string) => {
		setSelectedStatus(status);
		updateFilters({ status: status || undefined, page: 1 });
	};

	// Handle pagination
	const handlePageChange = (newPage: number) => {
		updateFilters({ page: newPage });
	};

	// Handle status update
	const handleStatusUpdate = (
		userId: string,
		newStatus: "active" | "inactive" | "suspended"
	) => {
		updateStatus({ userId, status: newStatus });
	};

	// Handle role update
	const handleRoleUpdate = (
		userId: string,
		newRole: "admin" | "customer" | "moderator"
	) => {
		updateRole({ userId, role: newRole });
	};

	// Handle user deletion
	const handleDeleteUser = (userId: string, userName: string) => {
		if (
			window.confirm(
				`Are you sure you want to delete user "${userName}"? This action cannot be undone.`
			)
		) {
			deleteUser(userId);
		}
	};

	// Get status badge
	const getStatusBadge = (status: string) => {
		switch (status) {
			case "active":
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
						<CheckCircle className='w-3 h-3 mr-1' />
						Active
					</span>
				);
			case "inactive":
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
						<XCircle className='w-3 h-3 mr-1' />
						Inactive
					</span>
				);
			case "suspended":
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
						<AlertCircle className='w-3 h-3 mr-1' />
						Suspended
					</span>
				);
			default:
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
						Unknown
					</span>
				);
		}
	};

	// Get role badge
	const getRoleBadge = (role: string) => {
		switch (role) {
			case "admin":
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800'>
						<Shield className='w-3 h-3 mr-1' />
						Admin
					</span>
				);
			case "moderator":
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
						<UserCheck className='w-3 h-3 mr-1' />
						Moderator
					</span>
				);
			case "customer":
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
						<Users className='w-3 h-3 mr-1' />
						Customer
					</span>
				);
			default:
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
						Unknown
					</span>
				);
		}
	};

	// Format date
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	if (error) {
		return (
			<div className='text-center py-12'>
				<Typography variant='h3' className='text-red-600 mb-4'>
					Error loading users
				</Typography>
				<Typography variant='body' className='text-gray-600 mb-4'>
					{error.message}
				</Typography>
				<Button onClick={() => refetch()} variant='outline'>
					<RefreshCw className='w-4 h-4 mr-2' />
					Try Again
				</Button>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
				<div>
					<Typography variant='h1' className='mb-2'>
						Customer Management
					</Typography>
					<Typography variant='body' className='text-gray-600'>
						Manage all system users, their roles, and account status
					</Typography>
				</div>
				<div className='flex items-center gap-3'>
					<Button variant='outline' size='sm'>
						<Download className='w-4 h-4 mr-2' />
						Export
					</Button>
					<Button size='sm'>
						<UserPlus className='w-4 h-4 mr-2' />
						Add User
					</Button>
				</div>
			</div>

			{/* Stats Cards */}
			{!statsLoading && userStats && (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
						className='bg-white rounded-lg p-6 shadow-sm border border-gray-200'>
						<div className='flex items-center'>
							<div className='p-2 bg-blue-100 rounded-lg'>
								<Users className='w-6 h-6 text-blue-600' />
							</div>
							<div className='ml-4'>
								<Typography variant='h3' className='text-gray-900'>
									{userStats.totalUsers}
								</Typography>
								<Typography variant='body' className='text-gray-600'>
									Total Users
								</Typography>
							</div>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, delay: 0.1 }}
						className='bg-white rounded-lg p-6 shadow-sm border border-gray-200'>
						<div className='flex items-center'>
							<div className='p-2 bg-green-100 rounded-lg'>
								<UserCheck className='w-6 h-6 text-green-600' />
							</div>
							<div className='ml-4'>
								<Typography variant='h3' className='text-gray-900'>
									{userStats.activeUsers}
								</Typography>
								<Typography variant='body' className='text-gray-600'>
									Active Users
								</Typography>
							</div>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, delay: 0.2 }}
						className='bg-white rounded-lg p-6 shadow-sm border border-gray-200'>
						<div className='flex items-center'>
							<div className='p-2 bg-purple-100 rounded-lg'>
								<Shield className='w-6 h-6 text-purple-600' />
							</div>
							<div className='ml-4'>
								<Typography variant='h3' className='text-gray-900'>
									{userStats.admins}
								</Typography>
								<Typography variant='body' className='text-gray-600'>
									Administrators
								</Typography>
							</div>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, delay: 0.3 }}
						className='bg-white rounded-lg p-6 shadow-sm border border-gray-200'>
						<div className='flex items-center'>
							<div className='p-2 bg-orange-100 rounded-lg'>
								<Users className='w-6 h-6 text-orange-600' />
							</div>
							<div className='ml-4'>
								<Typography variant='h3' className='text-gray-900'>
									{userStats.customers}
								</Typography>
								<Typography variant='body' className='text-gray-600'>
									Customers
								</Typography>
							</div>
						</div>
					</motion.div>
				</div>
			)}

			{/* Filters and Search */}
			<div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
				<div className='flex flex-col lg:flex-row gap-4'>
					<div className='flex-1'>
						<Input
							placeholder='Search users by name or email...'
							value={searchTerm}
							onChange={(e) => handleSearch(e.target.value)}
							icon={<Search className='w-4 h-4' />}
						/>
					</div>
					<div className='flex items-center gap-3'>
						<Select
							value={selectedRole}
							onChange={handleRoleFilter}
							options={[
								{ value: "", label: "All Roles" },
								{ value: "admin", label: "Admin" },
								{ value: "moderator", label: "Moderator" },
								{ value: "customer", label: "Customer" },
							]}
							placeholder='All Roles'
							className='min-w-[140px]'
						/>
						<Select
							value={selectedStatus}
							onChange={handleStatusFilter}
							options={[
								{ value: "", label: "All Status" },
								{ value: "active", label: "Active" },
								{ value: "inactive", label: "Inactive" },
								{ value: "suspended", label: "Suspended" },
							]}
							placeholder='All Status'
							className='min-w-[140px]'
						/>
						<Button
							variant='outline'
							size='sm'
							onClick={() => setShowFilters(!showFilters)}>
							<Filter className='w-4 h-4 mr-2' />
							Filters
						</Button>
						<Button
							variant='outline'
							size='sm'
							onClick={() => {
								resetFilters();
								setSearchTerm("");
								setSelectedRole("");
								setSelectedStatus("");
							}}>
							<RefreshCw className='w-4 h-4 mr-2' />
							Reset
						</Button>
					</div>
				</div>
			</div>

			{/* Users Table */}
			<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden'>
				<div className='overflow-x-auto'>
					<table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
						<thead className='bg-gray-50 dark:bg-gray-700'>
							<tr>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
									User
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
									Role
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
									Status
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
									Joined
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
									Last Login
								</th>
								<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
									Actions
								</th>
							</tr>
						</thead>
						<tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
							{isLoading ? (
								<tr>
									<td colSpan={6} className='px-6 py-12 text-center'>
										<div className='flex items-center justify-center'>
											<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
											<span className='ml-2 text-gray-600 dark:text-gray-400'>
												Loading users...
											</span>
										</div>
									</td>
								</tr>
							) : users.length === 0 ? (
								<tr>
									<td colSpan={6} className='px-6 py-12 text-center'>
										<Typography
											variant='body'
											className='text-gray-500 dark:text-gray-400'>
											No users found matching your criteria
										</Typography>
									</td>
								</tr>
							) : (
								users.map((user: User, index: number) => (
									<motion.tr
										key={user.id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.3, delay: index * 0.05 }}
										className='hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'>
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='flex items-center'>
												<div className='flex-shrink-0 h-10 w-10'>
													<div className='h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center'>
														<Typography
															variant='body'
															className='text-white font-semibold'>
															{user.name.charAt(0).toUpperCase()}
														</Typography>
													</div>
												</div>
												<div className='ml-4'>
													<Typography
														variant='h4'
														className='text-gray-900 dark:text-white'>
														{user.name}
													</Typography>
													<Typography
														variant='body'
														className='text-gray-500 dark:text-gray-400'>
														{user.email}
													</Typography>
												</div>
											</div>
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											{getRoleBadge(user.role)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											{getStatusBadge(user.status)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
											{formatDate(user.createdAt)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
											{user.lastLogin ? formatDate(user.lastLogin) : "Never"}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
											<div className='flex items-center justify-end gap-2'>
												<Button
													variant='ghost'
													size='sm'
													onClick={() => {
														// View user details
														console.log("View user:", user.id);
													}}>
													<Eye className='w-4 h-4' />
												</Button>
												<Button
													variant='ghost'
													size='sm'
													onClick={() => {
														// Edit user
														console.log("Edit user:", user.id);
													}}>
													<Edit className='w-4 h-4' />
												</Button>
												<Button
													variant='ghost'
													size='sm'
													onClick={() => handleDeleteUser(user.id, user.name)}
													disabled={isDeleting}
													className='text-red-600 hover:text-red-800 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20'>
													<Trash2 className='w-4 h-4' />
												</Button>
											</div>
										</td>
									</motion.tr>
								))
							)}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				{totalPages > 1 && (
					<div className='bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6'>
						<div className='flex-1 flex justify-between sm:hidden'>
							<Button
								variant='outline'
								size='sm'
								onClick={() => handlePageChange(page - 1)}
								disabled={page === 1}>
								Previous
							</Button>
							<Button
								variant='outline'
								size='sm'
								onClick={() => handlePageChange(page + 1)}
								disabled={page === totalPages}>
								Next
							</Button>
						</div>
						<div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
							<div>
								<Typography
									variant='body'
									className='text-sm text-gray-700 dark:text-gray-300'>
									Showing{" "}
									<span className='font-medium'>{(page - 1) * limit + 1}</span>{" "}
									to{" "}
									<span className='font-medium'>
										{Math.min(page * limit, total)}
									</span>{" "}
									of <span className='font-medium'>{total}</span> results
								</Typography>
							</div>
							<div>
								<nav className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px'>
									<Button
										variant='outline'
										size='sm'
										onClick={() => handlePageChange(page - 1)}
										disabled={page === 1}
										className='rounded-l-md'>
										<ChevronLeft className='w-4 h-4' />
									</Button>
									{Array.from({ length: totalPages }, (_, i) => i + 1).map(
										(pageNum) => (
											<Button
												key={pageNum}
												variant={pageNum === page ? "default" : "outline"}
												size='sm'
												onClick={() => handlePageChange(pageNum)}
												className='rounded-none'>
												{pageNum}
											</Button>
										)
									)}
									<Button
										variant='outline'
										size='sm'
										onClick={() => handlePageChange(page + 1)}
										disabled={page === totalPages}
										className='rounded-r-md'>
										<ChevronRight className='w-4 h-4' />
									</Button>
								</nav>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default CustomersManagementScreen;
