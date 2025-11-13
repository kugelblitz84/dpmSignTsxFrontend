/* eslint-disable react-refresh/only-export-components */
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
	id?: number; // backend may also send a generic id field
	rating: number;
	description: string;
	comment?: string; // some responses include both description & comment
	status: "published" | "unpublished";
	productId: number;
	customerId: number | null;
	product: {
		name: string;
	};
	customer?: {
		name: string;
		email: string;
	} | null;
	guestName?: string | null;
	guestEmail?: string | null;
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
	const [productPageCache, setProductPageCache] = useState<
		Map<number, ProductProps[]>
	>(new Map());
	const [productPageCacheKey, setProductPageCacheKey] = useState<string>("");

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
	const normalizeProducts = (items: ProductProps[]) =>
		items
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
				reviews: item.reviews || [],
			}))
			.filter((product: ProductProps) => product.isActive === true)
			.sort(
				(a, b) =>
					new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf()
			);

	const fetchProduct = async () => {
		if (loading) return;
		setLoading(true);
		setError(null);
		try {
				const nextCacheKey = `${location.pathname}|${searchTerm}|${limit}`;
				const baseCache =
					productPageCacheKey === nextCacheKey
						? productPageCache
						: new Map<number, ProductProps[]>();
				let cache = new Map(baseCache);
			let metadataResponse = await productService.fetchAllProduct(
				searchTerm,
				1,
				limit
			);
			let resolvedTotalPages = metadataResponse.data.totalPages ?? 1;
			const metaProducts = normalizeProducts(metadataResponse.data.products);
			cache.set(1, metaProducts);

			const requiredCount = Math.max(1, page) * limit;
			const aggregated: ProductProps[] = [];
			for (
				let current = resolvedTotalPages;
				current >= 1 && aggregated.length < requiredCount;
				current--
			) {
				let chunk = cache.get(current);
				if (!chunk) {
					const pageResponse = await productService.fetchAllProduct(
						searchTerm,
						current,
						limit
					);
					resolvedTotalPages =
						pageResponse.data.totalPages ?? resolvedTotalPages;
					chunk = normalizeProducts(pageResponse.data.products);
					cache.set(current, chunk);
				}
				if (chunk.length === 0) {
					continue;
				}
				aggregated.push(...chunk);
			}

			const startIndex = Math.max(0, (Math.max(1, page) - 1) * limit);
			let pagedProducts = aggregated.slice(startIndex, startIndex + limit);
			if (pagedProducts.length === 0 && aggregated.length > 0) {
				pagedProducts = aggregated.slice(-limit);
			}

			setProducts(pagedProducts);
			setTotalPages(Math.max(1, resolvedTotalPages));
			setProductPageCache(cache);
			setProductPageCacheKey(nextCacheKey);
		} catch (err: unknown) {
			const message =
				err instanceof Error ? err.message : "Failed to fetch products.";
			setError(message);
			const status = ((): number | undefined => {
				if (err && typeof err === "object" && "status" in err) {
					const v = (err as Record<string, unknown>).status;
					return typeof v === "number" ? v : undefined;
				}
				return undefined;
			})();
			if (status === 401) {
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
	                    // Ensure reviews is always an array to avoid runtime errors when components call .filter/.length
	                    reviews: item.reviews || [],
				}))
				.filter((product: ProductProps) => product.isActive === true);

			setRandomProducts(updatedProducts);
		} catch (err: unknown) {
			const message =
				err instanceof Error ? err.message : "Failed to fetch products.";
			setError(message);
			const status = ((): number | undefined => {
				if (err && typeof err === "object" && "status" in err) {
					const v = (err as Record<string, unknown>).status;
					return typeof v === "number" ? v : undefined;
				}
				return undefined;
			})();
			if (status === 401) {
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
		} catch (err: unknown) {
			const message =
				err instanceof Error ? err.message : "Failed to fetch product by id.";
			setError(message);
			return null;
		}
	};

	// Fetch product on component mount
	useEffect(() => {
		fetchProduct();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location, searchTerm, page, limit]);

	// Fetch product on component mount
	useEffect(() => {
		fetchRandomProducts();
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
