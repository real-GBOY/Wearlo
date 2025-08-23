/** @format */

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { Product } from "../types";

interface WishlistState {
	items: Product[];
}

type WishlistAction =
	| { type: "ADD_ITEM"; payload: Product }
	| { type: "REMOVE_ITEM"; payload: string }
	| { type: "CLEAR_WISHLIST" }
	| { type: "LOAD_WISHLIST"; payload: Product[] };

const initialState: WishlistState = {
	items: [],
};

const wishlistReducer = (
	state: WishlistState,
	action: WishlistAction
): WishlistState => {
	switch (action.type) {
		case "ADD_ITEM": {
			const existingItem = state.items.find(
				(item) => item.id === action.payload.id
			);
			if (existingItem) {
				return state; // Item already exists
			}
			return { ...state, items: [...state.items, action.payload] };
		}

		case "REMOVE_ITEM": {
			return {
				...state,
				items: state.items.filter((item) => item.id !== action.payload),
			};
		}

		case "CLEAR_WISHLIST":
			return initialState;

		case "LOAD_WISHLIST":
			return { ...state, items: action.payload };

		default:
			return state;
	}
};

interface WishlistContextType {
	state: WishlistState;
	addItem: (product: Product) => void;
	removeItem: (productId: string) => void;
	clearWishlist: () => void;
	isInWishlist: (productId: string) => boolean;
	toggleItem: (product: Product) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
	undefined
);

export const useWishlist = () => {
	const context = useContext(WishlistContext);
	if (!context) {
		throw new Error("useWishlist must be used within a WishlistProvider");
	}
	return context;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [state, dispatch] = useReducer(wishlistReducer, initialState);

	// Load wishlist from localStorage on mount
	useEffect(() => {
		const savedWishlist = localStorage.getItem("wearlo-wishlist");
		if (savedWishlist) {
			try {
				const wishlistItems = JSON.parse(savedWishlist);
				dispatch({ type: "LOAD_WISHLIST", payload: wishlistItems });
			} catch (error) {
				console.error("Error loading wishlist from localStorage:", error);
			}
		}
	}, []);

	// Save wishlist to localStorage whenever it changes
	useEffect(() => {
		localStorage.setItem("wearlo-wishlist", JSON.stringify(state.items));
	}, [state.items]);

	const addItem = (product: Product) => {
		dispatch({ type: "ADD_ITEM", payload: product });
	};

	const removeItem = (productId: string) => {
		dispatch({ type: "REMOVE_ITEM", payload: productId });
	};

	const clearWishlist = () => {
		dispatch({ type: "CLEAR_WISHLIST" });
	};

	const isInWishlist = (productId: string): boolean => {
		return state.items.some((item) => item.id === productId);
	};

	const toggleItem = (product: Product) => {
		if (isInWishlist(product.id)) {
			removeItem(product.id);
		} else {
			addItem(product);
		}
	};

	return (
		<WishlistContext.Provider
			value={{
				state,
				addItem,
				removeItem,
				clearWishlist,
				isInWishlist,
				toggleItem,
			}}>
			{children}
		</WishlistContext.Provider>
	);
};
