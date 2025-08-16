import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export const useIsMobile = (): boolean => {
	const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
		undefined
	);

	React.useEffect(() => {
		const mql = window.matchMedia(
			`(max-width: ${MOBILE_BREAKPOINT - 1}px)`
		);

		const onChange = () => {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		};

		// Add event listener for window resize
		mql.addEventListener("change", onChange);

		// Set initial value
		setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

		// Cleanup function to remove the event listener
		return () => {
			mql.removeEventListener("change", onChange);
		};
	}, []);

	// Return `false` if `isMobile` is undefined (initial state)
	return !!isMobile;
};
