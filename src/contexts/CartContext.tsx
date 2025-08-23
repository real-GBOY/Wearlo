/** @format */

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { CartItem, Product } from "../types";

interface CartState {
	items: CartItem[];
	total: number;
	itemCount: number;
}

type CartAction =
	| { type: "ADD_ITEM"; payload: { product: Product; quantity: number } }
	| { type: "REMOVE_ITEM"; payload: string }
	| {
			type: "UPDATE_QUANTITY";
			payload: { productId: string; quantity: number };
	  }
	| { type: "CLEAR_CART" }
	| { type: "LOAD_CART"; payload: CartItem[] };

const initialState: CartState = {
	items: [],
	total: 0,
	itemCount: 0,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
	switch (action.type) {
		case "ADD_ITEM": {
			const { product, quantity } = action.payload;
			const existingItem = state.items.find((item) => item.id === product.id);

			if (existingItem) {
				const updatedItems = state.items.map((item) =>
					item.id === product.id
						? { ...item, quantity: item.quantity + quantity }
						: item
				);
				return calculateCartTotals(updatedItems);
			} else {
				const newItem: CartItem = { ...product, quantity };
				const updatedItems = [...state.items, newItem];
				return calculateCartTotals(updatedItems);
			}
		}

		case "REMOVE_ITEM": {
			const updatedItems = state.items.filter(
				(item) => item.id !== action.payload
			);
			return calculateCartTotals(updatedItems);
		}

		case "UPDATE_QUANTITY": {
			const { productId, quantity } = action.payload;
			if (quantity <= 0) {
				const updatedItems = state.items.filter(
					(item) => item.id !== productId
				);
				return calculateCartTotals(updatedItems);
			}

			const updatedItems = state.items.map((item) =>
				item.id === productId ? { ...item, quantity } : item
			);
			return calculateCartTotals(updatedItems);
		}

		case "CLEAR_CART":
			return initialState;

		case "LOAD_CART":
			return calculateCartTotals(action.payload);

		default:
			return state;
	}
};

const calculateCartTotals = (items: CartItem[]): CartState => {
	const total = items.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	);
	const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

	return { items, total, itemCount };
};

interface CartContextType {
	state: CartState;
	addItem: (product: Product, quantity: number) => void;
	removeItem: (productId: string) => void;
	updateQuantity: (productId: string, quantity: number) => void;
	clearCart: () => void;
	isInCart: (productId: string) => boolean;
	getItemQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [state, dispatch] = useReducer(cartReducer, initialState);

	// Load cart from localStorage on mount
	useEffect(() => {
		const savedCart = localStorage.getItem("wearlo-cart");
		if (savedCart) {
			try {
				const cartItems = JSON.parse(savedCart);
				dispatch({ type: "LOAD_CART", payload: cartItems });
			} catch (error) {
				console.error("Error loading cart from localStorage:", error);
			}
		}
	}, []);

	// Save cart to localStorage whenever it changes
	useEffect(() => {
		localStorage.setItem("wearlo-cart", JSON.stringify(state.items));
	}, [state.items]);

	const addItem = (product: Product, quantity: number) => {
		dispatch({ type: "ADD_ITEM", payload: { product, quantity } });
	};

	const removeItem = (productId: string) => {
		dispatch({ type: "REMOVE_ITEM", payload: productId });
	};

	const updateQuantity = (productId: string, quantity: number) => {
		dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
	};

	const clearCart = () => {
		dispatch({ type: "CLEAR_CART" });
	};

	const isInCart = (productId: string): boolean => {
		return state.items.some((item) => item.id === productId);
	};

	const getItemQuantity = (productId: string): number => {
		const item = state.items.find((item) => item.id === productId);
		return item ? item.quantity : 0;
	};

	return (
		<CartContext.Provider
			value={{
				state,
				addItem,
				removeItem,
				updateQuantity,
				clearCart,
				isInCart,
				getItemQuantity,
			}}>
			{children}
		</CartContext.Provider>
	);
};
