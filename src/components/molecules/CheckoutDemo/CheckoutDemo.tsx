/** @format */

import React from "react";
import { CheckoutButton } from "../../atoms/CheckoutButton";

export const CheckoutDemo: React.FC = () => {
	const products = [
		{
			name: "Handmade Bracelet",
			price: 20,
			quantity: 1,
		},
		{
			name: "Premium Watch",
			price: 150,
			quantity: 1,
		},
		{
			name: "Designer Ring",
			price: 89,
			quantity: 2,
		},
	];

	return (
		<div className='max-w-4xl mx-auto p-6'>
			<h2 className='text-2xl font-bold text-gray-900 mb-6 text-center'>
				Stripe Checkout Demo
			</h2>

			<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
				{products.map((product, index) => (
					<div key={index} className='bg-white rounded-lg shadow-md p-6 border'>
						<h3 className='text-lg font-semibold text-gray-900 mb-2'>
							{product.name}
						</h3>
						<p className='text-gray-600 mb-4'>Quantity: {product.quantity}</p>
						<div className='text-2xl font-bold text-blue-600 mb-4'>
							${product.price}
						</div>

						<CheckoutButton product={product} className='w-full'>
							Buy Now - ${product.price}
						</CheckoutButton>
					</div>
				))}
			</div>

			<div className='mt-8 p-4 bg-blue-50 rounded-lg'>
				<h3 className='text-lg font-semibold text-blue-900 mb-2'>
					How to use the CheckoutButton:
				</h3>
				<pre className='bg-white p-4 rounded border overflow-x-auto text-sm'>
					{`<CheckoutButton 
  product={{ 
    name: "Handmade Bracelet", 
    price: 20, 
    quantity: 1 
  }} 
/>`}
				</pre>
			</div>
		</div>
	);
};
