import { apiBaseURL } from "@/lib/dotenv";
import { apiClient, ApiError } from "@/api";
import Joi from "joi";
import { AxiosError } from "axios";

class ProductReview {
	private schema: {
		rating: Joi.NumberSchema;
		description: Joi.StringSchema;
		productId: Joi.NumberSchema;
		customerId: Joi.NumberSchema;
	};
	public reviewCreationSchema: Joi.ObjectSchema;

	private fetchReviewUrl: string;
	private createReviewUrl: string;
	constructor() {
		this.schema = {
			rating: Joi.number().required().min(1).max(5).messages({
				"number.base": "Rating must be a number.",
				"number.empty": "Rating cannot be empty.",
				"number.min": "Rating should be between 1 to 5.",
				"number.max": "Rating should be between 1 to 5.",
				"any.required": "Rating is required.",
			}),
			description: Joi.string().trim().min(5).required().messages({
				"string.base": "Description must be a string.",
				"string.empty": "Description cannot be empty.",
				"any.required": "Description is required.",
				"string.min": "Description must be atleast 5 characters long.",
			}),
			productId: Joi.number().required().messages({
				"number.base": "Product Id must be a number.",
				"number.empty": "Product Id cannot be empty.",
			}),
			customerId: Joi.number().required().messages({
				"number.base": "Customer Id must be a number.",
				"number.empty": "Customer Id cannot be empty.",
			}),
		};
		this.fetchReviewUrl = `${apiBaseURL}/product-review`;
		this.createReviewUrl = `${apiBaseURL}/product-review/create`;
		this.reviewCreationSchema = Joi.object({
  name: Joi.string().trim().min(2).required().messages({
    "string.base": "Name must be a string.",
    "string.empty": "Name cannot be empty.",
    "string.min": "Name must be at least 2 characters.",
    "any.required": "Name is required.",
  }),
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    "string.email": "Email must be valid.",
    "string.empty": "Email cannot be empty.",
    "any.required": "Email is required.",
  }),
  rating: this.schema.rating,
  description: this.schema.description,
});

	}

	fetchAllReview = async (
		authToken: string,
		searchTerm: string,
		searchBy: "customer-name" | "product-name",
		page: number,
		limit: number
	) => {
		try {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
			});

			if (searchTerm.length > 0) {
				params.append("searchTerm", searchTerm);
				params.append("searchBy", searchBy);
			}

			const response = await apiClient.get(
				`${this.fetchReviewUrl}/?${params.toString()}`,
				{
					headers: {
						Authorization: `Bearer ${authToken}`,
					},
				}
			);
			return response.data;
		} catch (err: any) {
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
				fetchRequestError = err.response.data || err.response.data.error;
				fetchRequestError.status = err.response.data.status;
				fetchRequestError.message =
					fetchRequestError.message ||
					fetchRequestError.error.message ||
					"An unknown error occured.";
				throw fetchRequestError;
			}
		}
	};

	createReview = async (
		token: string,
		rating: number,
		description: string,
		productId: number,
		customerId: number | null
	) => {
		try {
			const body = {
				rating,
				description,
				productId,
				customerId,
			};

			const headers: Record<string, string> = {};
if (token && token.trim() !== "") {
  headers["Authorization"] = `Bearer ${token}`;
}

const response = await apiClient.post(this.createReviewUrl, body, {
  headers,
});

			return response.data;
		} catch (err: any) {
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
				fetchRequestError = err.response.data || err.response.data.error;
				fetchRequestError.status = err.response.data.status;
				fetchRequestError.message =
					fetchRequestError.message ||
					fetchRequestError.error.message ||
					"An unknown error occured.";
				throw fetchRequestError;
			}
		}
	};
}

export default ProductReview;
