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
		const params = new URLSearchParams({
			limit: String(limitPerCategory),
		});

		// Primary (singular) endpoint
		const primaryUrl = `${this.productBaseUrl}/best-selling-by-category?${params.toString()}`;
		// Fallback (plural) endpoint in case backend uses /products pattern
		const pluralUrl = `${apiBaseURL}/products/best-selling-by-category?${params.toString()}`;

		const attempt = async (url: string) => {
			return apiClient.get(url).then((r) => r.data);
		};

		try {
			return await attempt(primaryUrl);
		} catch (err: unknown) {
			// If the backend responds with a validation complaining productId must be a number,
			// it's likely the route matched /product/:productId instead of the intended collection route.
			if (
				err instanceof AxiosError &&
				err.response?.status === 400 &&
				typeof err.response?.data?.message === "string" &&
				err.response.data.message.toLowerCase().includes("productid must be a number")
			) {
				try {
					return await attempt(pluralUrl);
				} catch (fallbackErr) {
					// Re-throw original error context if fallback also fails
					throw this._normalizeError(err);
				}
			}
			// Normal error path
			throw this._normalizeError(err);
		}
	};

	/** Normalize unknown/axios errors into ApiError */
	private _normalizeError(err: unknown): ApiError {
		if (err instanceof AxiosError) {
			return {
				name: err.name || "AxiosError",
				status:
					err.response?.data?.status ||
					err.response?.status ||
					err.status,
				message:
					err.response?.data?.message ||
					err.response?.data?.error ||
					err.message,
				error: err,
			};
		} else {
			const e = err as Record<string, unknown>;
			const status =
				typeof e?.["status"] === "number" ? (e["status"] as number) : 500;
			const message =
				typeof e?.["message"] === "string"
					? (e["message"] as string)
					: "An unknown error occured.";
			return {
				name: "Error",
				status,
				message,
				error: new Error(message),
			};
		}
	}
}

export default Product;
