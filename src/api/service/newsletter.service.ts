import Joi from "joi";
import { apiBaseURL } from "@/lib/dotenv";
import { apiClient } from "@/api/";

class Newsletter {
	private schema: {
		email: Joi.StringSchema;
	};
	private subscribeUrl: string;
	public subscribeSchema: Joi.ObjectSchema;

	constructor() {
		this.schema = {
			email: Joi.string()
				.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
				.message("Invalid email address.")
				.required()
				.messages({
					"string.base": "Email must be a string.",
					"string.empty": "Email cannot be empty.",
					"any.required": "Email is required.",
				}),
		};

		this.subscribeUrl = `${apiBaseURL}/newsletter/subscribe`;
		this.subscribeSchema = Joi.object({
			email: this.schema.email,
		});
	}

	subscribe = async (email: string) => {
		try {
			const body = {
				email,
			};
			const response = await apiClient.post(this.subscribeUrl, body);
			return response.data;
		} catch (err: any) {
			console.log(err.response.data);
			throw new Error(err.response.data.message);
		}
	};
}

export default Newsletter;
