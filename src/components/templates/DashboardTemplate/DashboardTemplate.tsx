/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import DashboardSidebar from "../../organisms/DashboardSidebar";
import DashboardHeader from "../../organisms/DashboardHeader";
import { cn } from "../../../utils/cn";

interface DashboardTemplateProps {
	children: React.ReactNode;
	className?: string;
}

const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
	children,
	className,
}) => {
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

	const toggleSidebar = () => {
		setIsSidebarCollapsed(!isSidebarCollapsed);
	};

	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='flex h-screen'>
				{/* Sidebar */}
				<DashboardSidebar
					isCollapsed={isSidebarCollapsed}
					onToggle={toggleSidebar}
				/>

				{/* Main Content */}
				<div className='flex-1 flex flex-col overflow-hidden'>
					{/* Header */}
					<DashboardHeader
						onMenuToggle={toggleSidebar}
						notifications={[]} // Pass actual notifications here
						onNotificationClick={(notification) => {
							console.log("Notification clicked:", notification);
						}}
						onMarkAllRead={() => {
							console.log("Mark all notifications as read");
						}}
						user={{
							name: "Admin User",
							email: "admin@wearlo.com",
							role: "Administrator",
						}}
						onLogout={() => {
							console.log("Logout clicked");
						}}
					/>

					{/* Page Content */}
					<motion.main
						className={cn("flex-1 overflow-y-auto p-6", className)}
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.3 }}>
						{children}
					</motion.main>
				</div>
			</div>
		</div>
	);
};

export default DashboardTemplate;
