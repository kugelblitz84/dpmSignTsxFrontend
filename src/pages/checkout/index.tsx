import { ChangeEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Trash, Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { currencySymbol } from "@/config";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import routes from "@/routes";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { LoadingOverlay } from "@mantine/core";
import { useAuth } from "@/hooks/use-auth";
import {
	cartService,
	orderService,
	courierService,
	staffService,
	couponService,
} from "@/api";
import { useFormValidation } from "@/hooks/use-form-validation";
import { useDisclosure } from "@mantine/hooks";

interface CheckoutFormProps {
	name: string;
	email: string;
	phone: string;
	billingAddress: string;
	additionalNotes: string;
	designFiles: File[] | [];
	deliveryMethod: string;
	// paymentMethod: string;
	courierId: number | null;
	courierAddress: string;
	staffId: number | null;
	couponId: number | null;
}

interface CourierProps {
	courierId: number;
	name: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface StaffProps {
	staffId: number;
	name: string;
	email: string;
	phone: string;
	avatar: string;
	avatarUrl: string | null;
	tokenVersion: number;
	role: string;
	commissionPercentage: number;
	designCharge: number | null;
	balance: number;
	status: "online" | "offline";
	isDeleted: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const Checkout = () => {
	const { customer, token, logout } = useAuth();
	const navigate = useNavigate();
	const [requestOrderLoading, setRequestOrderLoading] = useDisclosure();
	const { cartItems, fetchCartItems, error, loading, setLoading } = useCart();
	const { toast } = useToast();
	const [couriers, setCouriers] = useState<CourierProps[]>([]);
	const [staff, setStaff] = useState<StaffProps[]>([]);
	const [couponCode, setCouponCode] = useState<string>("");
	const [subtotal, _setSubtotal] = useState<number>(
		cartItems.reduce((acc, item) => (acc += item.price), 0)
	);
	const [total, setTotal] = useState<number>(subtotal);
	const [discountApplied, setDiscountApplied] = useState<boolean>(false);
	const [isAgreeTerms, setIsAgreeTerms] = useState<boolean>(false);

	useEffect(() => {
		const fetchCouriers = async () => {
			try {
				if (!token) {
					// navigate(routes.products.path);
					return logout();
				}

				const response = await courierService.fetchAllCourier(token);

				setCouriers(response.data.couriers);
			} catch (err: any) {
				console.log(err.message);
			}
		};

		const fetchStaff = async () => {
			try {
				if (!token) {
					// navigate(routes.products.path);
					return logout();
				}

				const response = await staffService.fetchAllStaff(token);

				setStaff(
					response.data.staff.filter(
						(staffItem: StaffProps) => !staffItem.isDeleted
					)
				);
			} catch (err: any) {
				console.log(err.message);
			}
		};

		fetchCouriers();
		fetchStaff();

		if (error) {
			toast({
				description: error,
				variant: "destructive",
				duration: 10000,
			});
		}
	}, []);

	useEffect(() => {
		if (!cartItems.length) {
			navigate(routes.products.path);
			return;
		}
	}, [cartItems]);

	const [checkoutFormData, setCheckoutFormData] = useState<CheckoutFormProps>({
		name: customer?.name || "",
		email: customer?.email || "",
		phone: customer?.phone || "",
		billingAddress: customer?.billingAddress || "",
		additionalNotes: "",
		designFiles: [],
		deliveryMethod: "",
		courierId: null,
		courierAddress: "",
		// paymentMethod: "",
		staffId: null,
		couponId: null,
	});
	const { errors, validateField, validateForm, setErrors } = useFormValidation(
		orderService.orderRequestCreateSchema
	);

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;

		validateField(name, value);
		if (name !== "payment") {
		}

		setCheckoutFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const files = Array.from(e.target.files).slice(
				0,
				Math.abs(checkoutFormData.designFiles.length - 5)
			);

			setCheckoutFormData({
				...checkoutFormData,
				designFiles: [...checkoutFormData.designFiles, ...files],
			});
		}
	};

	// Handle item deletion
	const handleDeleteItem = async (cartItemId: number) => {
		try {
			setLoading(true);
			if (!token) {
				// navigate(routes.products.path);
				return logout();
			}

			const response = await cartService.deleteCartItem(token, cartItemId);

			toast({
				description: response.message,
				variant: response.status === 200 ? "success" : "default",
				duration: 10000,
			});
			await fetchCartItems();

			if (cartItems.length === 0) {
				navigate(routes.products.path);
				return;
			}
		} catch (err: any) {
			setLoading(false);
			console.log(err.message);
			toast({
				description: err.message,
				variant: "destructive",
				duration: 10000,
			});
		} finally {
			setLoading(false);
		}
	};

	const handleRequestOrder = async () => {
		try {
			let isValid = validateForm(checkoutFormData);
			if (checkoutFormData.deliveryMethod === "courier") {
				if (
					!checkoutFormData.courierId ||
					!checkoutFormData.courierAddress.length
				) {
					isValid = false;
					setErrors((prevError) => ({
						...prevError,
						courierId: "Please select a courier service",
						courierAddress: "Courier address is required.",
					}));
				}
			}

			if (isValid) {
				setRequestOrderLoading.open();

				if (!token || !customer) {
					// navigate(routes.products.path);
					return logout();
				}

				const orderItems = cartItems.map(
					({
						productId,
						productVariantId,
						quantity,
						size,
						widthInch,
						heightInch,
						price,
					}) => ({
						productId,
						productVariantId,
						quantity,
						size,
						widthInch,
						heightInch,
						price,
					})
				);

				const response = await orderService.createOrderRequest(
					customer.customerId,
					checkoutFormData.name,
					checkoutFormData.phone,
					checkoutFormData.billingAddress,
					checkoutFormData.additionalNotes,
					checkoutFormData.designFiles,
					checkoutFormData.deliveryMethod,
					checkoutFormData.courierId,
					checkoutFormData.courierAddress,
					checkoutFormData.staffId,
					checkoutFormData.couponId,
					// checkoutFormData.paymentMethod,
					orderItems
				);

				if (response.status === 201) {
					toast({
						description:
							"Thank you for your order. Our agent will contact you shortly.",
						variant: "success",
						duration: 10000,
					});
				}
				navigate(routes.products.path);
				await fetchCartItems();
			}
		} catch (err: any) {
			setRequestOrderLoading.close();
			console.log(err.message);
			toast({
				description: err.message,
				variant: "destructive",
				duration: 10000,
			});
		}
	};

	const checkCoupon = async () => {
		try {
			if (couponCode.length) {
				const response = await couponService.checkCouponStatus(
					couponCode,
					subtotal
				);

				if (response.data.valid === true && response.status === 200) {
					setCheckoutFormData((prevData) => ({
						...prevData,
						couponId: response.data.coupon.couponId,
					}));
					setTotal(response.data.discountedPrice);
					setDiscountApplied(true);

					toast({
						description: "Coupon applied.",
						variant: "success",
						duration: 10000,
					});
				}
			}
		} catch (err: any) {
			setCouponCode("");
			console.log(err.message);
			toast({
				description: err.message,
				variant: "destructive",
				duration: 10000,
			});
		}
	};

	return (
		<div className="row p-6 lg:p-10 bg-gray-50 relative">
			{requestOrderLoading && (
				<>
					<LoadingOverlay
						visible={requestOrderLoading}
						zIndex={10}
						overlayProps={{ radius: "xs", blur: 1 }}
					/>
				</>
			)}

			<div className="flex flex-col xl:flex-row gap-8">
				{/* Left Section: Shipping Information */}
				<div className="flex-1 space-y-8">
					<Card className="bg-slate-100/60 backdrop-blur-lg">
						<CardHeader>
							<CardTitle className="xl:text-2xl">Order Information</CardTitle>
						</CardHeader>
						<CardContent>
							<form className="space-y-4">
								<div className="form-group flex-col sm:flex-row">
									<div className="w-full space-y-2">
										<Label htmlFor="name" className="text-base cursor-pointer">
											Name
											<span className="text-skyblue"> *</span>
										</Label>
										<Input
											type="name"
											id="name"
											name="name"
											value={checkoutFormData.name}
											onChange={handleChange}
											error={errors.name ? true : false}
										/>

										{errors.name && (
											<p className="text-rose-500 font-semibold text-sm">
												{errors.name}
											</p>
										)}
									</div>
								</div>

								<div className="form-group flex-col items-start justify-start sm:flex-row">
									<div className="w-full space-y-2">
										<Label htmlFor="email" className="text-base cursor-pointer">
											Email Address
											<span className="text-skyblue"> *</span>
										</Label>
										<Input
											type="email"
											id="email"
											name="email"
											readOnly={true}
											value={checkoutFormData.email}
											// onChange={handleChange}
										/>
									</div>

									<div className="w-full space-y-2">
										<Label htmlFor="phone" className="text-base cursor-pointer">
											Phone
											<span className="text-skyblue"> *</span>
										</Label>
										<Input
											type="phone"
											id="phone"
											name="phone"
											value={checkoutFormData.phone}
											onChange={handleChange}
											error={errors.phone ? true : false}
										/>
										{errors.phone && (
											<p className="text-rose-500 font-semibold text-sm">
												{errors.phone}
											</p>
										)}
									</div>
								</div>

								<div className="form-group">
									<div className="w-full space-y-2">
										<Label
											htmlFor="billing-address"
											className="text-base cursor-pointer"
										>
											Billing Address
											<span className="text-skyblue"> *</span>
										</Label>
										<Textarea
											rows={5}
											id="billing-address"
											name="billingAddress"
											className="text-xs"
											value={checkoutFormData.billingAddress}
											onChange={handleChange}
											error={errors.billingAddress ? true : false}
										></Textarea>

										{errors.billingAddress && (
											<p className="text-rose-500 font-semibold text-sm">
												{errors.billingAddress}
											</p>
										)}
									</div>
								</div>

								<div className="form-group flex-col items-start">
									<Label
										htmlFor="additional-notes"
										className="text-base cursor-pointer"
									>
										Additional Notes
									</Label>
									<Textarea
										rows={5}
										id="additional-notes"
										name="additionalNotes"
										// className="w-full p-2 border border-gray-300 rounded-md"
										value={checkoutFormData.additionalNotes}
										onChange={handleChange}
										error={errors.additionalNotes ? true : false}
									></Textarea>

									{errors.additionalNotes && (
										<p className="text-rose-500 font-semibold text-sm">
											{errors.additionalNotes}
										</p>
									)}
								</div>

								<div className="form-group w-full flex flex-col gap-4 items-center justify-center">
									{checkoutFormData.designFiles.length < 5 && (
										<Label
											className="relative w-full h-40 border-dashed border-[3px] border-gray/30 hover:border-skyblue/80 transition-all duration-300 cursor-pointer rounded-lg flex items-start justify-center flex-col gap-1.5"
											htmlFor="designFile"
										>
											<Input
												id="designFile"
												type="file"
												multiple
												accept="image/*"
												className="w-full h-full pointer-events-none hidden"
												onChange={handleFileChange}
												name="designFile"
											/>
											<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-40 flex items-center justify-center flex-col gap-3">
												<Upload />
												<span className="text-sm cursor-pointer">
													Click to upload design file. Max 5 image.
												</span>
											</div>
										</Label>
									)}

									{checkoutFormData.designFiles && (
										<div className="w-full h-auto grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
											{checkoutFormData.designFiles.map((designFile, index) => (
												<div
													key={index}
													className="flex items-start justify-center flex-col gap-2 overflow-hidden"
												>
													<img
														className="w-36 h-36 rounded-md"
														src={URL.createObjectURL(designFile)}
														alt="Not Found"
													/>

													<Button
														size="sm"
														variant="destructive"
														onClick={() => {
															setCheckoutFormData((prevFormData) => ({
																...prevFormData,
																designFiles: prevFormData.designFiles.filter(
																	(_, itemIndex) => itemIndex != index
																),
															}));
														}}
													>
														<Trash />
														Remove
													</Button>
												</div>
											))}
										</div>
									)}
								</div>

								<div className="form-group flex flex-col items-start gap-4 py-4">
									<div className="flex items-start justify-start flex-col gap-2">
										<h3 className="text-base font-semibold">
											Delivery Method <span className="text-skyblue"> *</span>
										</h3>
										<Select
											onValueChange={(v) => {
												if (v === "shop-pickup") {
													setCheckoutFormData((prevData) => ({
														...prevData,
														courierId: null,
														courierAddress: "",
													}));
												}
												setCheckoutFormData((prevData) => ({
													...prevData,
													deliveryMethod: v,
												}));
											}}
										>
											<SelectTrigger
												error={errors.deliveryMethod ? true : false}
												className="w-[180px]"
											>
												<SelectValue placeholder="Select delivery method" />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													<SelectItem value="shop-pickup">
														Shop Pickup
													</SelectItem>
													<SelectItem value="courier">
														Courier Delivery
													</SelectItem>
												</SelectGroup>
											</SelectContent>
										</Select>

										{errors.deliveryMethod && (
											<p className="text-rose-500 font-semibold text-sm">
												{errors.deliveryMethod}
											</p>
										)}
									</div>

									{checkoutFormData.deliveryMethod === "courier" && (
										<div className="form-group flex flex-col items-start gap-4">
											<div className="flex items-start justify-start flex-col gap-2">
												<h3 className="text-base font-semibold">
													Choose your nearest courier service.
													<span className="text-skyblue"> *</span>
												</h3>
												<Select
													onValueChange={(courierId) => {
														setCheckoutFormData((prevData) => ({
															...prevData,
															courierId: Number(courierId),
														}));
													}}
												>
													<SelectTrigger
														error={errors.courierId ? true : false}
														className="w-[180px]"
													>
														<SelectValue placeholder="Select a courier service" />
													</SelectTrigger>
													<SelectContent>
														<SelectGroup>
															{couriers.map((courier, index) => (
																<SelectItem
																	key={index}
																	value={courier.courierId.toString()}
																>
																	{courier.name}
																</SelectItem>
															))}
														</SelectGroup>
													</SelectContent>
												</Select>

												{errors.courierId && (
													<p className="text-rose-500 font-semibold text-sm">
														{errors.courierId}
													</p>
												)}
											</div>

											<div className="w-full space-y-2">
												<Label
													htmlFor="courier-address"
													className="text-base cursor-pointer"
												>
													Courier Address
													<span className="text-skyblue"> *</span>
												</Label>
												<Textarea
													rows={5}
													id="courier-address"
													name="courierAddress"
													className="w-full p-2 border border-gray-300 rounded-md"
													value={checkoutFormData.courierAddress}
													onChange={handleChange}
													error={errors.courierAddress ? true : false}
												></Textarea>

												{errors.courierAddress && (
													<p className="text-rose-500 font-semibold text-sm">
														{errors.courierAddress}
													</p>
												)}
											</div>
										</div>
									)}
								</div>

								<div className="form-group flex flex-col items-start gap-4 py-4">
									<div className="flex flex-col gap-2">
										<h3 className="text-base font-semibold">
											Help us reward our staff! 🎉
										</h3>
										<p className="text-sm text-gray-600">
											If a staff member assisted you with your purchase, please
											select their name below. Your choice ensures they receive
											proper recognition and commission.
										</p>
										<Select
											onValueChange={(staffId) => {
												setCheckoutFormData((prevData) => ({
													...prevData,
													staffId: Number(staffId),
												}));
											}}
										>
											<SelectTrigger className="w-[220px]">
												<SelectValue placeholder="Select a staff member" />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													{staff.map((staffItem, index) => (
														<SelectItem
															key={index}
															value={staffItem.staffId.toString()}
														>
															{staffItem.name}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
									</div>
								</div>

								<div className="form-group flex items-start justify-start flex-col gap-2">
									<div className="flex items-center justify-center gap-2">
										<Checkbox
											id="terms"
											checked={isAgreeTerms}
											onCheckedChange={(checked) => {
												setIsAgreeTerms(checked as boolean);
											}}
										/>
										<Label htmlFor="terms" className="cursor-pointer">
											I have read and agree to the{" "}
											<Link
												className="text-skyblue underline"
												to={routes.termsNCondition.path}
												target="_blank"
											>
												Terms and Conditions
											</Link>
											,{" "}
											<Link
												className="text-skyblue underline"
												to={routes.privacyPolicy.path}
												target="_blank"
											>
												Privacy Policy
											</Link>{" "}
											and{" "}
											<Link
												className="text-skyblue underline"
												to={routes.returnPolicy.path}
												target="_blank"
											>
												Return Policy
											</Link>
										</Label>
									</div>

									{!isAgreeTerms && (
										<p className="text-rose-500 font-semibold text-sm">
											You must be agree with our terms and condition.
										</p>
									)}
								</div>
							</form>
						</CardContent>
					</Card>
				</div>

				{/* Right Section: Order Summary */}
				<div className="w-full xl:w-1/3">
					<Card className="w-full bg-slate-100/60 backdrop-blur-lg">
						<CardHeader className="pb-3">
							<CardTitle className="xl:text-2xl">Order Summary</CardTitle>
						</CardHeader>
						<CardContent>
							{loading && (
								<>
									<LoadingOverlay
										visible={loading}
										zIndex={10}
										overlayProps={{ radius: "xs", blur: 1 }}
									/>
								</>
							)}

							<div className="space-y-4">
								{cartItems.map((item, index) => (
									<div key={index} className="w-full">
										<div
											key={item.cartItemId}
											className="grid grid-cols-[1fr_auto] gap-4"
										>
											<div className="space-y-1">
												<div className="flex flex-wrap items-center gap-1">
													<span className="font-medium text-black">
														{item.product.name}
													</span>
													<span className="text-sm text-skyblue">
														×{item.quantity} (pieces)
													</span>
													{item.size && (
														<span className="text-sm text-skyblue">
															×{item.size.toFixed(2)} (sq.feet)
														</span>
													)}
												</div>

												<div className="text-xs text-gray flex flex-wrap gap-2">
													{item.productVariant.variantDetails.map(
														(detail, index) => (
															<p
																className="font-semibold text-gray"
																key={index}
															>
																{detail.variationItem.variation.name}:
																{detail.variationItem.value}{" "}
																{detail.variationItem.variation.unit}
															</p>
														)
													)}
												</div>
											</div>

											<div className="flex flex-col justify-between items-end">
												<div className="text-right">
													<h5 className="text-lg font-semibold text-black">
														{currencySymbol} {formatPrice(item.price)}
													</h5>
												</div>

												<Button
													variant="destructive"
													size="xs"
													onClick={() => handleDeleteItem(item.cartItemId)}
												>
													<Trash className="h-3 w-3" />
												</Button>
											</div>
										</div>

										{index < cartItems.length - 1 && (
											<Separator className="my-4 bg-gray/30" />
										)}
									</div>
								))}
							</div>

							<Separator className="my-4 bg-gray/30" />

							{/* <div className="form-group flex flex-col items-start justify-start my-6 gap-2">
								<div className="">
									<h3 className="text-base font-medium">Payment Method</h3>
								</div>
								<div className="flex items-center gap-2">
									<Input
										type="radio"
										id="online-payment"
										value="online-payment"
										name="paymentMethod"
										className="w-4 h-4"
										checked={
											checkoutFormData.paymentMethod === "online-payment"
										}
										onChange={handleChange}
									/>
									<Label
										htmlFor="online-payment"
										className="text-sm font-normal cursor-pointer"
									>
										Online Payment (Bkash/Nagad/Bank)
									</Label>
								</div>
								<div className="flex items-center gap-2">
									<Input
										type="radio"
										id="cod-payment"
										value="cod-payment"
										name="paymentMethod"
										className="w-4 h-4"
										checked={checkoutFormData.paymentMethod === "cod-payment"}
										onChange={handleChange}
									/>
									<Label
										htmlFor="cod-payment"
										className="text-sm font-normal cursor-pointer"
									>
										Cash on Delivery
									</Label>
								</div>

								{errors.paymentMethod && (
									<p className="text-rose-500 font-semibold text-sm">
										{errors.paymentMethod}
									</p>
								)}
							</div> */}

							{discountApplied ? (
								<div className="form-group flex items-center justify-start gap-2 my-6">
									<span className="text-base font-medium">Applied coupon</span>
									<Button variant="greenlight" size="sm">
										{couponCode}
									</Button>
								</div>
							) : (
								<div className="form-group flex gap-2 my-6">
									<Input
										id="coupon"
										name="coupon"
										type="text"
										placeholder="Coupon Code"
										value={couponCode}
										onChange={(e) => setCouponCode(e.target.value)}
									/>
									<Button
										disabled={couponCode.length ? false : true}
										variant="secondary"
										size="sm"
										onClick={checkCoupon}
									>
										Apply
									</Button>
								</div>
							)}

							<Separator className="my-4 bg-gray/30" />

							<div className="space-y-2">
								<div className="flex items-center justify-between text-sm">
									<span className="text-base font-medium">Subtotal</span>
									<span className="text-base xl:text-lg font-medium">
										{currencySymbol} {formatPrice(subtotal)}
									</span>
								</div>

								<div className="flex items-center justify-between">
									<span className="text-base font-medium">Total</span>
									<span className="text-base xl:text-lg font-medium">
										{currencySymbol} {formatPrice(total)}
									</span>
								</div>
							</div>
						</CardContent>

						<CardFooter>
							<Button
								className="w-full"
								// disabled={validateForm(checkoutFormData) ? true : false}
								onClick={handleRequestOrder}
							>
								Request Order
							</Button>
						</CardFooter>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default Checkout;
