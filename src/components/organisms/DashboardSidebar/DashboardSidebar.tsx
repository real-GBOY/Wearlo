/** @format */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
	LayoutDashboard,
	Package,
	ShoppingCart,
	Users,
	BarChart3,
	Settings,
	ChevronRight,
	ChevronDown,
	Menu,
	X,
	Home,
	Archive,
	UserCheck,
} from "lucide-react";
import { cn } from "../../../utils/cn";

interface MenuItem {
	id: string;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
	path: string;
	subItems?: Omit<MenuItem, "subItems">[];
}

const menuItems: MenuItem[] = [
	{
		id: "dashboard",
		label: "Dashboard",
		icon: LayoutDashboard,
		path: "/admin",
	},
	{
		id: "products",
		label: "Products",
		icon: Package,
		path: "/admin/products",
		subItems: [
			{
				id: "all-products",
				label: "All Products",
				icon: Package,
				path: "/admin/products",
			},
			{
				id: "categories",
				label: "Categories",
				icon: Archive,
				path: "/admin/categories",
			},
			{
				id: "inventory",
				label: "Inventory",
				icon: Archive,
				path: "/admin/inventory",
			},
		],
	},
	{
		id: "orders",
		label: "Orders",
		icon: ShoppingCart,
		path: "/admin/orders",
	},
	{
		id: "users",
		label: "Users",
		icon: Users,
		path: "/admin/users",
		subItems: [
			{
				id: "customers",
				label: "Customers",
				icon: Users,
				path: "/admin/users/customers",
			},
			{
				id: "admins",
				label: "Administrators",
				icon: UserCheck,
				path: "/admin/users/admins",
			},
		],
	},
	{
		id: "analytics",
		label: "Analytics",
		icon: BarChart3,
		path: "/admin/analytics",
	},
	{
		id: "settings",
		label: "Settings",
		icon: Settings,
		path: "/admin/settings",
	},
];

interface DashboardSidebarProps {
	isCollapsed: boolean;
	onToggle: () => void;
	className?: string;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
	isCollapsed,
	onToggle,
	className,
}) => {
	const location = useLocation();
	const [expandedItems, setExpandedItems] = useState<string[]>([]);

	const toggleExpanded = (itemId: string) => {
		setExpandedItems((prev) =>
			prev.includes(itemId)
				? prev.filter((id) => id !== itemId)
				: [...prev, itemId]
		);
	};

	const isActive = (path: string) => {
		return (
			location.pathname === path || location.pathname.startsWith(path + "/")
		);
	};

	const renderMenuItem = (item: MenuItem, level: number = 0) => {
		const isExpanded = expandedItems.includes(item.id);
		const hasSubItems = item.subItems && item.subItems.length > 0;
		const active = isActive(item.path);

		return (
			<div key={item.id}>
				<Link
					to={item.path}
					className={cn(
						"flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
						"hover:bg-gray-100",
						active && "bg-blue-50 text-blue-700",
						!active && "text-gray-700",
						level > 0 && "ml-6",
						isCollapsed && level === 0 && "justify-center"
					)}
					onClick={() => {
						if (hasSubItems) {
							toggleExpanded(item.id);
						}
					}}>
					<item.icon
						className={cn(
							"h-5 w-5",
							level === 0 && !isCollapsed && "mr-3",
							active ? "text-blue-600" : "text-gray-500"
						)}
					/>
					{(!isCollapsed || level > 0) && (
						<>
							<span className='flex-1'>{item.label}</span>
							{hasSubItems && (
								<motion.div
									animate={{ rotate: isExpanded ? 90 : 0 }}
									transition={{ duration: 0.2 }}>
									<ChevronRight className='h-4 w-4' />
								</motion.div>
							)}
						</>
					)}
				</Link>

				{/* Sub-items */}
				{hasSubItems && !isCollapsed && (
					<AnimatePresence>
						{isExpanded && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								exit={{ opacity: 0, height: 0 }}
								transition={{ duration: 0.2 }}
								className='overflow-hidden'>
								{item.subItems!.map((subItem) => (
									<Link
										key={subItem.id}
										to={subItem.path}
										className={cn(
											"flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
											"hover:bg-gray-100",
											isActive(subItem.path) && "bg-blue-50 text-blue-700",
											!isActive(subItem.path) && "text-gray-600",
											"ml-6"
										)}>
										<subItem.icon
											className={cn(
												"h-4 w-4 mr-3",
												isActive(subItem.path)
													? "text-blue-600"
													: "text-gray-500"
											)}
										/>
										<span>{subItem.label}</span>
									</Link>
								))}
							</motion.div>
						)}
					</AnimatePresence>
				)}
			</div>
		);
	};

	return (
		<motion.div
			className={cn(
				"bg-white border-r border-gray-200 h-full flex flex-col",
				isCollapsed ? "w-16" : "w-64",
				"transition-all duration-300 ease-in-out",
				className
			)}
			initial={false}
			animate={{ width: isCollapsed ? 64 : 256 }}>
			{/* Header */}
			<div className='flex items-center justify-between p-4 border-b border-gray-200'>
				{!isCollapsed && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.1 }}>
						<h1 className='text-xl font-bold text-gray-900'>Wearlo Admin</h1>
					</motion.div>
				)}
				<button
					onClick={onToggle}
					className='p-2 rounded-lg hover:bg-gray-100 transition-colors'>
					{isCollapsed ? (
						<ChevronRight className='h-5 w-5 text-gray-600' />
					) : (
						<ChevronDown className='h-5 w-5 text-gray-600' />
					)}
				</button>
			</div>

			{/* Navigation */}
			<nav className='flex-1 p-4 space-y-2 overflow-y-auto'>
				{menuItems.map((item) => renderMenuItem(item))}
			</nav>

			{/* Footer */}
			<div className='p-4 border-t border-gray-200'>
				<Link
					to='/'
					className={cn(
						"flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
						"hover:bg-gray-100 text-gray-600",
						isCollapsed && "justify-center"
					)}>
					<Home className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
					{!isCollapsed && <span>Back to Store</span>}
				</Link>
			</div>
		</motion.div>
	);
};

export default DashboardSidebar;
