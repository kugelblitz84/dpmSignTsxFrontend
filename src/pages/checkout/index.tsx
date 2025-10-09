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
import { formatPrice, safeCreateObjectURL, stripBlobs, handleApiError } from "@/lib/utils";
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
import AuthModal from "@/components/auth-modal";
// customerService no longer used here for modal decision; we default to registration-first
import { useDisclosure } from "@mantine/hooks";

interface CheckoutFormProps {
	name: string;
	email: string;
	phone: string;
	billingAddress: string;
	additionalNotes: string;
	designFiles: File[] | [];
	deliveryMethod: string;
	paymentMethod: "online-payment" | "cod-payment";
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

// Safe utility types to render variant details for both server and guest carts
type ProductVariationSafe = {
	name?: string;
	unit?: string;
	variationItems?: Array<{ variationItemId: number }>;
};

type DetailLike = {
	variationItem?: {
		value?: string;
		variation?: { name?: string; unit?: string };
	};
	variationItemId?: number;
};

const getVariationMeta = (
	detail: DetailLike,
	productVariations?: ProductVariationSafe[]
) => {
	let variationName = detail.variationItem?.variation?.name;
	let variationUnit = detail.variationItem?.variation?.unit;
	const value = detail.variationItem?.value ?? "";

	if (!variationName || !variationUnit) {
		const vid = detail.variationItemId;
		if (vid && Array.isArray(productVariations)) {
			const foundVar = productVariations.find((v) =>
				v.variationItems?.some((vi) => vi.variationItemId === vid)
			);
			variationName = variationName || foundVar?.name;
			variationUnit = variationUnit || foundVar?.unit;
		}
	}

	return {
		name: variationName || "Option",
		unit: variationUnit || "",
		value,
	};
};

const Checkout = () => {
	const { customer, token, logout, setNavigateTo } = useAuth();
	const navigate = useNavigate();
	const [requestOrderLoading, setRequestOrderLoading] = useDisclosure();
	const { cartItems, fetchCartItems, error, loading, setLoading, setCartItems } = useCart();
	const { toast } = useToast();
	const [couriers, setCouriers] = useState<CourierProps[]>([]);
	const [staff, setStaff] = useState<StaffProps[]>([]);
	const [couponCode, setCouponCode] = useState<string>("");
	// Derive subtotal from cart items so it stays in sync for guests and auth users
	// Subtotal uses each cart line total (already a line price)
	const subtotal = cartItems.reduce((acc, item) => acc + Number(item?.price || 0), 0);
	const [total, setTotal] = useState<number>(subtotal);
	const [discountApplied, setDiscountApplied] = useState<boolean>(false);
	const [isAgreeTerms, setIsAgreeTerms] = useState<boolean>(false);
	const [authModalOpen, setAuthModalOpen] = useState(false);
	const [authModalTab, setAuthModalTab] = useState<"login" | "registration">(
		"registration"
	);
	const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
	const [recentlyAuthenticated, setRecentlyAuthenticated] = useState<boolean>(false);
	const [prefillRegistration, setPrefillRegistration] = useState<{
		name?: string;
		email?: string;
		phone?: string;
	}>({});

	useEffect(() => {
		const fetchCouriers = async () => {
			try {
				const response = token
					? await courierService.fetchAllCourier(token)
					: await courierService.fetchAllCourierPublic();
				setCouriers(response.data.couriers || []);
			} catch (err: unknown) {
				let message = "Failed to load courier services.";
				
				if (err && typeof err === 'object' && 'status' in err) {
					const apiError = err as any;
					if (apiError.status === 401) {
						message = "Your session has expired. Please log in again to continue.";
						setAuthModalTab("login");
						setAuthModalOpen(true);
						return;
					} else {
						message = apiError.message || message;
					}
				} else if (err instanceof Error) {
					message = err.message;
				}
				
				console.log(message);
				toast({
					description: message,
					variant: "destructive",
					duration: 8000,
				});
			}
		};

		const fetchStaff = async () => {
			try {
				const response = token
					? await staffService.fetchAllStaff(token)
					: await staffService.fetchAllStaffPublic();

				setStaff(
					response.data.staff?.filter(
						(staffItem: StaffProps) => !staffItem.isDeleted
					) || []
				);
			} catch (err: unknown) {
				let message = "Failed to load staff information.";
				
				if (err && typeof err === 'object' && 'status' in err) {
					const apiError = err as any;
					if (apiError.status === 401) {
						message = "Your session has expired. Please log in again to continue.";
						setAuthModalTab("login");
						setAuthModalOpen(true);
						return;
					} else {
						message = apiError.message || message;
					}
				} else if (err instanceof Error) {
					message = err.message;
				}
				
				console.log(message);
				toast({
					description: message,
					variant: "destructive",
					duration: 8000,
				});
			}
		};

		fetchCouriers();
		fetchStaff();

		// Handle cart errors from the useCart hook
		if (error) {
			toast({
				description: error,
				variant: "destructive",
				duration: 10000,
			});
		}
	}, [token, logout, toast, error, setAuthModalTab, setAuthModalOpen]);

	useEffect(() => {
		// Don't redirect if user is in the middle of authentication process or recently authenticated
		if (!cartItems.length && !isAuthenticating && !recentlyAuthenticated) {
			navigate(routes.products.path);
			return;
		}
	}, [cartItems, navigate, isAuthenticating, recentlyAuthenticated]);

	// Keep total aligned with subtotal unless a coupon/discount is applied
	useEffect(() => {
		if (!discountApplied) {
			setTotal(subtotal);
		}
	}, [subtotal, discountApplied]);

	const [checkoutFormData, setCheckoutFormData] = useState<CheckoutFormProps>(
		() => {
			const saved = localStorage.getItem("guestCheckout");
			if (saved) {
				try {
					const parsed = JSON.parse(saved);
					// Ensure file arrays are valid arrays and contain only Blobs (they won't after JSON, so reset)
					if (!Array.isArray(parsed.designFiles)) parsed.designFiles = [];
					else parsed.designFiles = [];
					// Ensure a safe default for payment method if missing in saved data
					if (!parsed.paymentMethod) parsed.paymentMethod = "online-payment";
					return parsed;
				} catch {
					// fallthrough
				}
			}
			return {
				name: customer?.name || "",
				email: customer?.email || "",
				phone: customer?.phone || "",
				billingAddress: customer?.billingAddress || "",
				additionalNotes: "",
				designFiles: [],
				deliveryMethod: "",
				paymentMethod: "online-payment",
				courierId: null,
				courierAddress: "",
				staffId: null,
				couponId: null,
			} as CheckoutFormProps;
		}
	);
	const { errors, validateField, validateForm, setErrors } = useFormValidation(
		orderService.orderRequestCreateSchema
	);

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;

		// Skip validation for fields not defined in the Joi schema (e.g., paymentMethod)
		if (name !== "paymentMethod") {
			validateField(name, value);
		}
		// no-op placeholder kept for potential payment field branching

		setCheckoutFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
		// persist for guests
		setTimeout(() => {
			// Do not persist Files/Blobs
			const toSave = stripBlobs({
				...checkoutFormData,
				[name]: value,
			});
			localStorage.setItem("guestCheckout", JSON.stringify(toSave));
		});
	};

