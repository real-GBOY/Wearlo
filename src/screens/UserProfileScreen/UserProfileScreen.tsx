/** @format */

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
	User,
	Mail,
	Phone,
	MapPin,
	Package,
	Heart,
	Settings,
	Edit3,
	Save,
	X,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Typography } from "../../components/atoms/Typography/Typography";
import { Button } from "../../components/atoms/Button/Button";
import { Input } from "../../components/atoms/Input/Input";
import { Icon } from "../../components/atoms/Icon/Icon";
import Card from "../../components/atoms/Card/Card";

export const UserProfileScreen: React.FC = () => {
	const { user } = useAuth();
	const [isEditing, setIsEditing] = useState(false);
	const [activeTab, setActiveTab] = useState<"profile" | "orders" | "wishlist">(
		"profile"
	);
	const [formData, setFormData] = useState({
		name: user?.name || "",
		email: user?.email || "",
		phone: user?.phone || "",
		address: user?.address || "",
		city: user?.city || "",
		zip: user?.zip || "",
		country: user?.country || "",
	});

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSave = () => {
		// TODO: Implement API call to update user profile
		console.log("Saving profile:", formData);
		setIsEditing(false);
	};

	const handleCancel = () => {
		setFormData({
			name: user?.name || "",
			email: user?.email || "",
			phone: user?.phone || "",
			address: user?.address || "",
			city: user?.city || "",
			zip: user?.zip || "",
			country: user?.country || "",
		});
		setIsEditing(false);
	};

	const tabs = [
		{ id: "profile", label: "Profile", icon: User },
		{ id: "orders", label: "Orders", icon: Package },
		{ id: "wishlist", label: "Wishlist", icon: Heart },
	];

	const mockOrders = [
		{
			id: "ORD-001",
			date: "2024-01-20",
			status: "delivered",
			total: 149.97,
			items: ["Essential White Tee", "Black Minimalist Jacket"],
		},
		{
			id: "ORD-002",
			date: "2024-01-15",
			status: "shipped",
			total: 89.99,
			items: ["Classic White Sneakers"],
		},
	];

	const mockWishlist = [
		{
			id: "1",
			name: "Premium Denim Jacket",
			price: 199.99,
			image:
				"https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800",
		},
		{
			id: "2",
			name: "Minimalist Watch",
			price: 299.99,
			image:
				"https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800",
		},
	];

	return (
		<div className='container mx-auto px-6 py-12'>
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className='text-center mb-12'>
				<Typography variant='h1' className='mb-4'>
					My Account
				</Typography>
				<Typography variant='body' className='text-gray-600'>
					Manage your profile, orders, and preferences
				</Typography>
			</motion.div>

			{/* Tabs */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.2 }}
				className='flex justify-center mb-8'>
				<div className='flex space-x-1 bg-gray-100 rounded-lg p-1'>
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id as any)}
							className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
								activeTab === tab.id
									? "bg-white text-gray-900 shadow-sm"
									: "text-gray-600 hover:text-gray-900"
							}`}>
							<Icon icon={tab.icon} size={18} />
							<span>{tab.label}</span>
						</button>
					))}
				</div>
			</motion.div>

			{/* Tab Content */}
			<motion.div
				key={activeTab}
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.4 }}
				className='max-w-4xl mx-auto'>
				{/* Profile Tab */}
				{activeTab === "profile" && (
					<Card className='p-8'>
						<div className='flex items-center justify-between mb-6'>
							<Typography variant='h2'>Profile Information</Typography>
							{!isEditing ? (
								<Button
									onClick={() => setIsEditing(true)}
									variant='outline'
									size='sm'>
									<Icon icon={Edit3} size={16} className='mr-2' />
									Edit Profile
								</Button>
							) : (
								<div className='flex space-x-2'>
									<Button onClick={handleSave} size='sm'>
										<Icon icon={Save} size={16} className='mr-2' />
										Save
									</Button>
									<Button onClick={handleCancel} variant='outline' size='sm'>
										<Icon icon={X} size={16} className='mr-2' />
										Cancel
									</Button>
								</div>
							)}
						</div>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									Full Name
								</label>
								<Input
									value={formData.name}
									onChange={(e) => handleInputChange("name", e.target.value)}
									disabled={!isEditing}
									className='w-full'
								/>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									Email
								</label>
								<Input
									type='email'
									value={formData.email}
									onChange={(e) => handleInputChange("email", e.target.value)}
									disabled={!isEditing}
									className='w-full'
								/>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									Phone
								</label>
								<Input
									value={formData.phone}
									onChange={(e) => handleInputChange("phone", e.target.value)}
									disabled={!isEditing}
									className='w-full'
								/>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									Country
								</label>
								<Input
									value={formData.country}
									onChange={(e) => handleInputChange("country", e.target.value)}
									disabled={!isEditing}
									className='w-full'
								/>
							</div>

							<div className='md:col-span-2'>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									Address
								</label>
								<Input
									value={formData.address}
									onChange={(e) => handleInputChange("address", e.target.value)}
									disabled={!isEditing}
									className='w-full'
								/>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									City
								</label>
								<Input
									value={formData.city}
									onChange={(e) => handleInputChange("city", e.target.value)}
									disabled={!isEditing}
									className='w-full'
								/>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									ZIP Code
								</label>
								<Input
									value={formData.zip}
									onChange={(e) => handleInputChange("zip", e.target.value)}
									disabled={!isEditing}
									className='w-full'
								/>
							</div>
						</div>
					</Card>
				)}

				{/* Orders Tab */}
				{activeTab === "orders" && (
					<div className='space-y-6'>
						{mockOrders.map((order) => (
							<Card key={order.id} className='p-6'>
								<div className='flex items-center justify-between mb-4'>
									<div>
										<Typography variant='h4' className='mb-1'>
											Order {order.id}
										</Typography>
										<Typography variant='caption' className='text-gray-500'>
											{order.date}
										</Typography>
									</div>
									<div className='text-right'>
										<Typography variant='h4' className='text-green-600'>
											<span className='font-semibold'>
												EGP {order.total.toFixed(2)}
											</span>
										</Typography>
										<span
											className={`inline-block px-2 py-1 text-xs rounded-full ${
												order.status === "delivered"
													? "bg-green-100 text-green-800"
													: order.status === "shipped"
													? "bg-blue-100 text-blue-800"
													: "bg-gray-100 text-gray-800"
											}`}>
											{order.status.charAt(0).toUpperCase() +
												order.status.slice(1)}
										</span>
									</div>
								</div>
								<div className='space-y-2'>
									{order.items.map((item, index) => (
										<Typography
											key={index}
											variant='body'
											className='text-gray-600'>
											• {item}
										</Typography>
									))}
								</div>
							</Card>
						))}
					</div>
				)}

				{/* Wishlist Tab */}
				{activeTab === "wishlist" && (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{mockWishlist.map((item) => (
							<Card key={item.id} className='p-4'>
								<img
									src={item.image}
									alt={item.name}
									className='w-full h-48 object-cover rounded-lg mb-4'
								/>
								<Typography variant='h4' className='mb-2'>
									{item.name}
								</Typography>
								<Typography variant='h4' className='text-green-600 mb-4'>
									<span className='font-semibold'>
										EGP {item.price.toFixed(2)}
									</span>
								</Typography>
								<Button className='w-full'>Add to Cart</Button>
							</Card>
						))}
					</div>
				)}
			</motion.div>
		</div>
	);
};
