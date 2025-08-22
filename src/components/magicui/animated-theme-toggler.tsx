/** @format */

import { Moon, SunDim } from "lucide-react";
import { useRef } from "react";
import { useTheme } from "../../contexts/ThemeContext";

// Simple utility function to avoid import issues
function cn(...classes: (string | undefined | null | false)[]) {
	return classes.filter(Boolean).join(" ");
}

type props = {
	className?: string;
};

export const AnimatedThemeToggler = ({ className }: props) => {
	const { theme, toggleTheme } = useTheme();
	const buttonRef = useRef<HTMLButtonElement | null>(null);

	const changeTheme = () => {
		if (!buttonRef.current) return;

		// Check if view transitions are supported and working properly
		if (
			document.startViewTransition &&
			typeof document.startViewTransition === "function"
		) {
			try {
				// Get button position before starting transition
				const { top, left, width, height } =
					buttonRef.current.getBoundingClientRect();
				const y = top + height / 2;
				const x = left + width / 2;

				// Calculate the maximum radius for the circle
				const right = window.innerWidth - left;
				const bottom = window.innerHeight - top;
				const maxRad = Math.hypot(Math.max(left, right), Math.max(top, bottom));

				// Start the view transition
				const transition = document.startViewTransition(() => {
					// Immediately toggle theme
					toggleTheme();
				});

				// Handle the transition animation
				if (transition && transition.ready) {
					transition.ready.then(() => {
						// Animate the new view with a circular clip-path
						document.documentElement.animate(
							{
								clipPath: [
									`circle(0px at ${x}px ${y}px)`,
									`circle(${maxRad}px at ${x}px ${y}px)`,
								],
							},
							{
								duration: 700,
								easing: "ease-in-out",
								pseudoElement: "::view-transition-new(root)",
							}
						);
					});
				}
			} catch (error) {
				// Fallback to regular theme toggle
				toggleTheme();
			}
		} else {
			// Fallback for browsers that don't support view transitions
			toggleTheme();
		}
	};

	return (
		<button
			ref={buttonRef}
			onClick={changeTheme}
			className={cn(className)}
			type='button'>
			{theme === "dark" ? <SunDim size={20} /> : <Moon size={20} />}
		</button>
	);
};
