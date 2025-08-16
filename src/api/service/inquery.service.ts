import Joi from "joi";
import { apiBaseURL } from "@/lib/dotenv";
import { apiClient } from "@/api/";

class Inquery {
	private schema: {
		name: Joi.StringSchema;
		email: Joi.StringSchema;
		phone: Joi.StringSchema;
		company: Joi.StringSchema;
		inqueryType: Joi.StringSchema;
		designFiles: Joi.AnySchema;
		message: Joi.StringSchema;
	};
	private createInqueryUrl: string;
	public inquerySchema: Joi.ObjectSchema;

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
			company: Joi.string()
				.trim()
				.allow("")
				.optional()
				.default("")
				.min(3)
				.messages({
					"string.base": "Company name must be a string.",
					"string.min":
						"Company name must be at least 3 characters long.",
				}),
			inqueryType: Joi.string()
				.trim()
				.required()
				.valid(
					"product-information",
					"pricing",
					"customization-options",
					"others"
				)
				.messages({
					"string.base": "Inquery type must be a string.",
					"string.empty": "Please select a inquery type.",
					"any.required":
						"Inquery type is required. It should be one of 'product-information', 'pricing', 'customization-options', 'others'",
				}) as Joi.StringSchema<
				| "product-information"
				| "pricing"
				| "customization-options"
				| "others"
			>,
			designFiles: Joi.any(),
			message: Joi.string().trim().min(5).required().messages({
				"string.base": "Message must be a string.",
				"string.min": "Message must be at least 5 characters long.",
				"string.empty": "Message cannot be empty.",
				"any.required": "Message is required.",
			}),
		};

		this.createInqueryUrl = `${apiBaseURL}/inquery/create-inquery`;
		this.inquerySchema = Joi.object({
			name: this.schema.name,
			email: this.schema.email,
			phone: this.schema.phone,
			company: this.schema.company,
			inqueryType: this.schema.inqueryType,
			designFiles: this.schema.designFiles,
			message: this.schema.message,
		});
	}

	createInquery = async (
		name: string,
		email: string,
		phone: string,
		company: string,
		inqueryType: string,
		designFiles: File[] | [],
		message: string
	) => {
		try {
			const form = new FormData();
			// Append text fields to the FormData object
			form.append("name", name);
			form.append("email", email);
			form.append("phone", phone);
			form.append("company", company);
			form.append("inqueryType", inqueryType);
			form.append("message", message);

			if (designFiles.length > 0) {
				for (const file of designFiles) {
					form.append("designFiles", file, file.name);
				}
			}

			const response = await apiClient.post(this.createInqueryUrl, form, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return response.data;
		} catch (err: any) {
			console.log(err.response.data);
			throw new Error(err.response.data.message);
		}
	};
}

export default Inquery;
