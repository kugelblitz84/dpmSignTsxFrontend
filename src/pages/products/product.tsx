import { Link, useNavigate, useParams } from "react-router-dom";
import ProductReview from "@/pages/products/product-review";
import ProductAttributes from "@/pages/products/product-attributes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
// Swiper removed for thumbnails (using custom scroll implementation)
import ProductCard from "@/components/product-card";
import { Minus, Plus, Tag as TagIcon } from "lucide-react";
// import { useIsMobile } from "@/hooks/use-mobile"; // no longer needed for thumbnails
import routes from "@/routes";
import {
	ProductImageProps,
	ProductProps,
	useProduct,
	VariantProps,
} from "@/hooks/use-product";
import { currencyCode, currencySymbol } from "@/config";
import { useEffect, useState, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateSquareFeet, formatPrice } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { cartService } from "@/api";
import { useCart } from "@/hooks/use-cart";
import { LoadingOverlay } from "@mantine/core";


const Product = () => {
	const { token, customer } = useAuth();
	const {
		fetchCartItems,
		loading: cartLoading,
		setLoading: setCartLoading,
	} = useCart();
	const { toast } = useToast();
	// const isMobile = useIsMobile(); // not needed after refactor
	const navigate = useNavigate();
	const { slug } = useParams();
	const { products, randomProducts, setExcludeProductId, loading } =
		useProduct();
	const [product, setProduct] = useState<ProductProps | null>(null);

	// Refs / layout measurements
	// headerRef kept in case we need future measurements of breadcrumb area (not used for sticky now)
	const headerRef = useRef<HTMLDivElement | null>(null);
	const [navHeight, setNavHeight] = useState<number>(0);

	// (Removed dynamic margin logic; attributes & reviews moved directly beneath images to remove structural gap)

	const [activeProductImage, setActiveProductImage] =
		useState<ProductImageProps | null>(null);
	// Track natural dimensions to adapt layout for any aspect ratio (mobile & narrow viewports)
	const [imageMeta, setImageMeta] = useState<
		| {
			w: number;
			h: number;
			orientation: "portrait" | "landscape" | "square";
		}
		| null
	>(null);
	const [selectedVariationItems, setSelectedVariationItems] = useState<{
		[key: string]: number | null;
	}>({});
	const [matchedVariant, setMatchedVariant] = useState<
		VariantProps | undefined
	>(undefined);
	const [productQuantity, setProductQuantity] = useState<number>(
		product?.minOrderQuantity || 1
	);
	const [totalPrice, setTotalPrice] = useState<number>(product?.basePrice || 0);
	const [designCharge, setDesignCharge] = useState<number>(
		product?.basePrice && product?.basePrice < 1000 ? 250 : 0
	);
	const [discountPercentage, setDiscountPercentage] = useState<number>(0);
	// Width dimensions
	const [widthFeet, setWidthFeet] = useState<number>(0);
	const [widthInches, setWidthInches] = useState<number>(0);
	// Height dimensions  
	const [heightFeet, setHeightFeet] = useState<number>(0);
	const [heightInches, setHeightInches] = useState<number>(0);
	
	// Calculate total dimensions in inches for backward compatibility
	const width = widthFeet * 12 + widthInches;
	const height = heightFeet * 12 + heightInches;
	
	const [sqFeet, setSqFeet] = useState<number>(
		calculateSquareFeet(width, height, "inches")
	);

	useEffect(() => {
		setSqFeet(calculateSquareFeet(width, height, "inches"));
	}, [width, height]);

	// Handles variation selection
	const handleVariationChange = (
		variationName: string,
		variationItemId: number
	) => {
		setSelectedVariationItems((prev) => ({
			...prev,
			[variationName]: variationItemId,
		}));
	};

	useEffect(() => {
		setMatchedVariant(
			product?.variants.find((variant) =>
				variant.variantDetails.every((detail) =>
					Object.values(selectedVariationItems).includes(detail.variationItemId)
				)
			)
		);
	}, [selectedVariationItems, product]); // Added product as dependency as it contains variants

	const calculateFinalPricing = (
		product: ProductProps,
		matchedVariant: VariantProps,
		basis: number
	): {
		basis: number;
		basePriceTotal: number | null;
		appliedDiscountPercentage: number | null;
		discountedPriceTotal: number | null;
	} => {
		const {
			basePrice,
			discountStart,
			discountEnd,
			discountPercentage: maxDiscount,
		} = product;

		if (
			!basePrice ||
			!matchedVariant ||
			discountStart === null ||
			discountEnd === null ||
			maxDiscount === null
		)
			// Added matchedVariant check and null checks for discount properties
			return {
				basis,
				basePriceTotal: null,
				appliedDiscountPercentage: null,
				discountedPriceTotal: null,
			};

		// Calculate the effective base price per unit/sq.ft including additional variant price
		const effectiveBasePricePerUnit =
			basePrice + (matchedVariant.additionalPrice || 0);

		// Base total price: Multiply the effective base price per unit by the basis (quantity or sqFeet)
		const basePriceTotal = parseFloat(
			(basis * effectiveBasePricePerUnit).toFixed(2)
		);

		// Calculate linear discount percentage
		let appliedDiscountPercentage: number = 0;
		if (basis >= discountStart) {
			if (basis <= discountEnd) {
				// inclusive scaling: discount applies starting exactly at discountStart
				const rangeLength = discountEnd - discountStart + 1;
				const stepIndex = basis - discountStart + 1;
				appliedDiscountPercentage = parseFloat(
					((maxDiscount * stepIndex) / rangeLength).toFixed(2)
				);
			} else {
				appliedDiscountPercentage = parseFloat(maxDiscount.toString());
			}
		}

		// Compute discounted total
		const discountedPriceTotal = Math.floor(
			parseFloat(
				(basePriceTotal * (1 - appliedDiscountPercentage / 100)).toFixed(2)
			)
		);

		return {
			basis,
			basePriceTotal,
			appliedDiscountPercentage,
			discountedPriceTotal,
		};
	};

	useEffect(() => {
		if (product && matchedVariant) {
			// The `basis` for calculateFinalPricing depends on `pricingType`
			let basisForPricing: number;
			
			if (product.pricingType === "square-feet") {
				// For square-feet pricing, multiply sqFeet by quantity
				basisForPricing = sqFeet * productQuantity;
			} else {
				// For flat pricing, just use quantity
				basisForPricing = productQuantity;
			}

			const { appliedDiscountPercentage, discountedPriceTotal } =
				calculateFinalPricing(product, matchedVariant, basisForPricing);

			if (discountedPriceTotal === null) {
				// Handle case where pricing couldn't be calculated
				setTotalPrice(0);
				setDiscountPercentage(0);
				setDesignCharge(0);
				return;
			}

			setDiscountPercentage(appliedDiscountPercentage || 0);

			// Design charge calculation now uses discountedPriceTotal
			const newDesignCharge =
				discountedPriceTotal > 1000
					? 0
					: product?.basePrice && product?.basePrice < 1000
					? 250
					: 0;

			setDesignCharge(newDesignCharge);

			// Total price calculation now directly uses discountedPriceTotal
			setTotalPrice(Math.floor(discountedPriceTotal + newDesignCharge));
		} else if (product) {
			// If product is loaded but no variant is matched, show base price initially
			// You might want to disable "Add to Cart" until a variant is selected.
			setTotalPrice(product.basePrice || 0);
			setDiscountPercentage(0);
			setDesignCharge(
				product?.basePrice && product?.basePrice < 1000 ? 250 : 0
			);
		} else {
			// Reset if product is null (e.g., on initial load or not found)
			setTotalPrice(0);
			setDiscountPercentage(0);
			setDesignCharge(0);
		}
	}, [
		selectedVariationItems,
		productQuantity,
		sqFeet,
		product,
		matchedVariant,
	]);

	useEffect(() => {
		if (loading || products.length === 0) return; // Ensure products are loaded

		const foundProduct = products.find((p) => p.slug === slug);

		if (!foundProduct) {
			navigate(routes.notFound.path);
			return;
		}

		setProduct(foundProduct); // Set the product state
		setExcludeProductId(foundProduct.productId); // Exclude the product from random products
	setActiveProductImage(foundProduct?.images?.[0] ?? null);
		setDesignCharge(
			foundProduct?.basePrice && foundProduct?.basePrice < 1000 ? 250 : 0
		);
		setProductQuantity(foundProduct?.minOrderQuantity || 1);
	}, [products, loading, slug, navigate, setExcludeProductId]);

	useEffect(() => {
		if (product) {
			document.title = `${product?.name} - Dhaka Plastic & Metal`;

			// Update meta description
			const metaDescription = document.querySelector(
				"meta[name='description']"
			);
			if (metaDescription) {
				metaDescription.setAttribute("content", product?.description);
			} else {
				// If meta tag doesn't exist, create one
				const metaTag = document.createElement("meta");
				metaTag.name = "description";
				metaTag.content = product?.description;
				document.head.appendChild(metaTag);
			}
		}
	}, [product]);

	// Measure the global site navigation/header height so the order card sticks just beneath it
	useEffect(() => {
		const measureNav = () => {
			// Attempt common selectors; fallback to first header tag
			const el =
				(document.querySelector('[data-site-header]') as HTMLElement) ||
				(document.querySelector('header') as HTMLElement) ||
				undefined;
			if (el) setNavHeight(el.getBoundingClientRect().height);
		};
		measureNav();
		window.addEventListener('resize', measureNav);
		return () => window.removeEventListener('resize', measureNav);
	}, []);

	const handleAddToCart = async () => {
		setCartLoading(true);
		try {
			if (product && productQuantity < product?.minOrderQuantity) {
				throw new Error(
					`You must order minimum ${product?.minOrderQuantity} pieces.`
				);
			} else if (product && matchedVariant && totalPrice && productQuantity) {
				if (!token || !customer) {
					// Guest: Add to localStorage cart
					const guestCart = JSON.parse(
						localStorage.getItem("guestCart") || "[]"
					);
					guestCart.push({
						productId: product.productId,
						product,
						productVariantId: matchedVariant.productVariantId,
						productVariant: matchedVariant,
						quantity: productQuantity,
						size: product.pricingType === "square-feet" ? sqFeet : null,
						widthInch:
							product.pricingType === "square-feet"
								? width // width is already in inches
								: null,
						heightInch:
							product.pricingType === "square-feet"
								? height // height is already in inches
								: null,
						price: totalPrice,
						createdAt: new Date(),
						deletedAt: null,
					});
					localStorage.setItem("guestCart", JSON.stringify(guestCart));
					// Refresh cart context to reflect guest cart changes without reload
					await fetchCartItems();
					toast({
						description: "Added to cart! (Guest)",
						variant: "success",
						duration: 5000,
					});
					setCartLoading(false);
					return;
				}
				// Authenticated: Add to server cart
				const response = await cartService.addItemToCart(
					token,
					customer.customerId,
					product.productId,
					matchedVariant.productVariantId,
					productQuantity,
					product.pricingType === "square-feet" ? sqFeet : null,
					product.pricingType === "square-feet"
						? width // width is already in inches
						: null,
					product.pricingType === "square-feet"
						? height // height is already in inches
						: null,
					totalPrice
				);
				toast({
					description: response.message,
					variant: response.status === 201 ? "success" : "default",
					duration: 10000,
				});
				setSelectedVariationItems({});
				setMatchedVariant(undefined);
				setTotalPrice(product?.basePrice || 0);
				setDiscountPercentage(0);
				setDesignCharge(
					product?.basePrice && product?.basePrice < 1000 ? 250 : 0
				);
				setWidthFeet(0);
				setWidthInches(0);
				setHeightFeet(0);
				setHeightInches(0);
				setSqFeet(calculateSquareFeet(0, 0, "inches"));
				setProductQuantity(product?.minOrderQuantity || 1);
				await fetchCartItems();
			}
		} catch (err: unknown) {
			setCartLoading(false);
			const message = err instanceof Error ? err.message : String(err);
			toast({
				description: message,
				variant: "destructive",
				duration: 10000,
			});
		} finally {
			setCartLoading(false);
		}
	};

	return (
		<section className="py-8 xl:py-8 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 3xl:px-32 4xl:px-40">
			{/* header */}
			<div ref={headerRef} className="row pb-5 max-w-8xl mx-auto">
				{!loading && (
					<Breadcrumb className="pb-5">
						<BreadcrumbList>
							<BreadcrumbItem>
								<Link to={routes.home.path} className="text-base xl:text-lg">
									<BreadcrumbLink className="font-medium hover:text-skyblue transition-all duration-300">
										Home
									</BreadcrumbLink>
								</Link>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="font-medium" />
							<BreadcrumbItem>
								<Link
									to={routes.products.path}
									className="text-base xl:text-lg"
								>
									<BreadcrumbLink className="font-medium hover:text-skyblue transition-all duration-300">
										Products
									</BreadcrumbLink>
								</Link>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="font-medium" />
							<BreadcrumbItem>
								<Link
									to={`${routes.products.path}/${product?.slug}`}
									className="text-base xl:text-lg"
								>
									<BreadcrumbLink className="font-medium hover:text-skyblue transition-all duration-300">
										{product?.name} {/* Changed from product?.slug */}
									</BreadcrumbLink>
								</Link>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				)}

				{loading && (
					<div className="pb-5 flex items-center gap-2">
						<Skeleton className="h-6 w-16" />
						<Skeleton className="h-4 w-4 rounded-full" />
						<Skeleton className="h-6 w-24" />
						<Skeleton className="h-4 w-4 rounded-full" />
						<Skeleton className="h-6 w-32" />
					</div>
				)}

				{!loading && (
					<>
						<h3 className="text-2xl xl:text-3xl font-semibold">
							{product?.name}
						</h3>


					</>
				)}
				{loading && <Skeleton className="h-9 w-2/3 max-w-md mb-4" />}

				<div className="w-full pt-2 flex items-start flex-wrap gap-4">
					<div className="py-2 flex items-start xl:items-center justify-start gap-4 flex-col xl:flex-row flex-wrap">
						{!loading && product && (
							<div className="flex flex-col xl:flex-row gap-3 w-full">
								<div className="flex items-center gap-2 flex-wrap">
									<h5 className="min-w-fit text-base xl:text-lg font-medium">Product SKU:</h5>
									<Badge>{product?.sku}</Badge>
								</div>
								{product?.tags && product.tags.length > 0 && (
									<div className="flex items-center gap-2 flex-wrap">
										<span className="flex items-center gap-1 text-sm xl:text-base font-medium text-gray-700">
											<TagIcon className="w-4 h-4 text-skyblue" />
											<span>Tags:</span>
										</span>
										{product.tags.map((t) => (
											<Badge key={t.tagId} variant="secondary" className="text-xs py-1 px-2">
												{t.tag}
											</Badge>
										))}
									</div>
								)}
							</div>
						)}

						{loading && (
							<>
								<Skeleton className="h-6 w-28" />
								<Skeleton className="h-8 w-24 rounded-full" />
							</>
						)}
					</div>
				</div>
			</div>

			{/* Separator between header and main content */}
			<div className="w-full max-w-8xl mx-auto">
				<Separator className="bg-gray-200 h-px" />
			</div>

			{/* Main Product Content Area */}
			<div className="row xl:relative pt-8 pb-10 max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-7 place-items-start items-start justify-between gap-4 lg:gap-6 xl:gap-8">
				{/* Left Column: Images + Description (normal scroll) */}
			<div className="w-full md:grid md:grid-cols-5 gap-4 lg:col-span-3 xl:col-span-4">
					{!loading && product && (
						<>
						{/* Main Product Image (first) */}
						<div className="w-full col-span-4 order-1 md:order-none">
								<Dialog>
									<DialogTrigger asChild>
										<div
											className="relative w-full rounded-md cursor-pointer bg-white border border-gray/20 p-2 lg:max-w-[500px] xl:max-w-[580px] 2xl:max-w-[650px] 3xl:max-w-[700px] mx-auto"
										>
											{/* Container maintains visibility before image load */}
										<div className="relative w-full flex items-center justify-center overflow-hidden min-h-[240px] sm:min-h-[260px] md:min-h-[320px]">
												{activeProductImage?.imageUrl ? (
													<img
														loading="lazy"
														src={activeProductImage.imageUrl}
														alt={product?.name || 'Product image'}
														onLoad={(e) => {
															const w = e.currentTarget.naturalWidth;
															const h = e.currentTarget.naturalHeight;
															let orientation: 'portrait' | 'landscape' | 'square' = 'square';
															if (w > h) orientation = 'landscape';
															else if (h > w) orientation = 'portrait';
															setImageMeta({ w, h, orientation });
														}}
													className={(() => {
														if (!imageMeta) return 'object-contain max-h-[70vh] w-full';
														if (imageMeta.orientation === 'portrait') return 'object-contain h-[70vh] w-auto max-w-full';
														if (imageMeta.orientation === 'landscape') return 'object-contain w-full h-auto max-h-[70vh]';
														return 'object-contain w-full h-auto max-h-[70vh]';
													})()}
												/>
												) : (
													<div className="w-full h-full flex items-center justify-center text-xs text-gray bg-gray/5 animate-pulse">
														Image unavailable
													</div>
												)}
											</div>
										</div>
									</DialogTrigger>
									<DialogContent className="max-w-full w-full xl:w-[1000px] h-[85vh] overflow-hidden flex items-center justify-center">
										{activeProductImage?.imageUrl && (
											<img
												loading="eager"
												src={activeProductImage.imageUrl}
												alt={product?.name || 'Product image enlarged'}
												className="object-contain max-h-full max-w-full"
											/>
										)}
									</DialogContent>
								</Dialog>
							</div>

						{/* Thumbnails: horizontal strip on mobile, vertical list on desktop */}
						<div className="w-full mt-2 md:mt-0 md:col-span-1 md:row-span-full order-2 md:order-none">
							{/* Mobile horizontal scroll */}
							<div className="flex md:hidden gap-2 overflow-x-auto pb-1 -mx-1 px-1" aria-label="Product image thumbnails">
								{product.images.map((img, idx) => (
									<button
										key={idx}
										onClick={() => setActiveProductImage(img)}
										className={`shrink-0 rounded-md border-2 transition-all duration-300 aspect-square w-20 bg-white flex items-center justify-center ${activeProductImage?.imageUrl === img.imageUrl ? 'border-skyblue' : 'border-transparent hover:border-skyblue'}`}
										aria-label={`Thumbnail ${idx + 1}`}
									>
										<img
											src={img.imageUrl}
											alt={product?.name || 'Thumbnail'}
											className="w-full h-full object-cover object-center"
										/>
									</button>
								))}
							</div>

							{/* Desktop vertical stack (simple scroll if overflow) */}
							<div className="hidden md:flex md:flex-col gap-2 max-h-[600px] overflow-y-auto pr-1" aria-label="Product image thumbnails vertical">
								{product.images.map((img, idx) => (
									<button
										key={idx}
										onClick={() => setActiveProductImage(img)}
										className={`rounded-md border-2 transition-all duration-300 aspect-square w-20 md:w-24 bg-white flex items-center justify-center ${activeProductImage?.imageUrl === img.imageUrl ? 'border-skyblue' : 'border-transparent hover:border-skyblue'}`}
										aria-label={`Thumbnail ${idx + 1}`}
									>
										<img
											src={img.imageUrl}
											alt={product?.name || 'Thumbnail'}
											className="w-full h-full object-cover object-center"
										/>
									</button>
								))}
							</div>
						</div>
						</>
					)}

					{loading && (
						<>
							{/* Image Thumbnails Skeleton */}
							<div className="w-full h-full flex flex-row md:flex-col gap-2">
								{Array(5)
									.fill(0)
									.map((_, index) => (
										<Skeleton
											key={index}
											className="w-20 h-20 xl:w-36 xl:h-36 rounded-md"
										/>
									))}
							</div>

							{/* Main Image Skeleton */}
							<div className="w-full col-span-4">
								<Skeleton className="w-full aspect-square max-w-[800px] rounded-md" />
							</div>
						</>
					)}

				{/* Product Description - placed under images */}
				<div className="w-full md:col-span-5 mt-6 order-3">
					{!loading && product && (
						<div className="w-full bg-gray-50/50 rounded-lg p-4 border border-gray-100">
							<ProductAttributes product={product} />
						</div>
					)}
					{loading && (
						<div className="w-full bg-gray-50/50 rounded-lg p-4 border border-gray-100">
							{Array(3)
								.fill(0)
								.map((_, index) => (
									<div key={index} className="mb-4">
										<Skeleton className="h-7 w-40 mb-3" />
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											{Array(4)
												.fill(0)
												.map((_, attrIndex) => (
													<div
														key={attrIndex}
														className="flex items-center gap-2"
													>
														<Skeleton className="h-5 w-32" />
														<Skeleton className="h-5 w-20" />
													</div>
												))}
										</div>
									</div>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Right Column: Product Price Card (sticky on large screens) */}
				<div
					className="w-full lg:col-span-2 xl:col-span-3 mt-4 lg:mt-0 lg:sticky lg:self-start"
					style={{ top: navHeight ? navHeight + 16 : 96 }}
				>
					<div className="w-full xl:max-w-full xl:mx-auto">
						<Card className="shadow-lg">
							{cartLoading && (
								<>
									<LoadingOverlay
										visible={cartLoading}
										zIndex={10}
										overlayProps={{ radius: "xs", blur: 1 }}
									/>
								</>
							)}

							<CardHeader>
								<div className="flex items-start justify-start flex-wrap gap-5 py-2">
									<div className="flex items-start justify-center flex-col gap-2">
										{!loading && product && (
											<>
												{/* Displaying effective base price per unit */}
												<h3 className="text-2xl xl:text-4xl font-semibold">
													{currencySymbol}{" "}
													{formatPrice(
														product.basePrice +
															(matchedVariant?.additionalPrice || 0)
													)}
												</h3>
												<span className="text-gray font-manrope text-sm xl:text-base font-medium">
													Minimum Order Quantity {product?.minOrderQuantity}{" "}
													pieces
												</span>
											</>
										)}

										{loading && (
											<>
												<Skeleton className="h-8 w-32" />
												<Skeleton className="h-5 w-48" />
											</>
										)}
									</div>
								</div>

								<Separator orientation="horizontal" className="bg-gray/30" />
							</CardHeader>

							<CardContent>
								{product && product.variations.length > 0 && (
									<div className="py-2">
										{!loading && (
											<h4 className="text-base xl:text-xl font-medium">
												Variation
											</h4>
										)}

										{loading && <Skeleton className="h-7 w-28 mb-4" />}
										<div className="w-full flex items-center justify-between py-2">
											{!loading && (
												<p className="text-sm xl:text-base font-semibold">
													Total options:{" "}
													{product.variations.map((productVariation, index) => (
														<span key={index} className="font-bold">
															{productVariation?.variationItems.length}{" "}
															{productVariation?.name}
															{index < product.variations.length - 1
																? ", "
																: ""}
														</span>
													))}
												</p>
											)}

											{loading && <Skeleton className="h-6 w-52" />}
										</div>

										{!loading &&
											product.variations.map((productVariation, index) => (
												<div
													key={productVariation.variationId}
													className="w-full py-2 flex items-start justify-center gap-2 flex-col flex-wrap"
												>
													<h5 className="text-base xl:text-lg font-medium">
														Step {index + 1}:{" "}
														<span className="font-normal">
															Select {productVariation?.name}
														</span>
													</h5>
													<div className="w-full flex items-start justify-start gap-2 flex-wrap">
														{productVariation?.variationItems.map(
															(productVariationItem) => (
																<Button
																	key={productVariationItem.variationItemId}
																	size="sm"
																	variant={
																		selectedVariationItems[
																			productVariation.name
																		] === productVariationItem.variationItemId
																			? "default"
																			: "outline"
																	}
																	onClick={() =>
																		handleVariationChange(
																			productVariation.name,
																			productVariationItem.variationItemId
																		)
																	}
																>
																	{productVariationItem.value}{" "}
																	{productVariation.unit}
																</Button>
															)
														)}
													</div>
												</div>
											))}

										{loading &&
											Array(2)
												.fill(0)
												.map((_, index) => (
													<div
														key={index}
														className="w-full py-2 flex items-start justify-center gap-2 flex-col flex-wrap"
													>
														<Skeleton className="h-6 w-40 mb-2" />
														<div className="w-full flex items-start justify-start gap-2 flex-wrap">
															{Array(4)
																.fill(0)
																.map((_, btnIndex) => (
																	<Skeleton
																		key={btnIndex}
																		className="h-9 w-20 rounded-md"
																	/>
																))}
														</div>
													</div>
												))}

										{/* product size dimension if the product is square feet pricing type */}
										{product.pricingType === "square-feet" && (
											<div className="flex flex-col gap-4 items-start py-2 pb-3">
												<div className="w-full flex gap-4 items-start justify-between py-2 pb-3">
													<h5 className="flex-1 text-sm xl:text-lg font-medium">
														Step {product.variations.length + 1}:{" "}
														<span className="font-normal">
															Select Size Dimension <br /> (Width × Height)
														</span>
													</h5>
												</div>

												<div className="w-full flex flex-col gap-5 sm:gap-4 items-stretch">
													{/* Responsive stacked layout: vertical on small, horizontal on sm+ */}
													<div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 w-full">
														{/* Width Group */}
														<div className="flex flex-col gap-2 w-full">
															<label className="text-xs font-medium text-muted-foreground tracking-wide uppercase">Width (Feet & Inches)</label>
															<div className="flex items-center gap-2 w-full max-sm:justify-between">
																<div className="flex items-center gap-1 w-full">
																	<Input
																		 type="number"
																		 min={0}
																		 className="input-type-number w-full max-w-[90px]"
																		 value={widthFeet === 0 ? "" : widthFeet}
																		 onChange={(e) => setWidthFeet(parseInt(e.target.value) || 0)}
																		 placeholder="0"
																	/>
																	<span className="text-xs text-muted-foreground">ft</span>
																</div>
																<div className="flex items-center gap-1 w-full">
																	<Input
																		 type="number"
																		 min={0}
																		 max={11}
																		 className="input-type-number w-full max-w-[90px]"
																		 value={widthInches === 0 ? "" : widthInches}
																		 onChange={(e) => {
																		 	const value = parseInt(e.target.value) || 0;
																		 	if (value >= 12) {
																		 		const additionalFeet = Math.floor(value / 12);
																		 		const remainingInches = value % 12;
																		 		setWidthFeet(widthFeet + additionalFeet);
																		 		setWidthInches(remainingInches);
																		 	} else {
																		 		setWidthInches(value);
																		 	}
																		 }}
																		 placeholder="0"
																	/>
																	<span className="text-xs text-muted-foreground">in</span>
																</div>
															</div>
														</div> {/* end width group */}

														{/* Height Group */}
														<div className="flex flex-col gap-2 w-full">
															<label className="text-xs font-medium text-muted-foreground tracking-wide uppercase">Height (Feet & Inches)</label>
															<div className="flex items-center gap-2 w-full max-sm:justify-between">
																<div className="flex items-center gap-1 w-full">
																	<Input
																		 type="number"
																		 min={0}
																		 className="input-type-number w-full max-w-[90px]"
																		 value={heightFeet === 0 ? "" : heightFeet}
																		 onChange={(e) => setHeightFeet(parseInt(e.target.value) || 0)}
																		 placeholder="0"
																	/>
																	<span className="text-xs text-muted-foreground">ft</span>
																</div>
																<div className="flex items-center gap-1 w-full">
																	<Input
																		 type="number"
																		 min={0}
																		 max={11}
																		 className="input-type-number w-full max-w-[90px]"
																		 value={heightInches === 0 ? "" : heightInches}
																		 onChange={(e) => {
																		 	const value = parseInt(e.target.value) || 0;
																		 	if (value >= 12) {
																		 		const additionalFeet = Math.floor(value / 12);
																		 		const remainingInches = value % 12;
																		 		setHeightFeet(heightFeet + additionalFeet);
																		 		setHeightInches(remainingInches);
																		 	} else {
																		 		setHeightInches(value);
																		 	}
																		 }}
																		 placeholder="0"
																	/>
																	<span className="text-xs text-muted-foreground">in</span>
																</div>
															</div>
													</div>

													{/* Calculated area */}
													<div className="flex items-center gap-2 text-sm bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 w-full sm:w-auto mt-1">
														<span className="text-muted-foreground">=</span>
														<span className="font-medium">{sqFeet} sq. ft</span>
													</div>
												</div>
											</div>
											</div>
										)}

										{/* Product Quantity */}
										<div className="flex items-center space-x-4 py-2 pb-3">
											{!loading && (
												<>
													<h5 className="text-sm xl:text-lg font-medium">
														Step{" "}
														{product.pricingType === "flat"
															? product.variations.length + 1
															: product.variations.length + 2}
														:{" "}
														<span className="font-normal">Select Quantity</span>
													</h5>
													<div className="w-36 h-auto border-[0.1rem] border-gray/50 hover:border-skyblue transition-all duration-300 px-3 rounded-md relative flex items-center justify-center gap-0">
														<Minus
															size={15}
															className="cursor-pointer transition-all duration-300 hover:text-skyblue"
															onClick={() => {
																if (
																	matchedVariant &&
																	productQuantity > product.minOrderQuantity
																)
																	setProductQuantity(productQuantity - 1);
															}}
														/>
														<Input
															type="number"
															min={product.minOrderQuantity}
															className="input-type-number w-20 py-0 px-0 border-0 text-center pl-0"
															value={productQuantity}
															onChange={(e) => {
																if (
																	matchedVariant &&
																	Number(e.target.value) > 0
																) {
																	setProductQuantity(Number(e.target.value));
																}
															}}
														/>
														<Plus
															size={15}
															className="cursor-pointer transition-all duration-300 hover:text-skyblue"
															onClick={() => {
																if (matchedVariant) {
																	setProductQuantity(productQuantity + 1);
																}
															}}
														/>
													</div>
												</>
											)}
											{loading && (
												<>
													<Skeleton className="h-6 w-40" />
													<Skeleton className="h-10 w-36 rounded-md" />
												</>
											)}
										</div>
									</div>
								)}

								<Separator orientation="horizontal" className="bg-gray/30" />
								<div className="w-full pt-5 flex items-center justify-between flex-col gap-2">
									{/* Unit Price now includes additional variant price */}
									{!loading && product && (
										<div className="w-full flex items-center justify-between flex-wrap">
											<span className="text-base xl:text-lg font-medium">
												Unit Price {currencyCode}
											</span>
											<span className="text-xl font-medium">
												{currencySymbol}{" "}
												{formatPrice(
													product.basePrice +
														(matchedVariant?.additionalPrice || 0)
												)}
											</span>
										</div>
									)}
									{loading &&
										product &&
										Array(2)
											.fill(0)
											.map((_, index) => (
												<div
													key={index}
													className="w-full flex items-center justify-between flex-wrap"
												>
													<Skeleton className="h-6 w-32" />
													<Skeleton className="h-6 w-20" />
												</div>
											))}

									{/* Removed "Additional Price" display */}
									{/* <div className="w-full flex items-center justify-between flex-wrap">
                                        {!loading && product && (
                                            <>
                                                <span className="text-base xl:text-lg font-medium">
                                                    Additional Price {currencyCode}
                                                </span>
                                                <span className="text-xl font-medium">
                                                    {currencySymbol}{" "}
                                                    {matchedVariant?.additionalPrice
                                                        ? formatPrice(matchedVariant?.additionalPrice)
                                                        : 0}
                                                </span>
                                            </>
                                        )}
                                        {loading && (
                                            <>
                                                <Skeleton className="h-6 w-36" />
                                                <Skeleton className="h-6 w-24" />
                                            </>
                                        )}
                                    </div> */}

									<div className="w-full flex items-center justify-between flex-wrap">
										{!loading && product && (
											<>
												<span className="text-base xl:text-lg font-medium">
													Discount %
												</span>
												<span className="text-xl font-medium">
													{discountPercentage}%
												</span>
											</>
										)}
										{loading && (
											<>
												<Skeleton className="h-6 w-36" />
												<Skeleton className="h-6 w-24" />
											</>
										)}
									</div>

									{!loading && product && (
										<div className="w-full flex items-center justify-between flex-wrap">
											<span className="text-base xl:text-lg font-medium">
												Design Charge {currencyCode}
											</span>
											<span className="text-xl font-medium">
												{currencySymbol} {formatPrice(designCharge)}
											</span>
										</div>
									)}

									{!loading && product && (
										<div className="w-full flex items-center justify-between flex-wrap pt-3 mt-3 border-t-[3px] border-gray/30">
											<span className="text-base xl:text-lg font-medium">
												Total Price {currencyCode}
											</span>
											<span className="text-xl font-medium">
												{currencySymbol} {formatPrice(totalPrice)}
											</span>

											<div className="w-full flex items-center justify-between py-2">
												<p className="text-sm xl:text-base font-semibold">
													Shipping charges are negotiable.
												</p>
											</div>
										</div>
									)}
								</div>
							</CardContent>

							<CardFooter className="flex items-start justify-start gap-4">
								{!loading && product && (
									<div className="w-full flex gap-1 xl:gap-3 items-center">
										<Button
											className="w-36 text-sm lg:text-lg lg:w-44 xl:text-xl xl:w-60"
											onClick={() => {
												handleAddToCart();
												navigate(routes.checkout.path);
												window.scrollTo(0, 0);
												toast({
													description: "Redirecting to checkout...",
													variant: "default",
													duration: 2000,
												});
											}}
											disabled={
												!matchedVariant || 
												(product?.pricingType === "square-feet" && (width === 0 || height === 0))
											}
										>
											{product?.pricingType === "square-feet" && (width === 0 || height === 0)
												? "Please add dimensions"
												: "Send Order Request"
											}
										</Button>
										<Button
											className="w-30 text-sm lg:text-lg lg:w-40 xl:text-xl xl:w-52"
											onClick={handleAddToCart}
											disabled={
												!matchedVariant || 
												(product?.pricingType === "square-feet" && (width === 0 || height === 0))
											}
											variant="secondary"
										>
											{product?.pricingType === "square-feet" && (width === 0 || height === 0)
												? "Please add dimensions"
												: "Add to Cart"
											}
										</Button>
									</div>
								)}
								{loading && <Skeleton className="h-10 w-full rounded-md" />}
							</CardFooter>
						</Card>
						</div>
				</div>

				{/* (Bottom section removed; merged above) */}
			</div>

			{/* Reviews moved here (before related products) for mobile-first ordering */}
			<div className="row w-full py-4 lg:py-5 mt-2 h-auto max-w-8xl mx-auto">
				{!loading && product && product.reviews && (
					<>
						<Separator orientation="horizontal" className="bg-gray/30" />
						<ProductReview
							productId={product.productId}
							reviews={product?.reviews}
						/>
					</>
				)}
				{loading && (
					<div className="py-6 space-y-6">
						<div className="flex justify-between items-center">
							<Skeleton className="h-8 w-40" />
							<Skeleton className="h-10 w-32 rounded-md" />
						</div>
						{Array(3)
							.fill(0)
							.map((_, index) => (
								<div key={index} className="p-4 rounded-lg space-y-3">
									<div className="flex items-center gap-3">
										<Skeleton className="h-12 w-12 rounded-full" />
										<div>
											<Skeleton className="h-6 w-32 mb-2" />
											<Skeleton className="h-4 w-20" />
										</div>
									</div>
									<div className="flex gap-1">
										{Array(5)
											.fill(0)
											.map((_, starIdx) => (
												<Skeleton key={starIdx} className="h-4 w-4" />
											))}
									</div>
									<Skeleton className="h-20 w-full" />
								</div>
							))}
					</div>
				)}
			</div>

			{/* related products */}
			<div className="row py-4 lg:py-6 space-y-6 lg:space-y-8 max-w-8xl mx-auto">
				<div className="py-1">
					<h2 className="w-full text-center text-3xl lg:text-4xl font-semibold py-4 relative after:content-[''] after:absolute after:w-20 after:h-[0.3rem] after:rounded-full after:bg-skyblue after:left-[50%] after:-translate-x-1/2 after:-bottom-1 after:transition-all after:duration-300">
						Related Products
					</h2>
				</div>
				<div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 place-items-center md:place-items-start">
					{randomProducts &&
						randomProducts.map((product, index) => (
							<ProductCard key={index} product={product} />
						))}
				</div>
			</div>
		</section>
	);
};

export default Product;
