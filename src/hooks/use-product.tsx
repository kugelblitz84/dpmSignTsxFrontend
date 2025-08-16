import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "react-router-dom";
import { productService } from "@/api";
import urlJoin from "url-join";
import { apiStaticURL } from "@/lib/dotenv";

export interface ProductProps {
	productId: number;
	name: string;
	description: string;
	slug: string;
	sku: string;
	basePrice: number;
	minOrderQuantity: number;
	discountStart: number | null;
	discountEnd: number | null;
	discountPercentage: number | null;
	pricingType: "flat" | "square-feet";
	isActive: boolean;
	categoryId: number | null;
	attributes: ProductAttributesProps[];
	variations: VariationProps[];
	variants: VariantProps[];
	images: ProductImageProps[];
	tags: ProductTagProps[];
	reviews: ProductReviewProps[];
	createdAt: Date;
	updatedAt: Date;
}

export interface ProductReviewProps {
	reviewId: number;
	rating: number;
	description: string;
	status: "published" | "unpublished";
	productId: number;
	customerId: number;
	product: {
		name: string;
	};
	customer: {
		name: string;
		email: string;
	};
	createdAt: Date;
	updatedAt: Date;
}

export interface ProductTagProps {
	tagId: number;
	tag: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface VariantProps {
	productVariantId: number;
	productId: number;
	additionalPrice: number;
	variantDetails: VariantDetailProps[];
	createdAt: Date;
	updatedAt: Date;
}

export interface VariantDetailProps {
	productVariationDetailId: number;
	productVariantId: number;
	variationItemId: number;
	variationItem: {
		value: string;
	};
	createdAt: Date;
	updatedAt: Date;
}

export interface VariationProps {
	variationId: number;
	productId: number;
	name: string;
	unit: string;
	variationItems: VariationItemsProps[];
	createdAt: Date;
	updatedAt: Date;
}

export interface VariationItemsProps {
	variationItemId: number;
	variationId: number;
	value: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface ProductVariationsProps {
	productId: number;
	variationItemId: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface ProductImageProps {
	imageId: number;
	imageName: string;
	imageUrl: string;
	productId: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface ProductAttributesProps {
	attributeId?: number;
	property: string;
	description: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface ProductContextProps {
	products: ProductProps[];
	randomProducts: ProductProps[];
	searchTerm: string;
	setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
	page: number;
	setPage: React.Dispatch<React.SetStateAction<number>>;
	totalPages: number;
	limit: number;
	setLimit: React.Dispatch<React.SetStateAction<number>>;
	excludeProductId: number | undefined;
	setExcludeProductId: React.Dispatch<React.SetStateAction<number | undefined>>;
	loading: boolean;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
	error: string | null;
	fetchProduct: () => Promise<void>;
	fetchRandomProducts: () => Promise<void>;
	fetchProductById: (productId: number) => Promise<ProductProps | null>;
}

const ProductContext = createContext<ProductContextProps | null>(null);

const ProductProvider = ({ children }: { children: React.ReactNode }) => {
	const [products, setProducts] = useState<ProductProps[]>([]);
	const [randomProducts, setRandomProducts] = useState<ProductProps[]>([]);
	const [fetchedProducts, setFetchedProducts] = useState<
		Map<number, ProductProps>
	>(new Map());

	const [searchTerm, setSearchTerm] = useState<string>("");
	const [page, setPage] = useState<number>(1);
	const [limit, setLimit] = useState<number>(20);
	const [excludeProductId, setExcludeProductId] = useState<number | undefined>(
		undefined
	);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const { logout } = useAuth();
	const location = useLocation();

	// Fetch product from the API
	const fetchProduct = async () => {
		if (loading) return;
		setLoading(true);
		setError(null);
		try {
			const response = await productService.fetchAllProduct(
				searchTerm,
				page,
				limit
			);
			const updatedProducts = response.data.products
				.map((item: ProductProps) => ({
					...item,
					basePrice: Number(item.basePrice),
					variants: item.variants?.map((variant: VariantProps) => ({
						...variant,
						additionalPrice: Number(variant.additionalPrice),
					})),
					images:
						item.images?.map((image) => ({
							...image,
							imageUrl: urlJoin(
								apiStaticURL,
								"/product-images",
								image.imageName
							),
						})) || [],
				}))
				.filter((product: ProductProps) => product.isActive === true);

			setProducts(updatedProducts);
			setTotalPages(response.data.totalPages);
		} catch (err: any) {
			setError(err.message || "Failed to fetch products.");
			if (err.status === 401) {
				return logout();
			}
		} finally {
			setLoading(false);
		}
	};

	// Fetch random product from the API
	const fetchRandomProducts = async () => {
		if (loading) return;
		setLoading(true);
		setError(null);
		try {
			const response = await productService.fetchRandomProducts(
				5,
				excludeProductId
			);
			const updatedProducts = response.data.products
				.map((item: ProductProps) => ({
					...item,
					basePrice: Number(item.basePrice),
					variants: item.variants?.map((variant: VariantProps) => ({
						...variant,
						additionalPrice: Number(variant.additionalPrice),
					})),
					images:
						item.images?.map((image) => ({
							...image,
							imageUrl: urlJoin(
								apiStaticURL,
								"/product-images",
								image.imageName
							),
						})) || [],
				}))
				.filter((product: ProductProps) => product.isActive === true);

			setRandomProducts(updatedProducts);
		} catch (err: any) {
			setError(err.message || "Failed to fetch products.");
			if (err.status === 401) {
				return logout();
			}
		} finally {
			setLoading(false);
		}
	};

	const fetchProductById = async (
		productId: number
	): Promise<ProductProps | null> => {
		try {
			if (!productId) return null;

			// Check if product already exists in state
			if (fetchedProducts.has(productId)) {
				return fetchedProducts.get(productId) || null;
			}

			const response = await productService.fetchProductById(productId);

			if (!response.data?.product) {
				throw new Error("Invalid product id.");
			}

			response.data.product.images =
				response.data.product.images.map((image: ProductImageProps) => ({
					...image,
					imageUrl: urlJoin(apiStaticURL, "/product-images", image.imageName),
				})) || [];

			const product = response.data.product;

			setFetchedProducts((prev) => new Map(prev).set(productId, product));

			return product;
		} catch (err: any) {
			setError(err.message || "Failed to fetch product by id.");
			return null;
		}
	};

	// Fetch product on component mount
	useEffect(() => {
		fetchProduct();
	}, [location, searchTerm, page, limit]);

	// Fetch product on component mount
	useEffect(() => {
		fetchRandomProducts();
	}, [excludeProductId]);

	// Memoize the context value to avoid unnecessary re-renders
	const value = useMemo(
		() => ({
			products,
			randomProducts,
			searchTerm,
			setSearchTerm,
			totalPages,
			page,
			setPage,
			limit,
			setLimit,
			excludeProductId,
			setExcludeProductId,
			loading,
			setLoading,
			error,
			fetchProduct,
			fetchRandomProducts,
			fetchProductById,
		}),
		[products, loading, error, searchTerm, page, limit]
	);

	return (
		<ProductContext.Provider value={value}>{children}</ProductContext.Provider>
	);
};

export const useProduct = () => {
	const context = useContext(ProductContext);
	if (!context) {
		throw new Error("useProduct must be used within a ProductProvider");
	}
	return context;
};

export default ProductProvider;
