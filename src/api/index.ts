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
		"Content-Type": "application/json",
	},
});

export const ping = async () => {
	try {
		console.log(apiBaseURL);
		const response = await apiClient.get("/health");
		console.log(response.data);
	} catch (err: any) {
		console.log(err.message);
	}
};
