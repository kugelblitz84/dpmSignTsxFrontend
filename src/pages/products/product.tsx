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
import { Swiper, SwiperSlide } from "swiper/react"; // CORRECTED LINE HERE
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import ProductCard from "@/components/product-card";
import { Minus, Plus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import routes from "@/routes";
import {
	ProductImageProps,
	ProductProps,
	useProduct,
	VariantProps,
} from "@/hooks/use-product";
import { currencyCode, currencySymbol } from "@/config";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateSquareFeet, formatPrice } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { cartService } from "@/api";
import { useCart } from "@/hooks/use-cart";
import { LoadingOverlay } from "@mantine/core";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const Product = () => {
	const { token, customer, logout } = useAuth();
	const {
		fetchCartItems,
		loading: cartLoading,
		setLoading: setCartLoading,
	} = useCart();
	const { toast } = useToast();
	const isMobile = useIsMobile();
	const navigate = useNavigate();
	const { slug } = useParams();
	const { products, randomProducts, setExcludeProductId, loading } =
		useProduct();
	const [product, setProduct] = useState<ProductProps | null>(null);

	const [activeProductImage, setActiveProductImage] =
		useState<ProductImageProps | null>(null);
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
	const [width, setWidth] = useState<number>(12); // Default 12 inches
	const [height, setHeight] = useState<number>(12); // Default 12 inches
	const [unit, setUnit] = useState<"inches" | "feet">("inches");
	const [sqFeet, setSqFeet] = useState<number>(
		calculateSquareFeet(width, height)
	);

	useEffect(() => {
		setSqFeet(calculateSquareFeet(width, height, unit));
	}, [width, height, unit]);

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
			const basisForPricing =
				product.pricingType === "square-feet" ? sqFeet : productQuantity;

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
		setActiveProductImage(foundProduct?.images[0]);
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

	const handleAddToCart = async () => {
		try {
			setCartLoading(true);

			if (product && productQuantity < product?.minOrderQuantity) {
				throw new Error(
					`You must order minimum ${product?.minOrderQuantity} pieces.`
				);
			} else if (product && matchedVariant && totalPrice && productQuantity) {
				if (!token || !customer) {
					throw new Error(
						`Please login or registration to add this product in your cart.`
					);
				}
				const response = await cartService.addItemToCart(
					token,
					customer.customerId,
					product.productId,
					matchedVariant.productVariantId,
					productQuantity,
					product.pricingType === "square-feet" ? sqFeet : null,
					product.pricingType === "square-feet"
						? unit === "feet"
							? width * 12
							: width
						: null,
					product.pricingType === "square-feet"
						? unit === "feet"
							? height * 12
							: height
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
				setWidth(12);
				setHeight(12);
				setSqFeet(calculateSquareFeet(12, 12)); // Recalculate sqFeet with default width/height
				setProductQuantity(product?.minOrderQuantity || 1);
				await fetchCartItems();
			}
		} catch (err: any) {
			setCartLoading(false);
			console.log(err.message);

			if (err.status === 401) {
				toast({
					description: "Session expired. Please login.",
					variant: "destructive",
					duration: 10000,
				});
				logout();
				return;
			}

			toast({
				description: err.message,
				variant: "destructive",
				duration: 10000,
			});
		} finally {
			setCartLoading(false);
		}
	};

	return (
		<section className="py-8 xl:py-16 w-11/12 mx-auto">
			{/* header */}
			<div className="row pb-5">
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
					<h3 className="text-2xl xl:text-3xl font-semibold">
						{product?.name}
					</h3>
				)}
				{loading && <Skeleton className="h-9 w-2/3 max-w-md mb-4" />}

				<div className="w-full pt-2 flex items-start flex-wrap gap-4">
					<div className="py-2 flex items-start xl:items-center justify-center gap-2 flex-col xl:flex-row flex-wrap xl:flex-nowrap">
						{!loading && product && (
							<>
								<h5 className="min-w-fit text-base xl:text-lg font-medium">
									Product SKU:
								</h5>
								<div className="w-full flex items-start justify-start gap-2 flex-wrap">
									<Badge>{product?.sku}</Badge>
								</div>
							</>
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

			{/* Main Product Content Area */}
			<div className="row xl:relative pb-10 grid grid-cols-1 xl:grid-cols-3 place-items-center items-start justify-between gap-0 xl:gap-8">
				{/* Left Column: Images (col-span-2 on xl) */}
				<div className="w-full flex flex-col-reverse md:grid md:grid-cols-5 gap-2 xl:col-span-2">
					{!loading && product && (
						<>
							{/* Images Slider (Thumbnails) */}
							<div className="w-full h-full">
								<Swiper
									spaceBetween={8}
									direction={isMobile ? "horizontal" : "vertical"}
									breakpoints={{
										0: {
											slidesPerView: 5,
										},
										768: {
											slidesPerView: 5,
										},
										1280: {
											slidesPerView: 5,
										},
									}}
								>
									{product?.images.map((image, index) => (
										<SwiperSlide key={index}>
											<div className="flex items-center justify-center rounded-md overflow-hidden border-2 border-transparent hover:border-skyblue cursor-pointer transition-all duration-300">
												<img
													className="w-40 h-20 object-cover object-center"
													onClick={() => setActiveProductImage(image)}
													src={image.imageUrl}
													alt={product?.name}
												/>
											</div>
										</SwiperSlide>
									))}
								</Swiper>
							</div>

							{/* Main Product Image */}
							<div className="w-full col-span-4">
								<Dialog>
									<DialogTrigger asChild>
										<div className="flex items-center justify-center rounded-md overflow-hidden cursor-pointer">
											<img
												className="max-w-full h-auto"
												src={activeProductImage?.imageUrl}
												alt={product?.name}
											/>
										</div>
									</DialogTrigger>
									<DialogContent className="max-w-full w-full xl:w-[1000px] h-[80vh] overflow-auto">
										<div className="mt-0">
											<img
												className="max-w-full h-auto"
												src={activeProductImage?.imageUrl}
												alt={product?.name}
											/>
										</div>
									</DialogContent>
								</Dialog>
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
				</div>

				{/* Right Column: Product Price Card (col-span-1 on xl) */}
				<div className="w-full xl:col-span-1 mt-6 xl:mt-0 xl:sticky top-10 xl:top-32">
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

												<div className="w-full flex gap-4 items-center">
													<div className="flex-1 flex items-center gap-4">
														<div className="flex-1 flex items-center gap-2">
															<Input
																type="number"
																min={unit === "feet" ? 0.08 : 1} // Minimum 1 inch or 0.08 feet
																step={unit === "feet" ? 0.01 : 1}
																className="w-16 input-type-number"
																value={width}
																onChange={(e) => {
																	if (matchedVariant) {
																		setWidth(
																			parseFloat(e.target.value) // Use parseFloat for decimal steps
																		);
																	}
																}}
																placeholder="Width"
															/>
															<span className="text-sm text-muted-foreground">
																×
															</span>
															<Input
																type="number"
																min={unit === "feet" ? 0.08 : 1}
																step={unit === "feet" ? 0.01 : 1}
																className="w-16 input-type-number"
																value={height}
																onChange={(e) => {
																	if (matchedVariant) {
																		setHeight(
																			parseFloat(e.target.value) // Use parseFloat for decimal steps
																		);
																	}
																}}
																placeholder="Height"
															/>
															<ToggleGroup
																type="single"
																value={unit}
																onValueChange={(value) =>
																	value && setUnit(value as "inches" | "feet")
																}
																className="border border-gray/50 rounded-md"
															>
																<ToggleGroupItem
																	value="inches"
																	aria-label="Toggle inches"
																	className="px-3 text-sm"
																>
																	in
																</ToggleGroupItem>
																<ToggleGroupItem
																	value="feet"
																	aria-label="Toggle feet"
																	className="px-3 text-sm"
																>
																	ft
																</ToggleGroupItem>
															</ToggleGroup>
														</div>
														<div className="flex items-center gap-2">
															<span className="text-sm text-muted-foreground">
																=
															</span>
															<span className="font-medium text-sm">
																{sqFeet} sq. ft
															</span>
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
												handleAddToCart().then(() => {
													navigate(routes.checkout.path);
													window.scrollTo(0, 0);
													toast({
														description: "Redirecting to cart...",
														variant: "default",
														duration: 2000,
													});
												});
											}}
											disabled={matchedVariant ? false : true}
										>
											Send Order Request
										</Button>
										<Button
											className="w-30 text-sm lg:text-lg lg:w-40 xl:text-xl xl:w-52"
											onClick={handleAddToCart}
											disabled={matchedVariant ? false : true}
											variant="secondary"
										>
											Add to Cart
										</Button>
									</div>
								)}
								{loading && <Skeleton className="h-10 w-full rounded-md" />}
							</CardFooter>
						</Card>
					</div>
				</div>

				{/* Bottom-Left Column: Product Attributes & Reviews */}
				<div className="w-full xl:col-span-2 mt-10 xl:mt-0 overflow-hidden">
					{!loading && product && <ProductAttributes product={product} />}
					{loading &&
						Array(5)
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

					{/* review product */}
					<div className="w-full py-5 mt-5 h-auto">
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
				</div>
			</div>

			{/* related products */}
			<div className="row py-1 space-y-8">
				<div className="py-1">
					<h2 className="w-full text-center text-3xl lg:text-4xl font-semibold py-4 relative after:content-[''] after:absolute after:w-20 after:h-[0.3rem] after:rounded-full after:bg-skyblue after:left-[50%] after:-translate-x-1/2 after:-bottom-1 after:transition-all after:duration-300">
						Related Products
					</h2>
				</div>
				<div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 place-items-start">
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