	// Removed email/name blur modal trigger. The auth modal opens only after pressing Request Order.

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const files = Array.from(e.target.files).slice(
				0,
				Math.abs(checkoutFormData.designFiles.length - 5)
			);

			setCheckoutFormData((prev) => ({
				...prev,
				designFiles: [...prev.designFiles, ...files],
			}));
			// do not persist files to localStorage for security
		}
	};

	// Handle item deletion
	const handleDeleteItem = async (cartItemId: number) => {
		try {
			setLoading(true);
			if (!token || !customer) {
				// Guest: remove from localStorage using negative id mapping
				const guest = JSON.parse(localStorage.getItem("guestCart") || "[]");
				if (Array.isArray(guest)) {
					const idx = cartItemId < 0 ? -cartItemId - 1 : -1;
					if (idx >= 0 && idx < guest.length) {
						guest.splice(idx, 1);
						localStorage.setItem("guestCart", JSON.stringify(guest));
						toast({
							description: "Item removed from cart.",
							variant: "success",
							duration: 5000,
						});
						await fetchCartItems();
						if (guest.length === 0) {
							navigate(routes.products.path);
							return;
						}
						return;
					}
				}
				await fetchCartItems();
				return;
			}

			const response = await cartService.deleteCartItem(token, cartItemId);

			toast({
				description: response.message || "Item removed from cart.",
				variant: response.status === 200 ? "success" : "default",
				duration: 5000,
			});
			await fetchCartItems();

			if (cartItems.length === 0) {
				navigate(routes.products.path);
				return;
			}
		} catch (err: unknown) {
			setLoading(false);
			
			const errorInfo = handleApiError(err);
			
			if (errorInfo.isUnauthorized) {
				// Show auth modal for unauthorized errors
				setAuthModalTab("login");
				setAuthModalOpen(true);
			}
			
			console.log(errorInfo.message);
			toast({
				description: errorInfo.message,
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
				// Resolve freshest auth data (combined flows may not have context updated yet)
				let authToken: string | undefined = token as string | undefined;
				let authCustomer: any = customer || null;
				if (!authToken || !authCustomer) {
					const freshToken = localStorage.getItem("token") || undefined;
					const freshCustomerRaw = localStorage.getItem("customer");
					const freshCustomer = freshCustomerRaw ? JSON.parse(freshCustomerRaw) : null;
					authToken = freshToken;
					authCustomer = freshCustomer;
				}

				// If still not authenticated, open auth modal (registration-first)
				if (!authToken || !authCustomer) {
					localStorage.setItem(
						"guestCheckout",
						JSON.stringify(checkoutFormData)
					);
					const email = checkoutFormData.email?.trim();
					const nameVal = checkoutFormData.name?.trim();
					// Always show registration first; prefill any known fields (name, email, phone)
					const phoneVal = checkoutFormData.phone?.trim();
					setAuthModalTab("registration");
					if (email) {
						setPrefillRegistration({ name: nameVal, email, phone: phoneVal });
					} else {
						setPrefillRegistration({ name: nameVal, phone: phoneVal });
					}
					setIsAuthenticating(true);
					setAuthModalOpen(true);
					return;
				}

				setRequestOrderLoading.open();

				// Build order items robustly: prefer current cartItems; fallback to guestCart snapshot
				let orderItems = cartItems.map(({ productId, productVariantId, quantity, size, widthInch, heightInch, price, product, productVariant }) => {
					const unitPrice = Number(product?.basePrice ?? 0) || 0;
					const additionalPrice = Number(productVariant?.additionalPrice ?? 0) || 0;
					const effUnit = unitPrice + additionalPrice;
					const qty = Number(quantity || 0);
					const isSqft = product?.pricingType === "square-feet";
					const sz = Number(size || 0);
					const basis = isSqft && sz ? sz * qty : qty;
					// Initial discount by product rules
					let discountPct = 0;
					const maxDiscount = Number(product?.discountPercentage ?? 0) || 0;
					const discountStart = product?.discountStart ?? null;
					const discountEnd = product?.discountEnd ?? null;
					if (maxDiscount > 0 && discountStart !== null && discountEnd !== null && basis >= discountStart) {
						if (basis <= discountEnd) {
							const rangeLength = (discountEnd - discountStart + 1) || 1;
							const stepIndex = basis - discountStart + 1;
							discountPct = Number(((maxDiscount * stepIndex) / rangeLength).toFixed(2));
						} else {
							discountPct = Number(maxDiscount.toFixed(2));
						}
					}
					// Apply design charge rule first (based on discounted subtotal per UI logic)
					const discountedSubtotal = Math.floor((basis * effUnit) * (1 - discountPct / 100));
					const designChargeByRule = discountedSubtotal > 1000 ? 0 : (unitPrice > 0 && unitPrice < 1000 ? 250 : 0);
					// Reconcile any remaining delta (e.g., coupons) into discountPercentage, not into designCharge
					const linePrice = Number(price || 0);
					const undiscountedWithDesign = (basis * effUnit) + designChargeByRule;
					const requiredDiscountAmount = Math.max(0, Math.round(undiscountedWithDesign - linePrice));
					const requiredDiscountPct = (basis * effUnit) > 0 ? (requiredDiscountAmount / (basis * effUnit)) * 100 : 0;
					const finalDiscountPct = Math.min(100, Number((discountPct + requiredDiscountPct).toFixed(2)));
					return {
						productId,
						productVariantId,
						quantity,
						size,
						widthInch,
						heightInch,
						unitPrice,
						additionalPrice,
						discountPercentage: finalDiscountPct,
						designCharge: designChargeByRule,
						price: linePrice,
					};
				});
				if (!orderItems.length) {
					const guest = localStorage.getItem("guestCart");
					if (guest) {
						try {
							const parsed = JSON.parse(guest) as Array<{
								productId: number;
								productVariantId: number;
								quantity: number;
								size?: number | null;
								widthInch?: number | null;
								heightInch?: number | null;
								price: number;
							}>;
							orderItems = parsed.map((g) => ({
								productId: g.productId,
								productVariantId: g.productVariantId,
								quantity: g.quantity,
								size: g.size ?? null,
								widthInch: g.widthInch ?? null,
								heightInch: g.heightInch ?? null,
								// Include optional pricing breakdown based on guest snapshot fields if available
								// Recompute breakdown for guest items similarly to ensure consistency
								...(() => {
									const product = (g as any).product;
									const productVariant = (g as any).productVariant;
									const unitPrice = Number((g as any).unitPrice ?? product?.basePrice ?? 0) || 0;
									const additionalPrice = Number((g as any).additionalPrice ?? productVariant?.additionalPrice ?? 0) || 0;
									const effUnit = unitPrice + additionalPrice;
									const qty = Number(g.quantity || 0);
									const sizeVal = Number((g as any).size || 0) || 0;
									const basis = (product?.pricingType === "square-feet" && sizeVal) ? Number(sizeVal) * qty : qty;
									let discountPct = 0;
									const maxDiscount = Number(product?.discountPercentage ?? 0) || 0;
									const discountStart = product?.discountStart ?? null;
									const discountEnd = product?.discountEnd ?? null;
									if (maxDiscount > 0 && discountStart !== null && discountEnd !== null && basis >= discountStart) {
										if (basis <= discountEnd) {
											const rangeLength = (discountEnd - discountStart + 1) || 1;
											const stepIndex = basis - discountStart + 1;
											discountPct = Number(((maxDiscount * stepIndex) / rangeLength).toFixed(2));
										} else {
											discountPct = Number(maxDiscount.toFixed(2));
										}
									}
									const discountedSubtotal = Math.floor((basis * effUnit) * (1 - discountPct / 100));
									const designChargeByRule = discountedSubtotal > 1000 ? 0 : (unitPrice > 0 && unitPrice < 1000 ? 250 : 0);
									const linePrice = Number(g.price);
									const undiscountedWithDesign = (basis * effUnit) + designChargeByRule;
									const requiredDiscountAmount = Math.max(0, Math.round(undiscountedWithDesign - linePrice));
									const requiredDiscountPct = (basis * effUnit) > 0 ? (requiredDiscountAmount / (basis * effUnit)) * 100 : 0;
									const finalDiscountPct = Math.min(100, Number((discountPct + requiredDiscountPct).toFixed(2)));
									return {
										unitPrice,
										additionalPrice,
										discountPercentage: finalDiscountPct,
										designCharge: designChargeByRule,
										price: linePrice,
									};
								})(),
							}));
						} catch {}
					}
				}

				// Use a local variable to ensure we send the most recent staffId
				const staffIdToSend =
					checkoutFormData.staffId === null
						? null
						: Number(checkoutFormData.staffId);

				const response = await orderService.createOrderRequest(
					authToken as string,
					authCustomer.customerId,
					checkoutFormData.name,
					checkoutFormData.email,
					checkoutFormData.phone,
					checkoutFormData.billingAddress,
					checkoutFormData.additionalNotes,
					checkoutFormData.designFiles,
					checkoutFormData.deliveryMethod,
					checkoutFormData.courierId,
					checkoutFormData.courierAddress,
					staffIdToSend,
					checkoutFormData.couponId,
					orderItems,
					{
						// Backend expects online payments for all web orders; force online here.
						method: "online",
						paymentMethod: "online-payment",
					}
				);

				if (response.status === 201) {
					toast({
						description:
							"Thank you for your order. Our agent will contact you shortly.",
						variant: "success",
						duration: 10000,
					});

					// Online payment: do not start gateway here.
					// Staff will review your order and send you a secure payment link.
					if (checkoutFormData.paymentMethod === "online-payment") {
						toast({
							description:
								"You've chosen Online Payment. Our staff will confirm your order and send a payment link via SMS/Email.",
							variant: "default",
							duration: 9000,
						});
					}

					// After successful order: clear server cart (if authenticated)
					try {
						if (authToken && authCustomer?.customerId) {
							const serverCart = await cartService.fetchAllCartItems(
								authToken,
								authCustomer.customerId
							);
							// Handle the response structure properly
							const items: Array<{ cartItemId: number }> =
								serverCart?.data?.cartItems || serverCart?.cartItems || [];
							for (const it of items) {
								try {
									await cartService.deleteCartItem(authToken, it.cartItemId);
								} catch (deleteError: any) {
									console.log("Error deleting cart item:", deleteError);
									// Continue with other items
								}
							}
							// Clear UI cart immediately for responsiveness
							setCartItems([]);
						}
					} catch (clearError: any) {
						console.log("Error clearing cart:", clearError);
						// Don't fail the order process if cart clearing fails
					}
				}
				// Clear any local guest snapshots BEFORE refreshing to avoid repopulating UI from localStorage
				localStorage.removeItem("guestCheckout");
				localStorage.removeItem("guestCart");
				// Refresh client cart view and navigate away
				await fetchCartItems();
				navigate(routes.products.path);
			}
		} catch (err: unknown) {
			setRequestOrderLoading.close();
			
			let message = "Failed to submit your order.";
			
			if (err && typeof err === 'object' && 'status' in err) {
				const apiError = err as any;
				if (apiError.status === 401) {
					message = "Your session has expired. Please log in again to continue.";
					// Clear auth data and show login modal
					logout();
					setAuthModalTab("login");
					setAuthModalOpen(true);
				} else {
					message = apiError.message || message;
				}
			} else if (err instanceof Error) {
				message = err.message;
			} else {
				message = String(err);
			}
			
			console.log(message);
			toast({
				description: message,
				variant: "destructive",
				duration: 10000,
			});
		} finally {
			// Always close the loading overlay
			setRequestOrderLoading.close();
		}
	};

	const checkCoupon = async () => {
		try {
			if (couponCode.length) {
				const response = await couponService.checkCouponStatus(
					couponCode,
					subtotal
				);

				if (response.data?.valid === true && response.status === 200) {
					setCheckoutFormData((prevData) => ({
						...prevData,
						couponId: response.data.coupon.couponId,
					}));
					setTotal(response.data.discountedPrice);
					setDiscountApplied(true);

					toast({
						description: "Coupon applied successfully.",
						variant: "success",
						duration: 5000,
					});
				} else {
					toast({
						description: response.message || "Invalid or expired coupon code.",
						variant: "destructive",
						duration: 8000,
					});
					setCouponCode("");
				}
			}
		} catch (err: unknown) {
			setCouponCode("");
			
			let message = "Failed to apply coupon.";
			
			if (err && typeof err === 'object' && 'status' in err) {
				const apiError = err as any;
				if (apiError.status === 401) {
					message = "Your session has expired. Please log in again to continue.";
					setAuthModalTab("login");
					setAuthModalOpen(true);
				} else {
					message = apiError.message || message;
				}
			} else if (err instanceof Error) {
				message = err.message;
			} else {
				message = String(err);
			}
			
			console.log(message);
			toast({
				description: message,
				variant: "destructive",
				duration: 8000,
			});
		}
	};

	// Function to restore checkout form data after authentication
	const restoreCheckoutFormData = () => {
		try {
			const savedCheckoutData = localStorage.getItem("guestCheckout");
			const freshCustomerData = localStorage.getItem("customer");
			const freshCustomer = freshCustomerData ? JSON.parse(freshCustomerData) : null;
			
			console.log("Restoring checkout form data:", { 
				savedCheckoutData: !!savedCheckoutData, 
				freshCustomer: !!freshCustomer 
			});
			
			if (savedCheckoutData && freshCustomer) {
				const parsedData = JSON.parse(savedCheckoutData);
				
				// Merge saved checkout data with customer information
				const mergedData = {
					...parsedData,
					name: freshCustomer.name || parsedData.name,
					email: freshCustomer.email || parsedData.email,
					phone: freshCustomer.phone || parsedData.phone,
				};
				
				console.log("Merged checkout data:", mergedData);
				// Ensure file arrays are valid arrays (cannot restore blobs from JSON)
				if (!Array.isArray(mergedData.designFiles)) (mergedData as any).designFiles = [];
				else (mergedData as any).designFiles = [];
				setCheckoutFormData(mergedData as any);

				// Clear the saved checkout data
				localStorage.removeItem("guestCheckout");
			}
		} catch (error) {
			console.error("Error restoring checkout form data:", error);
		}
	};

	// Function to merge guest cart with authenticated user's cart
	const mergeGuestCartAndRefresh = async () => {
		try {
			console.log("Starting cart merge process...");
			
			// Get fresh auth data from localStorage (since login() stores it there immediately)
			const freshToken = localStorage.getItem("token");
			const freshCustomerData = localStorage.getItem("customer");
			const freshCustomer = freshCustomerData ? JSON.parse(freshCustomerData) : null;
			
			console.log("Fresh auth data from localStorage:", { 
				freshToken: !!freshToken, 
				freshCustomer: !!freshCustomer 
			});
			console.log("Context auth data:", { token: !!token, customer: !!customer });
			
			// Get the guest cart from localStorage
			const guestCartData = localStorage.getItem("guestCart");
			console.log("Guest cart data:", guestCartData);
			
			if (!guestCartData || !freshToken || !freshCustomer) {
				console.log("Missing data:", { 
					guestCartData: !!guestCartData, 
					freshToken: !!freshToken, 
					freshCustomer: !!freshCustomer 
				});
				return;
			}

			const guestCart = JSON.parse(guestCartData);
			console.log("Parsed guest cart:", guestCart);
			
			if (!Array.isArray(guestCart) || guestCart.length === 0) {
				console.log("Guest cart is empty or invalid");
				return;
			}

			console.log(`Merging ${guestCart.length} items to server cart...`);

			// Add each guest cart item to the server cart
			for (let i = 0; i < guestCart.length; i++) {
				const item = guestCart[i];
				console.log(`Adding item ${i + 1}/${guestCart.length}:`, item);
				
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
					console.log(`Successfully added item ${i + 1}:`, result);
				} catch (error: any) {
					console.error(`Failed to add guest cart item ${i + 1} to server cart:`, error);
					
					// Handle unauthorized errors specifically
					if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
						console.log("Unauthorized error during cart merge - user needs to re-login");
						toast({
							description: "Your session has expired. Please log in again to continue.",
							variant: "destructive",
							duration: 8000,
						});
						// Don't continue processing if unauthorized
						logout();
						return;
					}
					// Continue with other items for other types of errors
				}
			}

			console.log("Clearing guest cart from localStorage...");
			// Clear the guest cart from localStorage
			localStorage.removeItem("guestCart");

			console.log("Refreshing cart items...");
			// Refresh the cart items to show the merged cart
			await fetchCartItems();

			console.log("Cart merge completed successfully");
			toast({
				description: "Cart items have been transferred to your account.",
				variant: "success",
				duration: 5000,
			});
		} catch (error) {
			console.error("Error merging guest cart:", error);
		}
	};

	return (
		<div className="row p-6 lg:p-10 bg-gray-50 relative">
			<AuthModal
				open={authModalOpen}
				onOpenChange={(open) => {
					setAuthModalOpen(open);
					if (!open) {
						// Reset authentication state when modal is closed
						setIsAuthenticating(false);
						setRecentlyAuthenticated(false);
					}
				}}
				defaultTab={authModalTab}
				initialLoginEmail={checkoutFormData.email}
				initialRegistration={prefillRegistration}
				showOrderActionButtons={true}
				onLoginAndOrder={async () => {
					// Prevent redirect while cart context updates
					setIsAuthenticating(true);
					setRecentlyAuthenticated(true);
					// Ensure we have latest form data persisted
					localStorage.setItem("guestCheckout", JSON.stringify(stripBlobs(checkoutFormData)));
					// Close modal and place the order immediately
					setAuthModalOpen(false);
					await handleRequestOrder();
				}}
				onRegisterAndOrder={async () => {
					// Prevent redirect while cart context updates
					setIsAuthenticating(true);
					setRecentlyAuthenticated(true);
					localStorage.setItem("guestCheckout", JSON.stringify(stripBlobs(checkoutFormData)));
					setAuthModalOpen(false);
					await handleRequestOrder();
				}}
				onSuccess={async () => {
					console.log("Auth success callback triggered");
					setIsAuthenticating(true); // Set authentication flag to prevent redirect
					setRecentlyAuthenticated(true); // Mark as recently authenticated
					setNavigateTo(""); // Clear any pending navigation to prevent redirection
					setAuthModalOpen(false);
					
					try {
						// After successful auth, merge guest cart with server cart and refresh
						await mergeGuestCartAndRefresh();
						// Restore checkout form data from localStorage and update with user info
						restoreCheckoutFormData();
						
						console.log("Authentication process completed. Form data:", checkoutFormData);
						console.log("Cart items after merge:", cartItems.length);
						
						// Clear the recently authenticated flag after a delay
						setTimeout(() => {
							setRecentlyAuthenticated(false);
						}, 5000); // 5 seconds buffer to ensure cart is properly loaded
					} finally {
						// Reset authentication flag after cart merging is complete
						setIsAuthenticating(false);
					}
				}}
			/>
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
											readOnly={false}
											value={checkoutFormData.email}
											onChange={handleChange}
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
													{(() => {
														const url = safeCreateObjectURL(designFile);
														if (url) {
															return (
																<img className="w-36 h-36 rounded-md" src={url} alt="Design" />
															);
														}
														// if a string URL somehow exists
														if (typeof designFile === "string") {
															return (
																<img className="w-36 h-36 rounded-md" src={designFile} alt="Design" />
															);
														}
														return (
															<div className="w-36 h-36 rounded-md bg-gray-200 flex items-center justify-center text-xs text-gray-600">
																Preview unavailable
															</div>
														);
													})()}

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
																												{/* error text */}
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
																	{courier?.name || "Courier"}
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
											value={
												checkoutFormData.staffId !== null
													? String(checkoutFormData.staffId)
													: undefined
											}
											onValueChange={(staffId) => {
												setCheckoutFormData((prevData) => ({
													...prevData,
													staffId: Number(staffId),
												}));
											}}
										>
											<SelectTrigger className="w-[220px]" error={errors.staffId ? true : false}>
												<SelectValue placeholder="Select a staff member" />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													{staff
														.filter((staffItem) => staffItem.role?.toLowerCase() === "agent")
														.map((staffItem, index) => (
															<SelectItem
																key={index}
																value={staffItem.staffId.toString()}
															>
																{staffItem?.name || "Staff"}
															</SelectItem>
														))}
												</SelectGroup>
											</SelectContent>
										</Select>
										{/* Staff selection is optional; no error needed */}
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
												Return & Refund Policy
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
														{item.product?.name || "Product"}
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
													{(item.productVariant?.variantDetails || []).map(
														(detail, idx2) => {
															const meta = getVariationMeta(
																detail as unknown as DetailLike,
																item.product
																	?.variations as unknown as ProductVariationSafe[]
															);
															return (
																<p
																	className="font-semibold text-gray"
																	key={idx2}
																>
																	{meta.name}: {meta.value} {meta.unit}
																</p>
															);
														}
													)}
												</div>
											</div>

											<div className="flex flex-col justify-between items-end">
												<div className="text-right">
													<h5 className="text-lg font-semibold text-black">
														{currencySymbol}{" "}
														{formatPrice(Number(item?.price || 0))}
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

							<div className="form-group flex flex-col items-start justify-start my-6 gap-2">
								{/* <div className="">
									   <h3 className="text-base font-medium">Payment in Advance <span className="text-xs font-normal text-gray-500">(25% payment required to confirm order)</span></h3>
								</div> */}
									

								{errors.paymentMethod && (
									<p className="text-rose-500 font-semibold text-sm">
										{errors.paymentMethod}
									</p>
								)}
							</div>

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
								disabled={
									!isAgreeTerms ||
									!cartItems.length ||
									!checkoutFormData.name.trim() ||
									!checkoutFormData.email.trim() ||
									!checkoutFormData.phone.trim() ||
									!checkoutFormData.billingAddress.trim() ||
									checkoutFormData.deliveryMethod === "" ||
									(checkoutFormData.deliveryMethod === "courier" &&
										(!checkoutFormData.courierId ||
											!checkoutFormData.courierAddress.trim()))
								}
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
