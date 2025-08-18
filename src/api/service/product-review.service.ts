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
		name: Joi.StringSchema;
		email: Joi.StringSchema;
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
				"any.required": "Product Id is required.",
			}),
			// customerId is optional to support guest reviews
			customerId: Joi.number().allow(null).optional().messages({
				"number.base": "Customer Id must be a number.",
			}),
			name: Joi.string().trim().min(2).required().messages({
				"string.base": "Name must be a string.",
				"string.empty": "Name cannot be empty.",
				"string.min": "Name must be at least 2 characters.",
				"any.required": "Name is required.",
			}),
			email: Joi.string()
				.email({ tlds: { allow: false } })
				.required()
				.messages({
					"string.email": "Email must be valid.",
					"string.empty": "Email cannot be empty.",
					"any.required": "Email is required.",
				}),
		};
		this.fetchReviewUrl = `${apiBaseURL}/product-review`;
		this.createReviewUrl = `${apiBaseURL}/product-review/create`;
		// Validation for creating a review from UI: always require
		// name, email, rating, description and productId
		this.reviewCreationSchema = Joi.object({
			name: this.schema.name,
			email: this.schema.email,
			rating: this.schema.rating,
			description: this.schema.description,
			productId: this.schema.productId,
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
		customerId: number | null,
		name: string,
		email: string
	) => {
		try {
			// Build request body conservatively. Include guest fields only when customerId is null
			// to minimize chances of backend validation errors.
			const body: Record<string, any> = {
				rating,
				description,
				productId,
				customerId,
			};

			if (!customerId && name && email) {
				body.name = name;
				body.email = email;
			}

			const headers: Record<string, string> = {};
			if (token && token.trim() !== "") {
				headers["Authorization"] = `Bearer ${token}`;
			}

			const response = await apiClient.post(this.createReviewUrl, body, {
				headers,
			});

			return response.data;
		} catch (err: any) {
			// For guests, try alternative field names if backend returns 400
			if (
				err instanceof AxiosError &&
				err.response?.status === 400 &&
				!customerId
			) {
				const headers: Record<string, string> = {};
				if (token && token.trim() !== "") {
					headers["Authorization"] = `Bearer ${token}`;
				}

				const base = {
					rating,
					description,
					productId,
					customerId: null,
				} as Record<string, unknown>;

				const attempts: Array<Record<string, unknown>> = [];
				// Attempt 1: minimal (no name/email)
				attempts.push({ ...base });
				// Attempt 2: guestName/guestEmail
				if (name && email)
					attempts.push({ ...base, guestName: name, guestEmail: email });
				// Attempt 3: reviewerName/reviewerEmail
				if (name && email)
					attempts.push({ ...base, reviewerName: name, reviewerEmail: email });
				// Attempt 4: customerName/customerEmail
				if (name && email)
					attempts.push({ ...base, customerName: name, customerEmail: email });

				for (const payload of attempts) {
					try {
						const resp = await apiClient.post(this.createReviewUrl, payload, {
							headers,
						});
						return resp.data;
					} catch (e: unknown) {
						if (!(e instanceof AxiosError) || e.response?.status !== 400) {
							let em = "Failed to submit review.";
							if (e && typeof e === "object") {
								const obj = e as Record<string, unknown>;
								if (obj && typeof obj === "object") {
									const msg = obj["message"];
									if (typeof msg === "string") em = msg;
								}
							}
							throw new Error(em);
						}
						// else continue trying next payload
					}
				}
			}

			const message =
				err?.response?.data?.message ||
				err?.response?.data?.error ||
				err?.message ||
				"Failed to submit review.";
			throw new Error(message);
		}
	};
}

export default ProductReview;
