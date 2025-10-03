import axios from "axios";
import { apiBaseURL, apiKey } from "@/lib/dotenv";
import Customer from "@/api/service/customer.service";
import Newsletter from "@/api/service/newsletter.service";
import Inquery from "@/api/service/inquery.service";
import Product from "@/api/service/product.service";
import Category from "@/api/service/category.service";
import ProductReview from "@/api/service/product-review.service";
import Blog from "@/api/service/blog.service";
import Cart from "@/api/service/cart.service";
import Courier from "@/api/service/courier.service";
import Staff from "@/api/service/staff.service";
import Order from "@/api/service/order.service";
import Coupon from "@/api/service/coupon.service";
import Job from "@/api/service/job.service";

export const customerService = new Customer();
export const newsletterService = new Newsletter();
export const inqueryService = new Inquery();
export const productService = new Product();
export const categoryService = new Category();
export const productReviewService = new ProductReview();
export const cartService = new Cart();
export const blogService = new Blog();
export const courierService = new Courier();
export const staffService = new Staff();
export const orderService = new Order();
export const couponService = new Coupon();
export const jobService = new Job();

export interface ApiError extends Error {
	error: Error;
	message: string;
	status?: number;
}

export const apiClient = axios.create({
	baseURL: apiBaseURL,
	headers: {
		"X-API-Key": apiKey,
		// Do NOT set a global Content-Type. Let Axios infer it per-request
		// so FormData gets the correct multipart boundary automatically.
	},
});

// Global response interceptor to handle common errors
apiClient.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		// Check if it's an unauthorized error
		if (error.response?.status === 401) {
			// Clear localStorage and reload the page to reset auth state
			localStorage.removeItem("token");
			localStorage.removeItem("customer");
			// Create a custom error object with a specific message for 401 errors
			const authError: ApiError = {
				name: "UnauthorizedError",
				message: "Your session has expired. Please log in again to continue.",
				status: 401,
				error: error,
			};
			return Promise.reject(authError);
		}
		return Promise.reject(error);
	}
);

export const ping = async () => {
	try {
		console.log(apiBaseURL);
		const response = await apiClient.get("/health");
		console.log(response.data);
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : String(err);
		console.log(message);
	}
};
