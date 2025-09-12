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

// Blob/File utilities to safely handle image previews and persistence
export const isBlobLike = (v: unknown): v is Blob =>
	typeof Blob !== "undefined" && v instanceof Blob;

export const safeCreateObjectURL = (v: unknown): string | null => {
	if (typeof window === "undefined" || !("URL" in window)) return null;
	if (isBlobLike(v)) {
		try {
			return URL.createObjectURL(v);
		} catch {
			return null;
		}
	}
	return null;
};

export const stripBlobs = <T>(input: T): T => {
	if (Array.isArray(input)) {
		return input.map((v) => (isBlobLike(v) ? undefined : stripBlobs(v))) as unknown as T;
	}
	if (input && typeof input === "object") {
		const out: Record<string, any> = {};
		for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
			out[k] = isBlobLike(v) ? undefined : stripBlobs(v as any);
		}
		return out as T;
	}
	return input;
};
