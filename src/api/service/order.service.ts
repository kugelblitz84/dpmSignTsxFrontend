import Joi from "joi";
import { apiBaseURL } from "@/lib/dotenv";
import { apiClient, ApiError } from "@/api/";
import { AxiosError } from "axios";

type AxiosErrorData = {
	status?: number;
	message?: string;
	error?: string;
};

class Order {
	private schema: {
		name: Joi.StringSchema;
		email: Joi.StringSchema;
		phone: Joi.StringSchema;
		billingAddress: Joi.StringSchema;
		additionalNotes: Joi.StringSchema;
		designFiles: Joi.AnySchema;
		deliveryMethod: Joi.StringSchema;
		courierId: Joi.NumberSchema;
		courierAddress: Joi.StringSchema;
		staffId: Joi.NumberSchema;
		couponId: Joi.NumberSchema;
		// paymentMethod: Joi.StringSchema;
	};
	private orderRequestCreateUrl: string;
	private fetchOrderByCustomerUrl: string;
	public orderRequestCreateSchema: Joi.ObjectSchema;

	constructor() {
		this.schema = {
			name: Joi.string().trim().min(2).required().messages({
				"string.base": "Name must be a string.",
				"string.empty": "Name cannot be empty.",
				"string.min": "Name must be at least 2 characters long.",
				"any.required": "Name is required.",
			}),
			email: Joi.string()
				.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
				.message("Invalid email address.")
				.required()
				.messages({
					"string.base": "Email must be a string.",
					"string.empty": "Email cannot be empty.",
					"any.required": "Email is required.",
				}),
			phone: Joi.string()
				.trim()
				.required()
				.pattern(/^01[3-9][0-9]{8}$/)
				.messages({
					"string.pattern.base":
						"Phone number must be a valid Bangladeshi number starting with 01 and 11 digits long.",
					"string.empty": "Phone number cannot be empty.",
					"any.required": "Phone number is required.",
				}),
			deliveryMethod: Joi.string()
				.trim()
				.required()
				.valid("shop-pickup", "courier")
				.messages({
					"string.base": "Delivery method must be a string.",
					"string.empty": "Please select a delivery method.",
					"any.required":
						"Delivery method selection is required. Please choose either shop pickup or courier.",
				}) as Joi.StringSchema<"shop-pickup" | "courier">,
			designFiles: Joi.any(),
			billingAddress: Joi.string().trim().min(5).required().messages({
				"string.base": "Billing address must be a string.",
				"string.min": "Billing address must be at least 5 characters long.",
				"string.empty": "Billing address cannot be empty.",
				"any.required": "Billing address is required.",
			}),
			additionalNotes: Joi.string()
				.trim()
				.min(5)
				.optional()
				.allow("")
				.messages({
					"string.base": "Additional notes must be a string.",
					"string.min": "Additional notes must be at least 5 characters long.",
				}),
			courierAddress: Joi.string().trim().required().allow("").messages({
				"string.base": "Courier address must be a string.",
				"string.empty": "Courier address cannot be empty.",
				"any.required": "Courier address is required.",
			}),
			staffId: Joi.number().required().allow(null).messages({
				"number.base": "Staff id must be a number.",
				"any.required": "Staff id is required.",
			}),
			courierId: Joi.number().required().allow(null).messages({
				"number.base": "Please select a courier service provider.",
				"any.required": "Courier service selection is required.",
			}),
			couponId: Joi.number().optional().allow(null),
			// paymentMethod: Joi.string()
			// 	.trim()
			// 	.required()
			// 	.valid("online-payment", "cod-payment")
			// 	.messages({
			// 		"string.base": "Payment method must be a string.",
			// 		"string.empty": "Please select a payment method.",
			// 		"any.required":
			// 			"Payment method selection is required. Please choose either online payment or cash on delivery.",
			// 	}) as Joi.StringSchema<"online-payment" | "cod-payment">,
		};

		this.orderRequestCreateUrl = `${apiBaseURL}/order/create-request`;
		this.fetchOrderByCustomerUrl = `${apiBaseURL}/order/customer`;
		this.orderRequestCreateSchema = Joi.object(this.schema);
	}

