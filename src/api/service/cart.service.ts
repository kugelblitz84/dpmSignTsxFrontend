import { apiBaseURL } from "@/lib/dotenv";
import { apiClient, ApiError } from "@/api";
import { AxiosError } from "axios";

// Helper function to extract error message from API response
const extractErrorMessage = (err: any): string => {
	if (err instanceof AxiosError) {
		const responseData = err.response?.data;
		return (
			responseData?.message ||
			responseData?.error ||
			err.message ||
			"An error occurred"
		);
	}
	return err?.message || "An unknown error occurred";
};

// Helper function to create standardized API error
const createApiError = (err: any): ApiError => {
	if (err instanceof AxiosError) {
		const responseData = err.response?.data;
		return {
			name: err.name || "AxiosError",
			status: responseData?.status || err.response?.status || err.status,
			message: extractErrorMessage(err),
			error: err,
		};
	}
	return {
		name: "ApiError",
		status: err?.status || 500,
		message: extractErrorMessage(err),
		error: err,
	};
};

class Cart {
	private cartBaseUrl: string;
	private cartAddUrl: string;
	constructor() {
		this.cartBaseUrl = `${apiBaseURL}/cart`;
		this.cartAddUrl = `${apiBaseURL}/cart/add`;
	}

	addItemToCart = async (
		token: string,
		customerId: number,
		productId: number,
		productVariantId: number,
		quantity: number,
		size: number | null,
		widthInch: number | null,
		heightInch: number | null,
		price: number
	) => {
		try {
			const body = {
				customerId,
				productId,
				productVariantId,
				quantity,
				size,
				widthInch,
				heightInch,
				price,
			};
			const response = await apiClient.post(this.cartAddUrl, body, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			return response.data;
		} catch (err: any) {
			throw createApiError(err);
		}
	};

	deleteCartItem = async (token: string, cartItemId: number) => {
		try {
			const response = await apiClient.delete(
				`${this.cartBaseUrl}/${cartItemId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			return response.data;
		} catch (err: any) {
			throw createApiError(err);
		}
	};

	fetchAllCartItems = async (token: string, customerId: number) => {
		try {
			const response = await apiClient.get(
				`${this.cartBaseUrl}/${customerId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			return response.data;
		} catch (err: any) {
			throw createApiError(err);
		}
	};
}

export default Cart;
