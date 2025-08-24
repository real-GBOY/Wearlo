/** @format */

import React from "react";
import { Header, Footer } from "../../organisms";

interface PageTemplateProps {
	children: React.ReactNode;
}

export const PageTemplate: React.FC<PageTemplateProps> = ({ children }) => {
	return (
		<div className='min-h-screen bg-white transition-colors duration-300'>
			<Header />
			<main>{children}</main>
			<Footer />
		</div>
	);
};
