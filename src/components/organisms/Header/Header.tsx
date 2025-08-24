/** @format */

import React from "react";
import { Navigation } from "../../molecules/Navigation/Navigation";

export const Header: React.FC = () => {
	return (
		<header className='sticky top-0 z-50 bg-white border-b border-gray-200 transition-colors'>
			<div className='container mx-auto px-6 py-4'>
				<Navigation />
			</div>
		</header>
	);
};
