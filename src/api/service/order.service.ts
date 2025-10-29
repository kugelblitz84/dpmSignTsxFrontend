import Joi from "joi";
import { apiBaseURL } from "@/lib/dotenv";
import { apiClient, ApiError } from "@/api/";
import { AxiosError } from "axios";

type AxiosErrorData = {
	status?: number;
	message?: string;
	error?: string;
	details?: string;
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
	};
	private orderRequestCreateUrl: string;
	private fetchOrderByCustomerUrl: string;
	private fetchMyOrdersUrl: string;
	private downloadInvoiceUrl: string;
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
			staffId: Joi.number().optional().allow(null),
			courierId: Joi.number().required().allow(null).messages({
				"number.base": "Please select a courier service provider.",
				"any.required": "Courier service selection is required.",
			}),
			couponId: Joi.number().optional().allow(null),
		};

		this.orderRequestCreateUrl = `${apiBaseURL}/order/create-request`;
		this.fetchOrderByCustomerUrl = `${apiBaseURL}/order/customer`;
		this.fetchMyOrdersUrl = `${apiBaseURL}/order/my`;
		this.downloadInvoiceUrl = `${apiBaseURL}/order`;
		// Allow unknown fields so UI-only fields (e.g., paymentMethod) don't fail validation
		this.orderRequestCreateSchema = Joi.object(this.schema).unknown(true);
	}

	// Overloads (legacy + current)
	createOrderRequest(
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
		orderItems: {
			productId: number;
			productVariantId: number;
			quantity: number;
			size: number | null;
			widthInch: number | null;
			heightInch: number | null;
			// pricing breakdown fields (optional)
			unitPrice?: number | null;
			additionalPrice?: number | null;
			discountPercentage?: number | null;
			designCharge?: number | null;
			price: number;
		}[],
		extraFields?: Record<string, any>
	): Promise<any>;
	createOrderRequest(
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
		orderItems: {
			productId: number;
			productVariantId: number;
			quantity: number;
			size: number | null;
			widthInch: number | null;
			heightInch: number | null;
			// pricing breakdown fields (optional)
			unitPrice?: number | null;
			additionalPrice?: number | null;
			discountPercentage?: number | null;
			designCharge?: number | null;
			price: number;
		}[],
		extraFields?: Record<string, any>
	): Promise<any>;

	async createOrderRequest(
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
		arg13:
			| number
			| null
			| {
					productId: number;
					productVariantId: number;
					quantity: number;
					size: number | null;
					widthInch: number | null;
					heightInch: number | null;
					// pricing breakdown fields (optional)
					unitPrice?: number | null;
					additionalPrice?: number | null;
					discountPercentage?: number | null;
					designCharge?: number | null;
					price: number;
				}[],
		arg14?: {
			productId: number;
			productVariantId: number;
			quantity: number;
			size: number | null;
			widthInch: number | null;
			heightInch: number | null;
			// pricing breakdown fields (optional)
			unitPrice?: number | null;
			additionalPrice?: number | null;
			discountPercentage?: number | null;
			designCharge?: number | null;
			price: number;
		}[],
		extraFields?: Record<string, any>
	): Promise<any> {
		try {
			let couponId: number | null = null;
			let orderItems:
				| {
						productId: number;
						productVariantId: number;
						quantity: number;
						size: number | null;
						widthInch: number | null;
						heightInch: number | null;
						price: number;
					}[]
				| [] = [];

			if (Array.isArray(arg13)) {
				orderItems = arg13;
			} else {
				couponId = (arg13 as number | null) ?? null;
				orderItems = (arg14 as any[]) || [];
			}

			const form = new FormData();
			form.append("customerId", customerId.toString());
			form.append("customerName", name);
			form.append("customerPhone", phone);
			form.append("customerEmail", email);
			form.append("billingAddress", billingAddress);
			form.append("additionalNotes", additionalNotes);
			form.append("deliveryMethod", deliveryMethod);
			form.append("orderItems", JSON.stringify(orderItems));

			if (courierId !== null && courierId !== undefined) {
				form.append("courierId", courierId.toString());
			}
			if (courierAddress) {
				form.append("courierAddress", courierAddress);
			}
			if (staffId !== null && staffId !== undefined) {
				form.append("staffId", staffId.toString());
			}
			if (couponId !== null && couponId !== undefined) {
				form.append("couponId", couponId.toString());
			}

			if (designFiles.length > 0) {
				for (const file of designFiles) {
					form.append("designFiles", file, file.name);
				}
			}

			// Append any extra fields (e.g., method, paymentMethod) for backend intent tracking
			if (extraFields && typeof extraFields === "object") {
				Object.entries(extraFields).forEach(([key, val]) => {
					if (val === undefined || val === null) return;
					// If it's a non-file object/array, stringify to keep shape
					if (typeof val === "object") {
						form.append(key, JSON.stringify(val));
					} else {
						form.append(key, String(val));
					}
				});
			}

			const response = await apiClient.post(this.orderRequestCreateUrl, form, {
				headers: { Authorization: `Bearer ${token}` },
			});
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
	}

	// Start an online payment session for an order
	startOnlinePayment = async (
		token: string,
		payload: {
			orderId: number;
			amount: number;
			paymentMethod?: "online-payment";
			customerName: string;
			customerEmail: string;
			customerPhone: string;
		}
	) => {
		try {
			const body = {
				orderId: payload.orderId,
				amount: payload.amount,
				paymentMethod: payload.paymentMethod || "online-payment",
				customerName: payload.customerName,
				customerEmail: payload.customerEmail,
				customerPhone: payload.customerPhone,
			};

			const response = await apiClient.post(`${apiBaseURL}/order/add-payment`, body, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			return response.data;
		} catch (err: unknown) {
			let fetchRequestError: ApiError = {
				name: "Error",
				message: "Could not start online payment.",
				error: err as Error,
				status: undefined,
			};
			if (err instanceof AxiosError) {
				const data = (err.response?.data || {}) as AxiosErrorData;
				const msg = data.message || data.error || (err as any).message;
				fetchRequestError = {
					name: err.name || "AxiosError",
					status: data.status ?? (err as any).status,
					message: data.details ? `${msg}: ${data.details}` : msg,
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

	// New: Fetch the authenticated customer's orders using /order/my
	fetchMyOrders = async (token: string) => {
		try {
			const response = await apiClient.get(this.fetchMyOrdersUrl, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			// Normalize to keep .data.orders for callers
			const payload = response.data;
			const orders = payload?.data?.orders ?? payload?.data ?? payload?.orders ?? [];
			return { ...payload, data: { orders } };
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

	// Download generated invoice PDF from backend
		downloadInvoice = async (token: string, orderId: number): Promise<Blob> => {
		try {
			const response = await apiClient.get(
				`${this.downloadInvoiceUrl}/${orderId}/invoice`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						Accept: "application/pdf",
					},
					responseType: "blob",
				}
			);
			return response.data as Blob;
		} catch (err: unknown) {
			let fetchRequestError: ApiError = {
				name: "Error",
				message: "Could not download invoice.",
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
