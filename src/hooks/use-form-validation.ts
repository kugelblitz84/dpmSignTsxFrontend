import { useState } from "react";

export const useFormValidation = (schema: any) => {
	const [errors, setErrors] = useState<{ [key: string]: string }>({});

	const validateField = (name: string, value: string): boolean => {
		const { error } = schema.extract(name).validate(value);
		if (error) {
			setErrors((prevErrors) => ({
				...prevErrors,
				[name]: error.details[0].message,
			}));
			return false;
		} else {
			setErrors((prevErrors) => {
				const newErrors = { ...prevErrors };
				delete newErrors[name];
				delete newErrors.global;
				return newErrors;
			});
			return true;
		}
	};

	const validateForm = (data: any): boolean => {
		const { error } = schema.validate(data, { abortEarly: false });
		if (error) {
			const validationErrors: { [key: string]: string } = {};
			error.details.forEach((err: any) => {
				validationErrors[err.path[0]] = err.message;
			});
			setErrors(validationErrors);
			return false;
		} else {
			setErrors({});
			return true;
		}
	};

	return { errors, setErrors, validateField, validateForm };
};
