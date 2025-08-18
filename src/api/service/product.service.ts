import { apiBaseURL } from "@/lib/dotenv";
import { apiClient, ApiError } from "@/api";
import { AxiosError } from "axios";

class Product {
	private productBaseUrl: string;
	constructor() {
		this.productBaseUrl = `${apiBaseURL}/product`;
	}

	fetchProductById = async (productId: number) => {
		try {
			const response = await apiClient.get(
				`${this.productBaseUrl}/${productId}`
			);
			return response.data;
		} catch (err: unknown) {
			let fetchRequestError: ApiError;

			if (err instanceof AxiosError) {
				fetchRequestError = {
					name: err.name || "AxiosError",
					status:
						err.response?.data?.status ||
						err.response?.data?.status ||
						err.status,
					message:
						err.response?.data?.message ||
						err.response?.data?.error ||
						err.message,
					error: err,
				};
				throw fetchRequestError;
			} else {
				const e = err as Record<string, unknown>;
				const status =
					typeof e?.["status"] === "number" ? (e["status"] as number) : 500;
				const message =
					typeof e?.["message"] === "string"
						? (e["message"] as string)
						: "An unknown error occured.";
				throw {
					name: "Error",
					status,
					message,
					error: new Error(message),
				} as ApiError;
			}
		}
	};

	fetchAllProduct = async (searchTerm: string, page: number, limit: number) => {
		try {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
			});

			if (searchTerm.length > 0) {
				params.append("searchTerm", searchTerm);
			}

			const response = await apiClient.get(
				`${this.productBaseUrl}?${params.toString()}`
			);
			return response.data;
		} catch (err: unknown) {
			let fetchRequestError: ApiError;

			if (err instanceof AxiosError) {
				fetchRequestError = {
					name: err.name || "AxiosError",
					status:
						err.response?.data?.status ||
						err.response?.data?.status ||
						err.status,
					message:
						err.response?.data?.message ||
						err.response?.data?.error ||
						err.message,
					error: err,
				};
				throw fetchRequestError;
			} else {
				const e = err as Record<string, unknown>;
				const status =
					typeof e?.["status"] === "number" ? (e["status"] as number) : 500;
				const message =
					typeof e?.["message"] === "string"
						? (e["message"] as string)
						: "An unknown error occured.";
				throw {
					name: "Error",
					status,
					message,
					error: new Error(message),
				} as ApiError;
			}
		}
	};

	fetchRandomProducts = async (limit: number, excludeProductId?: number) => {
		try {
			const params = new URLSearchParams({
				limit: limit.toString(),
			});

			// Some backends may require excludeProductId explicitly; default to 0 when not provided
			params.append("excludeProductId", (excludeProductId ?? 0).toString());

			const response = await apiClient.get(
				`${this.productBaseUrl}/random?${params.toString()}`
			);
			return response.data;
		} catch (err: unknown) {
			let fetchRequestError: ApiError;

			if (err instanceof AxiosError) {
				fetchRequestError = {
					name: err.name || "AxiosError",
					status:
						err.response?.data?.status ||
						err.response?.data?.status ||
						err.status,
					message:
						err.response?.data?.message ||
						err.response?.data?.error ||
						err.message,
					error: err,
				};
				throw fetchRequestError;
			} else {
				const e = err as Record<string, unknown>;
				const status =
					typeof e?.["status"] === "number" ? (e["status"] as number) : 500;
				const message =
					typeof e?.["message"] === "string"
						? (e["message"] as string)
						: "An unknown error occured.";
				throw {
					name: "Error",
					status,
					message,
					error: new Error(message),
				} as ApiError;
			}
		}
	};

	// Returns one top-selling product per category.
	// Expected backend route: GET /product/best-selling-by-category?limit=<n>
	fetchBestSellingByCategory = async (limitPerCategory: number = 1) => {
		try {
			const params = new URLSearchParams({
				limit: String(limitPerCategory),
			});
			const response = await apiClient.get(
				`${this.productBaseUrl}/best-selling-by-category?${params.toString()}`
			);
			return response.data;
		} catch (err: unknown) {
			let fetchRequestError: ApiError;

			if (err instanceof AxiosError) {
				fetchRequestError = {
					name: err.name || "AxiosError",
					status:
						err.response?.data?.status ||
						err.response?.data?.status ||
						err.status,
					message:
						err.response?.data?.message ||
						err.response?.data?.error ||
						err.message,
					error: err,
				};
				throw fetchRequestError;
			} else {
				const e = err as Record<string, unknown>;
				const status =
					typeof e?.["status"] === "number" ? (e["status"] as number) : 500;
				const message =
					typeof e?.["message"] === "string"
						? (e["message"] as string)
						: "An unknown error occured.";
				throw {
					name: "Error",
					status,
					message,
					error: new Error(message),
				} as ApiError;
			}
		}
	};
}

export default Product;
