import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
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

	const fetchCartItems = async () => {
		if (loading) return;
		setLoading(true);
		setError(null);
		try {
			if (!token || !customer) {
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
		} catch (err: any) {
			setError(err.message || "Failed to fetch cart items.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (token) {
			fetchCartItems();
		} else {
			setCartItems([]);
		}
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
		[cartItems, token, loading, error]
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
