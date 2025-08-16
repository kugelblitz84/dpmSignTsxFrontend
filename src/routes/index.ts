interface Route {
	name: string;
	path: string;
	title: string;
	description: string;
}

interface NestedRoute extends Route {
	[key: string]: any; // Allow additional nested routes
}

export interface Routes {
	[key: string]: NestedRoute; // Allow any key with a NestedRoute value
}

const routes: Routes = {
	home: {
		name: "Home",
		path: "/",
		title:
			"Dhaka Plastic & Metal | Custom 3D Signage, Award Plaques & Corporate Branding Solutions",
		description:
			"Discover Dhaka Plastic & Metal - Bangladesh's trusted manufacturer of premium 3D signage, award plaques, and corporate branding products. Elevate your brand with custom designs, top-quality craftsmanship, and professional services. Contact us today for innovative solutions that leave lasting impressions.",
	},
	products: {
		name: "Our Products",
		path: "/products",
		title: "Products - Dhaka Plastic & Metal",
		description:
			"Explore our wide range of high-quality signage, awards, and personalized gifts.",
		product: {
			name: "Our Products",
			path: "/products/:slug",
			title: "Product Details - Dhaka Plastic & Metal",
			description:
				"Get detailed information about our premium products, customized for your needs.",
		},
	},
	about: {
		name: "About Us",
		path: "/about-us",
		title: "About Dhaka Plastic & Metal",
		description:
			"Learn about Dhaka Plastic & Metal, our values, and our commitment to quality craftsmanship.",
	},
	services: {
		name: "Services",
		path: "/services",
		title: "Services of Dhaka Plastic & Metal",
		description:
			"Discover the services we offer, including signage creation, awards, and personalized gifts.",
	},
	contact: {
		name: "Contact",
		path: "/contact",
		title: "Contact Dhaka Plastic & Metal",
		description:
			"Reach Dhaka Plastic & Metal through our Head Office, Branch, or Workshop for premium 3D signage, award plaques, and corporate gifts. Call us, send a message, or visit today!",
	},
	blogs: {
		name: "Blogs",
		path: "/blogs",
		title: "Blogs - Dhaka Plastic & Metal",
		description:
			"Read our latest articles and updates about signage, awards, and personalized gifts.",
		blog: {
			name: "Blogs",
			path: "/blogs/:blogId",
			title: "Blogs - Dhaka Plastic & Metal",
			description:
				"Read our latest articles and updates about signage, awards, and personalized gifts.",
		},
	},
	clients: {
		name: "Our Clients",
		path: "/our-clients",
		title: "Clients of Dhaka Plastic & Metal",
		description:
			"See some of the esteemed clients we have worked with and our successful projects.",
	},
	account: {
		name: "Customer Account",
		path: "/account",
		title: "Customer Account - Dhaka Plastic & Metal",
		description:
			"Access your Dhaka Plastic & Metal customer account for orders, details, and more.",
		resetPassword: {
			name: "Customer Account Reset Password",
			path: "/account/reset-password",
			title: "Customer Account Reset Password - Dhaka Plastic & Metal",
			description:
				"Reset your Dhaka Plastic & Metal customer account password securely.",
		},
		dashboard: {
			name: "Customer Dashboard",
			path: "/account/dashboard",
			title: "Customer Dashboard - Dhaka Plastic & Metal",
			description:
				"View your account dashboard, including orders and account details.",
		},
		orders: {
			name: "Customer Orders",
			path: "/account/orders",
			title: "Orders Dashboard - Dhaka Plastic & Metal",
			description:
				"Track your orders and view detailed order history in your account.",
		},
		accountDetails: {
			name: "Customer Account Details",
			path: "/account/details",
			title: "Customer Account Details - Dhaka Plastic & Metal",
			description:
				"Update and manage your personal and account details securely.",
		},
	},
	checkout: {
		name: "Checkout",
		path: "/checkout",
		title: "Checkout - Dhaka Plastic & Metal",
		description:
			"Finalize your purchase and place your order at Dhaka Plastic & Metal.",
	},
	returnPolicy: {
		name: "Return Policy",
		path: "/return-policy",
		title: "Our Return Policy - Dhaka Plastic & Metal",
		description:
			"Understand our return policy to ensure a hassle-free shopping experience.",
	},
	exchangePolicy: {
		name: "Exchange Policy",
		path: "/exchange-policy",
		title: "Our Exchange Policy - Dhaka Plastic & Metal",
		description:
			"Read about our exchange policy for quick and easy product exchanges.",
	},
	privacyPolicy: {
		name: "Privacy Policy",
		path: "/privacy-policy",
		title: "Our Privacy Policy - Dhaka Plastic & Metal",
		description:
			"Learn about how we protect your data and respect your privacy.",
	},
	termsNCondition: {
		name: "Terms And Condition",
		path: "/terms-and-condition",
		title: "Our Terms And Condition - Dhaka Plastic & Metal",
		description:
			"Review our terms and conditions for using our website and services.",
	},
	faq: {
		name: "FAQ",
		path: "/faq",
		title: "Frequently Asked Questions - Dhaka Plastic & Metal",
		description:
			"Find answers to common questions about our products, services, and policies.",
	},
	career: {
		name: "Career",
		path: "/career",
		title: "Your Career - Dhaka Plastic & Metal",
		description:
			"Explore career opportunities and join the Dhaka Plastic & Metal team.",
	},
	sitemap: {
		name: "Sitemap",
		path: "/sitemap",
		title: "Site Map - Dhaka Plastic & Metal",
		description:
			"Discover the structure and content of our website for easy navigation.",
	},
	partnerWithUs: {
		name: "Partner With Us",
		path: "/partner-with-us",
		title: "Partner With Us - Dhaka Plastic & Metal",
		description:
			"Partner with Dhaka Plastic & Metal to expand your business and reach new customers.",
	},
	successPayment: {
		name: "Payment Successfull",
		path: "/success-payment",
		title: "Payment Successfull - Dhaka Plastic & Metal",
		description:
			"Thank you for your order. Your payment has been processed successfully.",
	},
	failedPayment: {
		name: "Payment Failed",
		path: "/failed-payment",
		title: "Payment Failed - Dhaka Plastic & Metal",
		description:
			"Sorry, your payment has failed. Please try again or contact us for assistance.",
	},
	notFound: {
		name: "Not Found",
		path: "*",
		title: "Dhaka Plastic & Metal",
		description:
			"Page not found. Visit our homepage to explore our products and services.",
	},
};

export default routes;
