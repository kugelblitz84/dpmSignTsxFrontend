/* eslint-disable react-refresh/only-export-components */
import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
	useCallback,
} from "react";
import { useAuth } from "@/hooks/use-auth";
import { cartService } from "@/api";
import { ProductProps } from "@/hooks/use-product";

export interface CartItemProps {
	cartItemId: number;
	customerId: number;
	productId: number;
	product: ProductProps;
	productVariantId: number;
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
	quantity: number;
	size: number | null;
	widthInch: number | null;
	heightInch: number | null;
	price: number;
	createdAt: Date;
	deletedAt: Date;
}

interface CartContextType {
	cartItems: CartItemProps[];
	setCartItems: React.Dispatch<React.SetStateAction<CartItemProps[]>>;
	loading: boolean;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
	error: string | null;
	fetchCartItems: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [cartItems, setCartItems] = useState<CartItemProps[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const { customer, token } = useAuth();

	const fetchCartItems = useCallback(async () => {
		// Prevent duplicate server fetches, but allow guest refreshes even if loading
		if (loading && token && customer) return;
		setLoading(true);
		setError(null);
		try {
			if (!token || !customer) {
				// Load guest cart from localStorage
				const guest = JSON.parse(localStorage.getItem("guestCart") || "[]");
				type GuestItem = {
					productId: number;
					product: ProductProps;
					productVariantId: number;
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
								variation: { name: string; unit: string };
							};
						}[];
					};
					quantity: number;
					size?: number | null;
					widthInch?: number | null;
					heightInch?: number | null;
					price: number;
					createdAt?: string | number | Date;
				};
				const mapped = (guest as GuestItem[]).map((it, idx: number) => ({
					cartItemId: -(idx + 1),
					customerId: 0,
					productId: it.productId,
					product: it.product,
					productVariantId: it.productVariantId,
					productVariant: it.productVariant,
					quantity: it.quantity,
					size: it.size ?? null,
					widthInch: it.widthInch ?? null,
					heightInch: it.heightInch ?? null,
					price: Number(it.price),
					createdAt: new Date(it.createdAt || Date.now()),
					deletedAt: new Date(0),
				}));
				setCartItems(mapped);
				return;
			}
			const response = await cartService.fetchAllCartItems(
				token,
				customer.customerId
			);

			const updatedCartItems = response.data.cartItems.map(
				(cartItem: CartItemProps) => ({
					...cartItem,
					price: Number(cartItem.price),
					size: cartItem.size && Number(cartItem.size),
				})
			);

			setCartItems(updatedCartItems);
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : String(err);
			setError(message || "Failed to fetch cart items.");
		} finally {
			setLoading(false);
		}
	}, [loading, token, customer]);

	useEffect(() => {
		fetchCartItems();
		// Re-run when auth state changes to swap between guest/server carts
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [token]);

	const value = useMemo(
		() => ({
			cartItems,
			setCartItems,
			loading,
			setLoading,
			error,
			fetchCartItems,
		}),
		[cartItems, loading, error, fetchCartItems]
	);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error("useCart must be used within an CartProvider");
	}
	return context as CartContextType;
};
