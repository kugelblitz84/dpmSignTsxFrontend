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

	useEffect(() => {
		let cancelled = false;
		const run = async () => {
			setLoading(true);
			setError(null);
			try {
				const res = await productService.fetchBestSellingByCategory(1);
				// Support both shapes: { products: [...] } or already array
				const productsArr: unknown = (res as any)?.products ?? res;
				if (
					Array.isArray(productsArr) &&
					productsArr.length > 0
				) {
					if (!cancelled) setBestSelling(productsArr as BestByCategoryItem[]);
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

	const categoriesById = useMemo(
		() => new Map(categories.map((c) => [c.categoryId, c])),
		[categories]
	);

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
						{/* reserve space for pagination with pb; pagination rendered below via .best-sellers-pagination */}
						<Swiper
							modules={[Autoplay, Pagination]}
							spaceBetween={8}
							loop={true}
							autoplay={{
								delay: 2200,
								disableOnInteraction: false,
								pauseOnMouseEnter: true,
							}}
							pagination={{ clickable: true, el: ".best-sellers-pagination" }}
							className="pb-12"
							breakpoints={{
								0: { slidesPerView: 1 },
								480: { slidesPerView: 1.05 },
								640: { slidesPerView: 1.5 },
								1024: { slidesPerView: 2.5 },
								1280: { slidesPerView: 3.25 },
							}}
						>
							{bestSelling.map((p) => (
								<SwiperSlide key={p.productId}>
									<div className="flex flex-col gap-2">
										<ProductCard product={p} />
										{p.categoryId && categoriesById.get(p.categoryId) && (
											<span className="text-sm text-gray-600 block mt-1 text-center">
												Top in {categoriesById.get(p.categoryId)!.name}
											</span>
										)}
									</div>
								</SwiperSlide>
							))}
						</Swiper>
						{/* External pagination container placed below slides so it doesn't overlap cards */}
						<div className="best-sellers-pagination mt-3 flex items-center justify-center gap-2" />
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
