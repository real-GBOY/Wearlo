/** @format */

import Permissions from "./permissions";

const Roles = [
	{
		key: "admin",
		Permissions: Object.values(Permissions),
	},
	{
		key: "manager",
		Permissions: [
			// User permissions
			Permissions.ViewOwnProfile,
			Permissions.EditOwnProfile,

			// Product permissions
			Permissions.CreateProduct,
			Permissions.EditProduct,
			Permissions.DeleteProduct,
			Permissions.ViewProduct,
			Permissions.ManageInventory,

			// Category permissions
			Permissions.CreateCategory,
			Permissions.EditCategory,
			Permissions.DeleteCategory,
			Permissions.ViewCategory,

			// Cart permissions
			Permissions.AddToCart,
			Permissions.RemoveFromCart,
			Permissions.UpdateCart,
			Permissions.ViewCart,

			// Order permissions
			Permissions.CreateOrder,
			Permissions.ViewOwnOrders,
			Permissions.ViewAllOrders,
			Permissions.EditOrder,

			// Review permissions
			Permissions.CreateReview,
			Permissions.EditReview,
			Permissions.DeleteReview,
			Permissions.ViewReview,
		],
	},
	{
		key: "user",
		Permissions: [
			// User permissions
			Permissions.ViewOwnProfile,
			Permissions.EditOwnProfile,
			Permissions.DeleteOwnAccount,

			// Product permissions
			Permissions.ViewProduct,

			// Category permissions
			Permissions.ViewCategory,

			// Cart permissions
			Permissions.AddToCart,
			Permissions.RemoveFromCart,
			Permissions.UpdateCart,
			Permissions.ViewCart,

			// Order permissions
			Permissions.CreateOrder,
			Permissions.ViewOwnOrders,

			// Review permissions
			Permissions.CreateReview,
			Permissions.EditReview,
			Permissions.DeleteReview,
			Permissions.ViewReview,
		],
	},
];

export default Roles;
