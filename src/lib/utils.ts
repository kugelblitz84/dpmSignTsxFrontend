import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs));
};

export const updateMetaDescription = (description: string): void => {
	let metaTag: HTMLMetaElement | null = document.querySelector(
		"meta[name='description']"
	);

	if (metaTag) {
		// Update the existing meta tag
		metaTag.setAttribute("content", description);
	} else {
		// Create a new meta tag if it doesn't exist
		metaTag = document.createElement("meta");
		metaTag.name = "description";
		metaTag.content = description;
		document.head.appendChild(metaTag);
	}
};

export const formatPrice = (amount: number): string => {
	return amount.toLocaleString("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
};

export const calculateSquareFeet = (
	width: number,
	height: number,
	unit: "feet" | "inches" = "feet"
): number => {
	let widthFeet = width;
	let heightFeet = height;

	if (unit === "inches") {
		widthFeet = width / 12;
		heightFeet = height / 12;
	}

	return parseFloat((widthFeet * heightFeet).toFixed(2));
};