	createOrderRequest = async (
		token: string,
		customerId: number,
		name: string,
		email: string,
		phone: string,
		billingAddress: string,
		additionalNotes: string,
		designFiles: File[] | [],
		deliveryMethod: string,
		courierId: number | null,
		courierAddress: string,
		staffId: number | null,
		couponId: number | null,
		// paymentMethod: string,
		orderItems: {
			productId: number;
			productVariantId: number;
			quantity: number;
			size: number | null;
			widthInch: number | null;
			heightInch: number | null;
			price: number;
		}[]
	) => {
		try {
			const form = new FormData();

			// Append text fields to the FormData object
			form.append("customerId", customerId.toString());
			form.append("customerName", name);
			form.append("customerPhone", phone);
			form.append("customerEmail", email);
			form.append("billingAddress", billingAddress);
			form.append("additionalNotes", additionalNotes);
			form.append("deliveryMethod", deliveryMethod);
			// form.append("paymentMethod", paymentMethod);
			form.append("orderItems", JSON.stringify(orderItems));

			// Append courierId even if it's 0; only skip when null/undefined
			if (courierId !== null && courierId !== undefined) {
				form.append("courierId", courierId.toString());
			}
			if (courierAddress) {
				form.append("courierAddress", courierAddress);
			}

			// Append staffId even if it's 0; only skip when null/undefined
			if (staffId !== null && staffId !== undefined) {
				form.append("staffId", staffId.toString());
			}

			// Append couponId even if it's 0; only skip when null/undefined
			if (couponId !== null && couponId !== undefined) {
				form.append("couponId", couponId.toString());
			}

			if (designFiles.length > 0) {
				for (const file of designFiles) {
					form.append("designFiles", file, file.name);
				}
			}

			// Optional: minimal debug snapshot (omit heavy FormData iteration)
			// console.debug("OrderService.createOrderRequest - payload:", {
			//   customerId,
			//   customerName: name,
			//   customerPhone: phone,
			//   billingAddress,
			//   additionalNotes,
			//   deliveryMethod,
			//   orderItems,
			//   courierId,
			//   courierAddress,
			//   staffId,
			//   couponId,
			//   designFiles: designFiles.map((f) => f.name),
			// });

			// Let axios/browser set the Content-Type (with correct boundary) for FormData
			const response = await apiClient.post(this.orderRequestCreateUrl, form, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			// (Previously printed FormData entries here — removed duplicate)
			return response.data;
		} catch (err: unknown) {
			let fetchRequestError: ApiError = {
				name: "Error",
				message: "An unknown error occured.",
				error: err as Error,
				status: undefined,
			};
			if (err instanceof AxiosError) {
				const data = (err.response?.data || {}) as AxiosErrorData;
				fetchRequestError = {
					name: err.name || "AxiosError",
					status: data.status ?? err.status,
					message: data.message || data.error || err.message,
					error: err,
				} as ApiError;
			}
			throw fetchRequestError;
		}
	};

	fetchAllOrdersByCustomer = async (token: string, customerId: number) => {
		try {
			const response = await apiClient.get(
				`${this.fetchOrderByCustomerUrl}/${customerId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			return response.data;
		} catch (err: unknown) {
			let fetchRequestError: ApiError = {
				name: "Error",
				message: "An unknown error occured.",
				error: err as Error,
				status: undefined,
			};
			if (err instanceof AxiosError) {
				const data = (err.response?.data || {}) as AxiosErrorData;
				fetchRequestError = {
					name: err.name || "AxiosError",
					status: data.status ?? err.status,
					message: data.message || data.error || err.message,
					error: err,
				} as ApiError;
			}
			throw fetchRequestError;
		}
	};
}

export default Order;
