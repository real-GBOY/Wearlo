/** @format */

import React from "react";
import { Hero } from "../../components/organisms/Hero/Hero";
import { FeaturedProducts } from "../../components/organisms/FeaturedProducts/FeaturedProducts";
import { CallToAction } from "../../components/organisms/CallToAction/CallToAction";

export const LandingScreen: React.FC = () => {
	return (
		<>
			<Hero />
			<FeaturedProducts />
			<CallToAction />
		</>
	);
};
