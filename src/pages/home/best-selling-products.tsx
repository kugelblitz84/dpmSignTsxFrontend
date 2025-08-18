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

// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

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
				// Try backend endpoint first
				const res = await productService.fetchBestSellingByCategory(1);
				if (!cancelled && res?.data?.products?.length) {
					setBestSelling(res.data.products as BestByCategoryItem[]);
					return;
				}
				throw new Error("Empty best-selling response");
			} catch {
				// Fallback: derive best-selling per category from existing product list
				const derived = deriveBestByCategory(products);
				if (!cancelled) setBestSelling(derived);
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
				{!loading && !error && bestSelling.length > 0 && (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{bestSelling.map((p) => (
							<div key={p.productId} className="flex flex-col gap-2">
								<ProductCard product={p} />
								{p.categoryId && categoriesById.get(p.categoryId) && (
									<span className="text-sm text-gray-600">
										Top in {categoriesById.get(p.categoryId)!.name}
									</span>
								)}
							</div>
						))}
					</div>
				)}
				{!loading && !error && bestSelling.length === 0 && (
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
