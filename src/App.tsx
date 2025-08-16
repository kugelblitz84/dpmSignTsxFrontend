import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import "aos/dist/aos.css";
import "@mantine/core/styles.css";

import AOS from "aos";
import { MantineProvider } from "@mantine/core";
import { AuthProvider } from "@/hooks/use-auth";

import routes from "@/routes";
import Layout from "@/components/common/layout";
import AboutUs from "@/pages/about";
import Account from "@/pages/account/account";
import AccountDetails from "@/pages/account/account-details";
import Orders from "@/pages/account/orders";
import ResetPassword from "@/pages/account/reset-password";
import Welcome from "@/pages/account/welcome";
import Checkout from "@/pages/checkout";
import OurClients from "@/pages/clients";
import ContactUs from "@/pages/contact";
import ExchangePolicy from "@/pages/exchange-policy";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import PPolicy from "@/pages/privacy-policy";
import Products from "@/pages/products";
import Product from "@/pages/products/product";
import ReturnPolicy from "@/pages/return-policy";
import OurServices from "@/pages/services";
import TermsNCondition from "@/pages/terms-n-condition";
import Blogs from "@/pages/blogs";
import FAQ from "@/pages/faq";
import OurCareer from "@/pages/career";
import Blog from "@/pages/blogs/blog";
import Sitemap from "@/pages/sitemap";
import PartnerWithUs from "@/pages/partner-with-us/partner-with-us";
import ProtectedRoute from "@/components/common/protected-route";
import ProductProvider from "@/hooks/use-product";
import CategoryProvider from "@/hooks/use-category";
import BlogProvider from "@/hooks/use-blog";
import { CartProvider } from "@/hooks/use-cart";
import OrderProvider from "./hooks/use-order";
import SuccessPayment from "./pages/payments/Success";
import FailedPayment from "./pages/payments/Failed";

const App = () => {
	useEffect(() => {
		AOS.init({
			duration: 800, // Animation duration in milliseconds
			delay: 300, // Delay in milliseconds
			once: true, // Whether animation should happen only once
			easing: "ease-in-sine", // Easing function
		});
	}, []);

	return (
		<>
			<MantineProvider>
				<AuthProvider>
					<CartProvider>
						<Layout>
							<Routes>
								<Route path={routes.home.path} element={<Home />} />
								<Route
									path={routes.products.path}
									element={
										<ProductProvider>
											<CategoryProvider>
												<Products />
											</CategoryProvider>
										</ProductProvider>
									}
								/>
								<Route
									path={routes.products.product.path}
									element={
										<ProductProvider>
											<CategoryProvider>
												<Product />
											</CategoryProvider>
										</ProductProvider>
									}
								/>
								<Route path={routes.about.path} element={<AboutUs />} />
								<Route path={routes.services.path} element={<OurServices />} />
								<Route path={routes.contact.path} element={<ContactUs />} />
								<Route
									path={routes.blogs.path}
									element={
										<BlogProvider>
											<Blogs />
										</BlogProvider>
									}
								/>
								<Route
									path={routes.blogs.blog.path}
									element={
										<BlogProvider>
											<Blog />
										</BlogProvider>
									}
								/>
								<Route path={routes.clients.path} element={<OurClients />} />

								<Route
									path={routes.account.path}
									element={
										<ProtectedRoute
											isPublic
											redirectPath={routes.account.dashboard.path}
										>
											<Account />
										</ProtectedRoute>
									}
								/>

								<Route
									path={routes.account.resetPassword.path}
									element={
										<ProtectedRoute
											isPublic
											redirectPath={routes.account.dashboard.path}
										>
											<ResetPassword />
										</ProtectedRoute>
									}
								/>
								<Route
									path={routes.account.dashboard.path}
									element={
										<ProtectedRoute redirectPath={routes.account.path}>
											<Welcome />
										</ProtectedRoute>
									}
								/>
								<Route
									path={routes.account.orders.path}
									element={
										<ProtectedRoute redirectPath={routes.account.path}>
											<OrderProvider>
												<Orders />
											</OrderProvider>
										</ProtectedRoute>
									}
								/>

								<Route
									path={routes.account.accountDetails.path}
									element={
										<ProtectedRoute redirectPath={routes.account.path}>
											<AccountDetails />
										</ProtectedRoute>
									}
								/>
								<Route
									path={routes.checkout.path}
									element={
										<ProtectedRoute redirectPath={routes.home.path}>
											<Checkout />
										</ProtectedRoute>
									}
								/>
								<Route
									path={routes.returnPolicy.path}
									element={<ReturnPolicy />}
								/>
								<Route
									path={routes.exchangePolicy.path}
									element={<ExchangePolicy />}
								/>
								<Route path={routes.privacyPolicy.path} element={<PPolicy />} />
								<Route
									path={routes.termsNCondition.path}
									element={<TermsNCondition />}
								/>
								<Route path={routes.faq.path} element={<FAQ />} />
								<Route path={routes.career.path} element={<OurCareer />} />
								<Route path={routes.sitemap.path} element={<Sitemap />} />
								<Route
									path={routes.partnerWithUs.path}
									element={<PartnerWithUs />}
								/>

								<Route
									path={routes.successPayment.path}
									element={<SuccessPayment />}
								/>

								<Route
									path={routes.failedPayment.path}
									element={<FailedPayment />}
								/>

								<Route path={routes.notFound.path} element={<NotFound />} />
							</Routes>
						</Layout>
					</CartProvider>
				</AuthProvider>
			</MantineProvider>
		</>
	);
};

export default App;
