import Joi from "joi";
import { apiBaseURL } from "@/lib/dotenv";
import { apiClient, ApiError } from "@/api/";
import { AxiosError } from "axios";

class Customer {
	private schema: {
		name: Joi.StringSchema;
		email: Joi.StringSchema;
		password: Joi.StringSchema;
		phone: Joi.StringSchema;
		billingAddress: Joi.StringSchema;
		shippingAddress: Joi.StringSchema;
		token: Joi.StringSchema;
		otp: Joi.StringSchema;
	};
	private loginUrl: string;
	private updateProfileUrl: string;
	private registerUrl: string;
	private requestResetPasswordUrl: string;
	private verifyResetPasswordUrl: string;
	private resetPasswordUrl: string;
	public loginSchema: Joi.ObjectSchema;
	public registrationSchema: Joi.ObjectSchema;
	public resetPasswordSchema: Joi.ObjectSchema;
	public editDetailsSchema: Joi.ObjectSchema;

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
			password: Joi.string().trim().min(8).required().messages({
				"string.base": "Password must be a string.",
				"string.empty": "Password cannot be empty.",
				"string.min": "Password must be at least 8 characters long.",
				"any.required": "Password is required.",
			}),
			phone: Joi.string()
				.trim()
				.required()
				.pattern(/^01[3-9][0-9]{8}$/)
				.messages({
					"string.pattern.base":
						"Phone number must be a valid Bangladeshi number starting with 01 and 11 digits long.",
					"string.empty": "Phone number cannot be empty.",
				}),
			billingAddress: Joi.string().trim().min(5).allow("").required().messages({
				"string.base": "Billing address must be a string.",
				"string.min": "Billing address must be at least 5 characters long.",
				"any.required": "Billing address is required.",
			}),
			shippingAddress: Joi.string()
				.trim()
				.min(5)
				.allow("")
				.required()
				.messages({
					"string.base": "Shipping address must be a string.",
					"string.min": "Shipping address must be at least 5 characters long.",
					"any.required": "Shipping address is required.",
				}),
			token: Joi.string().trim().required().messages({
				"string.base": "Token must be a string",
				"string.empty": "Token cannot be empty.",
				"any.required": "Token is required",
			}),
			otp: Joi.string().trim().required().messages({
				"string.base": "OTP must be a string",
				"string.empty": "OTP cannot be empty.",
				"any.required": "OTP is required",
			}),
		};

		this.loginUrl = `${apiBaseURL}/customer/login`;
		this.updateProfileUrl = `${apiBaseURL}/customer/`;
		this.registerUrl = `${apiBaseURL}/customer/register`;
		this.requestResetPasswordUrl = `${apiBaseURL}/customer/reset-password-request`;
		this.verifyResetPasswordUrl = `${apiBaseURL}/customer/reset-password-verify`;
		this.resetPasswordUrl = `${apiBaseURL}/customer/reset-password`;

		this.loginSchema = Joi.object({
			email: this.schema.email,
			password: this.schema.password,
		});

		this.registrationSchema = Joi.object({
			name: this.schema.name,
			email: this.schema.email,
			phone: this.schema.phone,
			password: this.schema.password,
		});

		this.resetPasswordSchema = Joi.object({
			email: this.schema.email,
			otp: this.schema.otp,
			password: this.schema.password,
		});

		this.editDetailsSchema = Joi.object({
			name: this.schema.name,
			phone: this.schema.phone,
			currentPassword: this.schema.password,
			newPassword: Joi.string().trim().min(8).optional().allow("").messages({
				"string.base": "Password must be a string.",
				"string.min": "Password must be at least 8 characters long.",
			}),
			billingAddress: this.schema.billingAddress,
			shippingAddress: this.schema.shippingAddress,
		});
	}

	loginCustomer = async (email: string, password: string) => {
		try {
			const body = {
				email,
				password,
			};
			const response = await apiClient.post(this.loginUrl, body);
			return response.data;
		} catch (err: any) {
			console.log(err.response.data.message || err.response.data.error);
			throw new Error(err.response.data.message || err.response.data.error);
		}
	};

	registerCustomer = async (
		name: string,
		email: string,
		phone: string,
		password: string
	) => {
		try {
			const body = {
				name,
				email,
				phone,
				password,
			};
			const response = await apiClient.post(this.registerUrl, body);
			return response.data;
		} catch (err: any) {
			console.log(err.response.data.message || err.response.data.error);
			throw new Error(err.response.data.message || err.response.data.error);
		}
	};

	updateCustomerProfile = async (
		token: string,
		name: string,
		currentPassword: string,
		newPassword: string,
		phone: string,
		billingAddress: string,
		shippingAddress: string
	) => {
		try {
			const body = {
				name,
				currentPassword,
				newPassword,
				phone,
				billingAddress,
				shippingAddress,
			};

			const response = await apiClient.put(this.updateProfileUrl, body, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			return response.data;
		} catch (err: any) {
			let updateProfileError: ApiError;

			if (err instanceof AxiosError) {
				updateProfileError = {
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
				throw updateProfileError;
			} else {
				updateProfileError = err.response.data || err.response.data.error;
				updateProfileError.status = err.response.data.status;
				updateProfileError.message =
					updateProfileError.message ||
					updateProfileError.error.message ||
					"An unknown error occured.";
				throw updateProfileError;
			}
		}
	};

	requestResetPassword = async (email: string) => {
		try {
			const body = {
				email,
			};
			const response = await apiClient.post(this.requestResetPasswordUrl, body);
			return response.data;
		} catch (err: any) {
			console.log(err.response.data.message || err.response.data.error);
			throw new Error(err.response.data.message || err.response.data.error);
		}
	};

	verifyResetPassword = async (email: string, otp: string) => {
		try {
			const body = {
				email,
				otp,
			};
			const response = await apiClient.post(this.verifyResetPasswordUrl, body);
			return response.data;
		} catch (err: any) {
			console.log(err.response.data.message || err.response.data.error);
			throw new Error(err.response.data.message || err.response.data.error);
		}
	};

	resetPassword = async (email: string, password: string) => {
		try {
			const body = {
				email,
				password,
			};
			const response = await apiClient.post(this.resetPasswordUrl, body);
			return response.data;
		} catch (err: any) {
			console.log(err.response.data.message || err.response.data.error);
			throw new Error(err.response.data.message || err.response.data.error);
		}
	};
}

export default Customer;
