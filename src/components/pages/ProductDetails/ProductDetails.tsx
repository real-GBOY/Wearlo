@@ .. @@
 import React from "react";
 import { useParams, useNavigate } from "react-router-dom";
 import { motion } from "framer-motion";
-import { ArrowLeft } from "lucide-react";
+import { ArrowLeft, ShoppingCart } from "lucide-react";
 import { products } from "../../../data/products";
@@ .. @@
 					<div className='space-y-4'>
-						<Button size='lg' className='w-full'>
-							ADD TO CART
+						<Button 
+							size='lg' 
+							className='w-full flex items-center justify-center space-x-2'
+							onClick={() => navigate('/payment', { 
+								state: { 
+									total: product.price, 
+									productName: product.name 
+								} 
+							})}
+						>
+							<Icon icon={ShoppingCart} size={20} />
+							<span>BUY NOW - ${product.price.toFixed(2)}</span>
 						</Button>