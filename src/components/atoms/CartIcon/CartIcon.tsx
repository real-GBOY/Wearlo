/** @format */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, X, Trash2 } from "lucide-react";
import { useCart } from "../../../contexts/CartContext";
import { Button } from "../Button/Button";
import { Typography } from "../Typography/Typography";
import { Icon } from "../Icon/Icon";

export const CartIcon: React.FC = () => {
	const navigate = useNavigate();
	const { state, removeItem, updateQuantity } = useCart();
	const [isOpen, setIsOpen] = useState(false);
	const cartRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleQuantityChange = (productId: string, newQuantity: number) => {
		if (newQuantity >= 1) {
			updateQuantity(productId, newQuantity);
		}
	};

	const handleCheckout = () => {
		setIsOpen(false);
		navigate("/checkout");
	};

	const formatPrice = (price: number) => {
		return `EGP ${price.toFixed(2)}`;
	};

	return (
		<div className='relative' ref={cartRef}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className='relative p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-black'>
				<ShoppingCart size={20} />
				{state.itemCount > 0 && (
					<span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
						{state.itemCount > 99 ? "99+" : state.itemCount}
					</span>
				)}
			</button>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: -10, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -10, scale: 0.95 }}
						transition={{ duration: 0.2 }}
						className='absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50'>
						<div className='p-4 border-b border-gray-200'>
							<div className='flex items-center justify-between'>
								<Typography variant='h4'>Shopping Cart</Typography>
								<button
									onClick={() => setIsOpen(false)}
									className='p-1 rounded-full hover:bg-gray-100 transition-colors'>
									<X size={16} />
								</button>
							</div>
						</div>

						<div className='max-h-96 overflow-y-auto'>
							{state.items.length === 0 ? (
								<div className='p-8 text-center'>
									<ShoppingCart
										size={48}
										className='mx-auto mb-4 text-gray-400'
									/>
									<Typography variant='body' className='text-gray-500'>
										Your cart is empty
									</Typography>
								</div>
							) : (
								<div className='p-4 space-y-4'>
									{state.items.map((item) => (
										<div
											key={item.id}
											className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
											<img
												src={item.images[0]}
												alt={item.name}
												className='w-16 h-16 object-cover rounded-md'
											/>
											<div className='flex-1 min-w-0'>
												<Typography
													variant='body'
													className='font-medium truncate'>
													{item.name}
												</Typography>
												<Typography variant='caption' className='text-gray-500'>
													{formatPrice(item.price)}
												</Typography>
											</div>
											<div className='flex items-center space-x-2'>
												<div className='flex items-center border border-gray-300 rounded-md'>
													<button
														onClick={() =>
															handleQuantityChange(item.id, item.quantity - 1)
														}
														className='px-2 py-1 hover:bg-gray-100 transition-colors'>
														-
													</button>
													<span className='px-2 py-1 min-w-[2rem] text-center'>
														{item.quantity}
													</span>
													<button
														onClick={() =>
															handleQuantityChange(item.id, item.quantity + 1)
														}
														className='px-2 py-1 hover:bg-gray-1 transition-colors'>
														+
													</button>
												</div>
												<button
													onClick={() => removeItem(item.id)}
													className='p-1 text-red-500 hover:bg-red-50 rounded transition-colors'>
													<Trash2 size={16} />
												</button>
											</div>
										</div>
									))}
								</div>
							)}
						</div>

						{state.items.length > 0 && (
							<>
								<div className='p-4 border-t border-gray-200'>
									<div className='flex items-center justify-between mb-4'>
										<Typography variant='h4'>Total:</Typography>
										<Typography variant='h4'>
											{formatPrice(state.total)}
										</Typography>
									</div>
									<Button size='lg' className='w-full' onClick={handleCheckout}>
										Checkout
									</Button>
								</div>
							</>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
