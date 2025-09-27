import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { customerService, cartService } from "@/api";
import axios from "axios";
import { useFormValidation } from "@/hooks/use-form-validation";
import { LoadingOverlay } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import routes from "@/routes";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
	email: string;
	password: string;
}

interface RegistrationFormProps {
	name: string;
	email: string;
	phone: string;
	password: string;
}

type DefaultTab = "login" | "registration";

interface LoginRegistrationFormPropsExtra {
	defaultTab?: DefaultTab;
	initialLoginEmail?: string;
	initialRegistration?: Partial<RegistrationFormProps>;
	onSuccess?: () => void; // called after successful auth
	// New: combined actions for checkout
	showOrderActionButtons?: boolean;
	onLoginAndOrder?: () => Promise<void> | void;
	onRegisterAndOrder?: () => Promise<void> | void;
}

export const LoginRegistrationForm = ({
	defaultTab = "login",
	initialLoginEmail = "",
	initialRegistration,
	showOrderActionButtons = false,
	onLoginAndOrder,
	onRegisterAndOrder,
	onSuccess,
}: LoginRegistrationFormPropsExtra) => {
	const { toast } = useToast();

	const { login } = useAuth();
	const { fetchCartItems } = useCart();
	const [loading, setLoading] = useDisclosure(false);

	const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);
	const [showRegisterPassword, setShowRegisterPassword] =
		useState<boolean>(false);

	const {
		errors: loginFormErrors,
		setErrors: setLoginFormErrors,
		validateField: validateLoginField,
		validateForm: validateLoginForm,
	} = useFormValidation(customerService.loginSchema);

	const {
		errors: registrationFormErrors,
		setErrors: setRegistrationFormErrors,
		validateField: validateRegistrationField,
		validateForm: validateRegistrationForm,
	} = useFormValidation(customerService.registrationSchema);

	const [loginFormData, setLoginFormData] = useState<LoginFormProps>({
		email: initialLoginEmail || "",
		password: "",
	});
	const [registrationFormData, setRegistrationFormData] =
		useState<RegistrationFormProps>({
			name: initialRegistration?.name || "",
			email: initialRegistration?.email || "",
			phone: initialRegistration?.phone || "",
			password: "",
		});
	const [tabValue, setTabValue] = useState<DefaultTab>(defaultTab);

	// Keep form and tab in sync with incoming props from modal openers
	// Update tab when defaultTab changes
	// Update forms when initial prefill values change
	// This prevents stale tab/content (e.g., stuck on Login)
	useEffect(() => {
		setTabValue(defaultTab);
	}, [defaultTab]);

	useEffect(() => {
		setLoginFormData((prev) => ({ ...prev, email: initialLoginEmail || "" }));
	}, [initialLoginEmail]);

	useEffect(() => {
		setRegistrationFormData((prev) => ({
			...prev,
			name: initialRegistration?.name || "",
			email: initialRegistration?.email || "",
			phone: initialRegistration?.phone || "",
		}));
	}, [
		initialRegistration?.name,
		initialRegistration?.email,
		initialRegistration?.phone,
	]);

	const handleLoginFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setLoginFormData({
			...loginFormData,
			[name]: value,
		});
		validateLoginField(name, value);
		setLoginFormErrors((prevErrors) => ({
			...prevErrors,
			global: "",
		}));
	};

	const handleRegistrationFormData = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const { name, value } = e.target;
		setRegistrationFormData({
			...registrationFormData,
			[name]: value,
		});
		validateRegistrationField(name, value);
		setRegistrationFormErrors((prevErrors) => ({
			...prevErrors,
			global: "",
		}));
	};

	// Function to merge guest cart with authenticated user's cart
	const mergeGuestCartAndRefresh = async () => {
		try {
			console.log("LoginRegistrationForm: Starting cart merge process...");
			
			// Get fresh auth data from localStorage (since login() stores it there immediately)
			const freshToken = localStorage.getItem("token");
			const freshCustomerData = localStorage.getItem("customer");
			const freshCustomer = freshCustomerData ? JSON.parse(freshCustomerData) : null;
			
			console.log("LoginRegistrationForm: Fresh auth data from localStorage:", { 
				freshToken: !!freshToken, 
				freshCustomer: !!freshCustomer 
			});
			
			// Get the guest cart from localStorage
			const guestCartData = localStorage.getItem("guestCart");
			console.log("LoginRegistrationForm: Guest cart data:", guestCartData);
			
			if (!guestCartData || !freshToken || !freshCustomer) {
				console.log("LoginRegistrationForm: Missing data, skipping merge:", { 
					guestCartData: !!guestCartData, 
					freshToken: !!freshToken, 
					freshCustomer: !!freshCustomer 
				});
				return;
			}

			const guestCart = JSON.parse(guestCartData);
			console.log("LoginRegistrationForm: Parsed guest cart:", guestCart);
			
			if (!Array.isArray(guestCart) || guestCart.length === 0) {
				console.log("LoginRegistrationForm: Guest cart is empty or invalid");
				return;
			}

			console.log(`LoginRegistrationForm: Merging ${guestCart.length} items to server cart...`);

			// Add each guest cart item to the server cart
			for (let i = 0; i < guestCart.length; i++) {
				const item = guestCart[i];
				console.log(`LoginRegistrationForm: Adding item ${i + 1}/${guestCart.length}:`, item);
				
				try {
					const result = await cartService.addItemToCart(
						freshToken,
						freshCustomer.customerId,
						item.productId,
						item.productVariantId,
						item.quantity,
						item.size,
						item.widthInch,
						item.heightInch,
						item.price
					);
					console.log(`LoginRegistrationForm: Successfully added item ${i + 1}:`, result);
				} catch (error) {
					console.error(`LoginRegistrationForm: Failed to add guest cart item ${i + 1} to server cart:`, error);
					// Continue with other items even if one fails
				}
			}

			console.log("LoginRegistrationForm: Clearing guest cart from localStorage...");
			// Clear the guest cart from localStorage
			localStorage.removeItem("guestCart");

			console.log("LoginRegistrationForm: Refreshing cart items...");
			// Refresh the cart items to show the merged cart
			await fetchCartItems();

			console.log("LoginRegistrationForm: Cart merge completed successfully");
			toast({
				description: "Cart items have been transferred to your account.",
				variant: "success",
				duration: 5000,
			});
		} catch (error) {
			console.error("LoginRegistrationForm: Error merging guest cart:", error);
		}
	};

	// Core login used by both plain login and combined login+order
	const loginCore = async (opts?: { skipMerge?: boolean }) => {
		try {
			if (validateLoginForm(loginFormData)) {
				setLoading.open();

				const result = await customerService.loginCustomer(
					loginFormData.email,
					loginFormData.password
				);
				toast({
					title: "Welcome back!",
					description: result.message,
					variant: "success",
					duration: 10000,
				});

				login(result.data.authToken, result.data.customer);
                
				if (!opts?.skipMerge) {
					// Merge guest cart with authenticated user's cart
					await mergeGuestCartAndRefresh();
				}
				return true;
			}
			return false;
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : String(err);
			setLoginFormErrors((prevErrors) => ({
				...prevErrors,
				global: message,
			}));
			toast({
				description: message,
				variant: "destructive",
				duration: 10000,
			});
			return false;
		} finally {
			setLoading.close();
		}
	};

	// Removed standalone login handler; combined flow remains

	// Core registration used by both plain and combined register+order
	const registerCore = async (opts?: { skipMerge?: boolean }) => {
		try {
			if (validateRegistrationForm(registrationFormData)) {
				setLoading.open();
				const result = await customerService.registerCustomer(
					registrationFormData.name,
					registrationFormData.email,
					registrationFormData.phone,
					registrationFormData.password
				);
				toast({
					title: "Welcome to Dhaka Plastic & Metal",
					description: "Please verify your account using the email we've sent.",
					variant: "success",
					duration: 10000,
				});

				login(result.data.authToken, result.data.customer);
                
				if (!opts?.skipMerge) {
					// Merge guest cart with authenticated user's cart
					await mergeGuestCartAndRefresh();
				}
				return true;
			}
			return false;
		} catch (err: unknown) {
			// Detect backend's 'email already exists' error and switch to login with prefilled email
			const status = axios.isAxiosError(err)
				? err.response?.data?.status ?? err.response?.status ?? err.status
				: undefined;
			const message = (() => {
				if (axios.isAxiosError(err)) {
					const data = err.response?.data as
						| { message?: string; error?: string }
						| undefined;
					return data?.message || data?.error || err.message;
				}
				return err instanceof Error ? err.message : String(err);
			})();
			const emailAlreadyExists =
				status === 409 || // Conflict
				status === 422 || // Unprocessable (often validation like unique)
				/exists|already\s*registered|in use/i.test(message);

			if (emailAlreadyExists) {
				setTabValue("login");
				setLoginFormData((prev) => ({
					...prev,
					email: registrationFormData.email,
				}));
				setRegistrationFormErrors((prev) => ({
					...prev,
					global: "This email is already registered. Please login instead.",
				}));
				toast({
					description: "This email is already registered. Please login.",
					variant: "destructive",
					duration: 10000,
				});
			} else {
				setRegistrationFormErrors((prevErrors) => ({
					...prevErrors,
					global: message,
				}));
				toast({
					description: message,
					variant: "destructive",
					duration: 10000,
				});
			}
			return false;
		} finally {
			setLoading.close();
		}
	};

	// Removed standalone registration handler; combined flow remains

	// Combined flows (skip merge because order will be sent immediately)
	const handleLoginThenOrder = async () => {
		const ok = await loginCore({ skipMerge: true });
		if (!ok) return;
		try {
			await Promise.resolve(onLoginAndOrder?.());
		} catch (e) {
			const msg = e instanceof Error ? e.message : String(e);
			toast({ description: msg, variant: "destructive", duration: 10000 });
		}
	};

	const handleRegisterThenOrder = async () => {
		const ok = await registerCore({ skipMerge: true });
		if (!ok) return;
		try {
			await Promise.resolve(onRegisterAndOrder?.());
		} catch (e) {
			const msg = e instanceof Error ? e.message : String(e);
			toast({ description: msg, variant: "destructive", duration: 10000 });
		}
	};

	return (
		<Tabs
			value={tabValue}
			onValueChange={(v) => setTabValue(v as DefaultTab)}
			className="w-full xl:px-20"
		>
			<TabsList className="grid w-full grid-cols-2 h-auto">
				<TabsTrigger className="text-lg" value="login">
					Login
				</TabsTrigger>
				<TabsTrigger className="text-lg" value="registration">
					Registration
				</TabsTrigger>
			</TabsList>
			<TabsContent className="text-lg" value="login">
				<Card className="relative">
					<LoadingOverlay
						visible={loading}
						zIndex={10}
						overlayProps={{ radius: "xs", blur: 2 }}
					/>

					<CardHeader className="text-center">
						<CardTitle className="text-2xl">Login</CardTitle>
						<CardDescription className="text-base lg:text-lg">
							Make changes to your account here. Click save when you're done.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="space-y-3">
							<Label
								htmlFor="email"
								className="text-base lg:text-lg cursor-pointer"
							>
								Email
								<span className="text-skyblue"> *</span>
							</Label>
							<Input
								type="email"
								id="email"
								name="email"
								placeholder="your email"
								value={loginFormData.email}
								onChange={handleLoginFormData}
								error={loginFormErrors.email ? true : false}
							/>
							{loginFormErrors.email && (
								<p className="text-rose-500 font-semibold text-sm">
									{loginFormErrors.email}
								</p>
							)}
						</div>
						<div className="space-y-3">
							<Label
								htmlFor="password"
								className="text-base lg:text-lg cursor-pointer"
							>
								Password
								<span className="text-skyblue"> *</span>
							</Label>
							<div className="flex w-full items-center space-x-2 relative">
								<Input
									type={showLoginPassword ? "text" : "password"}
									name="password"
									id="password"
									placeholder="your password"
									value={loginFormData.password}
									onChange={handleLoginFormData}
									error={loginFormErrors.password ? true : false}
								/>
								{showLoginPassword ? (
									<EyeClosed
										size={20}
										className="cursor-pointer text-gray absolute right-5"
										onClick={() => setShowLoginPassword(false)}
									/>
								) : (
									<Eye
										size={20}
										className="cursor-pointer text-gray absolute right-5"
										onClick={() => setShowLoginPassword(true)}
									/>
								)}
							</div>
							{loginFormErrors.password && (
								<p className="text-rose-500 font-semibold text-sm">
									{loginFormErrors.password}
								</p>
							)}
							{loginFormErrors.global && (
								<p className="text-rose-500 font-semibold text-sm">
									{loginFormErrors.global}
								</p>
							)}
						</div>
						<div className="space-y-3">
							<Link
								to={routes.account.resetPassword.path}
								className="text-base lg:text-lg underline hover:text-skyblue transition-all duration-300"
							>
								Lost your password?
							</Link>
						</div>
					</CardContent>
					<CardFooter className="flex flex-col items-stretch gap-3">
						{showOrderActionButtons ? (
							<Button
								variant="secondary"
								className="w-full"
								onClick={handleLoginThenOrder}
								disabled={loading}
							>
								Login & Send Order Request
							</Button>
						) : (
							<Button
								className="w-full"
								onClick={async () => {
									const ok = await loginCore();
									if (ok) {
										await Promise.resolve(onSuccess?.());
									}
								}}
								disabled={loading}
							>
								Login
							</Button>
						)}
					</CardFooter>
				</Card>
			</TabsContent>
			<TabsContent value="registration">
				<Card className="relative">
					<LoadingOverlay
						visible={loading}
						zIndex={10}
						overlayProps={{ radius: "xs", blur: 2 }}
					/>

					<CardHeader className="text-center">
						<CardTitle className="text-2xl">Registration</CardTitle>
						<CardDescription className="text-base lg:text-lg">
							Change your password here. After saving, you'll be logged out.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="space-y-3">
							<Label
								htmlFor="name"
								className="text-base lg:text-lg cursor-pointer"
							>
								Name
								<span className="text-skyblue"> *</span>
							</Label>
							<Input
								id="name"
								placeholder="your name"
								name="name"
								value={registrationFormData.name}
								onChange={handleRegistrationFormData}
								error={registrationFormErrors.name ? true : false}
							/>
							{registrationFormErrors.name && (
								<p className="text-rose-500 font-semibold text-sm">
									{registrationFormErrors.name}
								</p>
							)}
						</div>
						<div className="space-y-3">
							<Label
								htmlFor="email"
								className="text-base lg:text-lg cursor-pointer"
							>
								Email
								<span className="text-skyblue"> *</span>
							</Label>
							<Input
								id="email"
								placeholder="your email"
								name="email"
								value={registrationFormData.email}
								onChange={handleRegistrationFormData}
								error={registrationFormErrors.email ? true : false}
							/>
							{registrationFormErrors.email && (
								<p className="text-rose-500 font-semibold text-sm">
									{registrationFormErrors.email}
								</p>
							)}
						</div>
						<div className="space-y-3">
							<Label
								htmlFor="phone"
								className="text-base lg:text-lg cursor-pointer"
							>
								Phone
								<span className="text-skyblue"> *</span>
							</Label>
							<Input
								id="phone"
								placeholder="017........"
								name="phone"
								value={registrationFormData.phone}
								onChange={handleRegistrationFormData}
								error={registrationFormErrors.phone ? true : false}
							/>
							{registrationFormErrors.phone && (
								<p className="text-rose-500 font-semibold text-sm">
									{registrationFormErrors.phone}
								</p>
							)}
						</div>
						<div className="space-y-3">
							<Label
								htmlFor="password"
								className="text-base lg:text-lg cursor-pointer"
							>
								Password
								<span className="text-skyblue"> *</span>
							</Label>
							<div className="flex w-full items-center space-x-2 relative">
								<Input
									type={showRegisterPassword ? "text" : "password"}
									id="password"
									placeholder="your password"
									name="password"
									value={registrationFormData.password}
									onChange={handleRegistrationFormData}
									error={registrationFormErrors.password ? true : false}
								/>
								{showRegisterPassword ? (
									<EyeClosed
										size={20}
										className="cursor-pointer text-gray absolute right-5"
										onClick={() => setShowRegisterPassword(false)}
									/>
								) : (
									<Eye
										size={20}
										className="cursor-pointer text-gray absolute right-5"
										onClick={() => setShowRegisterPassword(true)}
									/>
								)}
							</div>
							{registrationFormErrors.password && (
								<p className="text-rose-500 font-semibold text-sm">
									{registrationFormErrors.password}
								</p>
							)}
							{registrationFormErrors.global && (
								<p className="text-rose-500 font-semibold text-sm">
									{registrationFormErrors.global}
								</p>
							)}
						</div>
					</CardContent>
					<CardFooter className="flex flex-col items-stretch gap-3">
						{showOrderActionButtons ? (
							<Button
								variant="secondary"
								className="w-full"
								onClick={handleRegisterThenOrder}
								disabled={loading}
							>
								Register & Send Order Request
							</Button>
						) : (
							<Button
								className="w-full"
								onClick={async () => {
									const ok = await registerCore();
									if (ok) {
										await Promise.resolve(onSuccess?.());
									}
								}}
								disabled={loading}
							>
								Register
							</Button>
						)}
						<p className="text-sm text-center text-gray-700">
							Already have an account?{" "}
							<button
								type="button"
								className="text-skyblue underline hover:opacity-80"
								onClick={() => setTabValue("login")}
							>
								Log in
							</button>
						</p>
					</CardFooter>
				</Card>
			</TabsContent>
		</Tabs>
	);
};
