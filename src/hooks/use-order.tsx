import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
	useCallback,
} from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "react-router-dom";
import { orderService } from "@/api";
import urljoin from "url-join";
import { apiStaticURL } from "@/lib/dotenv";

export interface OrderProps {
	orderId: number;
	customerId: number | null;
	customerName: string;
	customerEmail: string;
	customerPhone: string;
	staffId: number;
	billingAddress: string;
	additionalNotes: string;
	method: "online" | "offline";
	status:
		| "order-request-received"
		| "consultation-in-progress"
		| "order-canceled"
		| "awaiting-advance-payment"
		| "advance-payment-received"
		| "design-in-progress"
		| "awaiting-design-approval"
		| "production-started"
		| "production-in-progress"
		| "ready-for-delivery"
		| "out-for-delivery"
		| "order-completed";
	currentStatus: string;
	deliveryDate: Date | null;
	deliveryMethod: "shop-pickup" | "courier";
	paymentMethod: "online-payment" | "cod-payment";
	paymentStatus: "pending" | "partial" | "paid";
	couponId: number | null;
	courierId: number | null;
	courierAddress: string | null;
	orderTotalPrice: number;
	orderItems: OrderItemProps[];
	payments: PaymentProps[];
	images: OrderImageProps[];
	createdAt: Date;
	deletedAt: Date;
}

export interface OrderImageProps {
	imageId: number;
	imageName: string;
	imageUrl: string;
	orderId: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface OrderItemProps {
	productVariantId: number;
	product: {
		productId: number;
		name: string;
		basePrice: number;
		sku: string;
	};
	productVariant: {
		productVariantId: number;
		productId: number;
		additionalPrice: number;
		variantDetails: {
			productVariantDetailId: number;
			productVariantId: number;
			variationItemId: number;
			variationItem: {
				value: string;
				variation: {
					name: string;
					unit: string;
				};
			};
		}[];
	};
	orderItemId: number;
	orderId: number;
	productId: number;
	quantity: number;
	price: number;
	size: number | null;
	widthInch: number | null;
	heightInch: number | null;
	createdAt: Date;
	deletedAt: Date;
}

export interface PaymentProps {
	paymentId: number;
	transactionId: string;
	orderId: number;
	paymentMethod: "cod-payment" | "online-payment";
	amount: number;
	paymentLink: string | null;
	isPaid: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface OrderContextProps {
	orders: OrderProps[];
	loading: boolean;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
	error: string | null;
	fetchOrder: () => Promise<void>;
}

const OrderContext = createContext<OrderContextProps | null>(null);

const OrderProvider = ({ children }: { children: React.ReactNode }) => {
	const [orders, setOrders] = useState<OrderProps[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const { customer, token, logout } = useAuth();
	const location = useLocation();

	// Use useCallback to keep this function stable & prevent extra fetches
	const fetchOrder = useCallback(async () => {
		if (!token || !customer) {
			logout();
			setError("Authentication token is missing.");
			return;
		}
		// if (loading) return;
		setLoading(true);
		setError(null);
		try {
			const response = await orderService.fetchAllOrdersByCustomer(
				token,
				customer.customerId
			);
			const updatedOrders = response.data.orders.map(
				(orderItem: OrderProps) => ({
					...orderItem,
					images:
						orderItem.images?.map((image) => ({
							...image,
							imageUrl: urljoin(apiStaticURL, "/order-images", image.imageName),
						})) || [],
				})
			);
			setOrders(updatedOrders);
		} catch (err: any) {
			setError(err.message || "Failed to fetch orders.");
			if (err.status === 401) logout();
		} finally {
			setLoading(false);
		}
	}, [token, customer, logout]);

	// Only re-run when token, location, or the fetchOrder function changes.
	useEffect(() => {
		if (token) {
			fetchOrder();
		}
	}, [token, location]);

	// Memoize the context value to avoid unnecessary re-renders.
	const value = useMemo(
		() => ({
			orders,
			loading,
			setLoading,
			error,
			fetchOrder,
		}),
		[orders, loading, error]
	);

	return (
		<OrderContext.Provider value={value}>{children}</OrderContext.Provider>
	);
};

export const useOrders = () => {
	const context = useContext(OrderContext);
	if (!context) {
		throw new Error("useOrder must be used within an OrderProvider");
	}
	return context;
};

export default OrderProvider;
