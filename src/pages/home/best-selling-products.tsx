// import ProductImage1 from "@/assets/images/best-selling-product-1.jpg";
// import ProductImage2 from "@/assets/images/best-selling-product-2.jpg";
// import ProductImage3 from "@/assets/images/best-selling-product-3.jpg";
// import ProductImage4 from "@/assets/images/best-selling-product-4.jpg";
// import ProductImage5 from "@/assets/images/best-selling-product-5.jpg";
import { useEffect, useMemo, useState } from "react";
import SectionHeading, {
	SectionHeadingProps,
} from "@/components/section-heading";
import ProductCard from "@/components/product-card";
import { useProduct, ProductProps } from "@/hooks/use-product";
import { useCategory } from "@/hooks/use-category";
import { productService } from "@/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import urlJoin from "url-join";
import { apiStaticURL } from "@/lib/dotenv";
// NOTE: Swiper CSS imports intentionally omitted here (project imports or global styles are used elsewhere)

// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay } from "swiper/modules";
// Swiper CSS imports removed (not in use in this component currently)

// import ProductCard from "@/components/product-card";

// interface Product {
// 	id: string;
// 	title: string;
// 	description: string;
// 	img: string;
// 	category: string;
// }

type BestByCategoryItem = ProductProps & { categoryId: number | null };

const BestSellingProducts = () => {
	const sectionHeadingProp: SectionHeadingProps = {
		title: "Our Best Selling Products",
	};

	const { products } = useProduct();
	const { categories } = useCategory();
	const [bestSelling, setBestSelling] = useState<BestByCategoryItem[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [slidesToShow, setSlidesToShow] = useState<number>(1);

	useEffect(() => {
		let cancelled = false;
		const run = async () => {
			setLoading(true);
			setError(null);
			try {
				const res = await productService.fetchBestSellingByCategory(1);
				// Support both shapes: { products: [...] } or already array
				const productsArr: unknown = (res as any)?.products ?? res;
				if (Array.isArray(productsArr) && productsArr.length > 0) {
					// Normalize incoming products to ensure required arrays and image URLs exist
					const normalized = (productsArr as any[]).map((p) => ({
						...p,
						images: (Array.isArray(p.images) ? p.images : []).map((img: any) => ({
							...img,
							imageUrl: img?.imageUrl || (img?.imageName ? urlJoin(apiStaticURL, "/product-images", img.imageName) : undefined),
						})),
						reviews: Array.isArray(p.reviews) ? p.reviews : [],
						categoryId: p.categoryId ?? null,
					}));
					if (!cancelled) setBestSelling(normalized as BestByCategoryItem[]);
					return;
				}
				throw new Error("Empty best-selling response");
			} catch (e: any) {
				const derived = deriveBestByCategory(products);
				if (!cancelled) {
					setBestSelling(derived);
					// Suppress error message when the response was simply empty (fallback case).
					if (!(e?.message === "Empty best-selling response")) {
						setError(
							(e?.message && typeof e.message === "string"
								? `Live best-selling feed unavailable: ${e.message}. Showing estimated list.`
								: "Live best-selling feed unavailable. Showing estimated list.")
						);
					}
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		};
		run();
		return () => {
			cancelled = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [products.length]);

	// compute slidesToShow based on current window width (integer values)
	const computeSlidesForWidth = (w: number) => {
		if (w >= 1280) return 3;
		if (w >= 1024) return 2;
		if (w >= 640) return 1;
		return 1;
	};

	useEffect(() => {
		const setFromWidth = () => setSlidesToShow(computeSlidesForWidth(window.innerWidth));
		setFromWidth();
		window.addEventListener("resize", setFromWidth);
		return () => window.removeEventListener("resize", setFromWidth);
	}, []);

	const categoriesById = useMemo(
		() => new Map(categories.map((c) => [c.categoryId, c])),
		[categories]
	);

	// Map of products from the main catalog for quick lookup by productId
	const productsById = useMemo(() => new Map(products.map((pr) => [pr.productId, pr])), [products]);

	return (
		<section data-aos="fade-up" className="py-8">
			<SectionHeading title={sectionHeadingProp.title} />
			<div className="row py-2">
				{loading && (
					<p className="text-center w-full py-6">Loading best sellers…</p>
				)}
				{!loading && error && (
					<p className="text-center w-full py-6 text-red-600">{error}</p>
				)}
				{!loading && bestSelling.length > 0 && (
					<div className="py-4">
						{/* If all items fit into slidesToShow, render a static grid; otherwise render a Swiper slideshow */}
						{bestSelling.length <= slidesToShow ? (
							<div className="flex flex-wrap justify-center gap-8 w-full mx-auto max-w-6xl">
								{bestSelling.map((p) => {
									const productFromCatalog = productsById.get((p as any).productId);
									const productToShow = productFromCatalog ?? (p as unknown as ProductProps);
									return (
										<div key={p.productId} className="flex flex-col items-center gap-2 w-full max-w-[260px]">
											<ProductCard product={productToShow} />
											{p.categoryId && categoriesById.get(p.categoryId) && (
												<span className="text-sm text-gray-600 block mt-1 text-center">
													Top in {categoriesById.get(p.categoryId)!.name}
												</span>
											)}
										</div>
									);
								})}
							</div>
						) : (
							<>
								<div className="flex justify-center">
									<Swiper
									modules={[Autoplay, Pagination]}
									spaceBetween={16}
									loop={true}
									autoplay={{
										delay: 2200,
										disableOnInteraction: false,
										pauseOnMouseEnter: true,
									}}
									pagination={{ clickable: true, el: ".best-sellers-pagination" }}
									className="pb-12"
									slidesPerView={slidesToShow}
									centeredSlides={true}
									centeredSlidesBounds={true}
								>
									{bestSelling.map((p) => {
										const productFromCatalog = productsById.get((p as any).productId);
										const productToShow = productFromCatalog ?? (p as unknown as ProductProps);
										return (
											<SwiperSlide key={p.productId} className="flex justify-center">
												<div className="flex flex-col gap-2 w-full max-w-[260px] items-center">
													<ProductCard product={productToShow} />
													{p.categoryId && categoriesById.get(p.categoryId) && (
														<span className="text-sm text-gray-600 block mt-1 text-center">
															Top in {categoriesById.get(p.categoryId)!.name}
														</span>
													)}
												</div>
											</SwiperSlide>
										);
									})}
									</Swiper>
								</div>
								<div className="best-sellers-pagination mt-3 flex items-center justify-center gap-2" />
							</>
						)}
					</div>
				)}
				{!loading && bestSelling.length === 0 && (
					<p className="text-center w-full py-6">No best sellers to show.</p>
				)}
			</div>
		</section>
	);
};

// Simple heuristic fallback: pick, per category, the product with most reviews.
function deriveBestByCategory(all: ProductProps[]): BestByCategoryItem[] {
	const byCategory = new Map<number, ProductProps[]>();
	for (const p of all) {
		if (p.categoryId == null) continue;
		if (!byCategory.has(p.categoryId)) byCategory.set(p.categoryId, []);
		byCategory.get(p.categoryId)!.push(p);
	}
	const result: BestByCategoryItem[] = [];
	for (const [categoryId, items] of byCategory.entries()) {
		if (items.length === 0) continue;
		const best = [...items].sort(
			(a, b) => b.reviews.length - a.reviews.length
		)[0];
		result.push({ ...best, categoryId });
	}
	return result;
}

export default BestSellingProducts;
