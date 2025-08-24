/** @format */

import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

// Stripe publishable key (test mode)
const stripePromise = loadStripe(
	"pk_test_51RzjQfJ1OADMOJPDCfIwyHYZRGdzcjp4WKnlhE2Yu6z8GHbBt0w6ru3KhHrMd6T5Pnbsc2fPi2pxZQO8eHvD7E3100hab2AOt2"
);

interface Product {
	name: string;
	price: number;
	quantity: number;
}

interface CheckoutButtonProps {
	product: Product;
	className?: string;
	children?: React.ReactNode;
}

export const CheckoutButton: React.FC<CheckoutButtonProps> = ({
	product,
	className = "",
	children,
}) => {
	const [isLoading, setIsLoading] = useState(false);

	const handleCheckout = async () => {
		try {
			setIsLoading(true);

			// Call backend API to create checkout session
			const response = await fetch(
				"http://localhost:5000/api/payment/create-checkout-session",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						name: product.name,
						price: product.price,
						quantity: product.quantity,
					}),
				}
			);

			if (!response.ok) {
				throw new Error("Failed to create checkout session");
			}

			const { sessionId } = await response.json();

			// Load Stripe and redirect to checkout
			const stripe = await stripePromise;
			if (stripe) {
				const { error } = await stripe.redirectToCheckout({
					sessionId,
				});

				if (error) {
					console.error("Stripe checkout error:", error);
					alert("Checkout failed. Please try again.");
				}
			}
		} catch (error) {
			console.error("Checkout error:", error);
			alert("Something went wrong. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<button
			onClick={handleCheckout}
			disabled={isLoading}
			className={`px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200 ${className}`}>
			{isLoading ? "Processing..." : children || `Pay $${product.price}`}
		</button>
	);
};
