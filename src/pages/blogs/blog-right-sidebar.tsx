import BlogCard from "@/pages/blogs/blog-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
// Render a lightweight horizontal product preview here to avoid depending on ProductCard which requires CategoryProvider
import { Link } from "react-router-dom";
import routes from "@/routes";
import ProductPlaceholderImg from "@/assets/images/product-placeholder.jpg";
import { formatPrice } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useBlog } from "@/hooks/use-blog";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";
import { productService } from "@/api";
import urlJoin from "url-join";
import { apiStaticURL } from "@/lib/dotenv";
// don't import useProduct here; sidebar may render outside ProductProvider

const BlogRightSidebar = () => {
	const { searchedBlogs, searchLoading, setSearchTerm, error } = useBlog();
	const [searchInput, setSearchInput] = useState<string>("");
	const { toast } = useToast();
	const location = useLocation();

	useEffect(() => {
		if (error) {
			toast({
				description: error,
				variant: "destructive",
				duration: 10000,
			});
		}
	}, []);

	// Debounce search Effect
	useEffect(() => {
		const handler = setTimeout(() => {
			setSearchTerm(searchInput); // Only update context after delay
		}, 500); // Delay of 500ms

		return () => clearTimeout(handler); // Cleanup on each change
	}, [searchInput]);

	useEffect(() => {
		setSearchInput("");
	}, [location]);

	const [bestSellingProducts, setBestSellingProducts] = useState<any[]>([]);
	const [bsLoading, setBsLoading] = useState(false);
	const [bsError, setBsError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		const run = async () => {
			setBsLoading(true);
			setBsError(null);
			try {
				const res = await productService.fetchBestSellingByCategory(2);
				const arr: unknown = (res as any)?.products ?? res;
				if (Array.isArray(arr) && arr.length > 0) {
					// Try to replace each feed item with canonical product data from product endpoint
					const canonical = await Promise.all((arr as any[]).map(async (item) => {
						const pid = (item as any).productId ?? (item as any).product?.productId ?? null;
						if (!pid) return item;
						try {
							const prodResp = await productService.fetchProductById(pid);
							const prod = prodResp?.data?.product || prodResp?.product || prodResp;
							// normalize images to imageUrl if needed
							if (Array.isArray(prod?.images)) {
								prod.images = prod.images.map((img: any) => ({
									...img,
									imageUrl:
										img?.imageUrl ||
										(img?.imageName ? urlJoin(apiStaticURL, "/product-images", img.imageName) : undefined),
								}));
							}
							return prod;
						} catch {
							return item;
						}
					}));
					if (!cancelled) setBestSellingProducts(canonical as any[]);
					return;
				}
				throw new Error("Empty best-selling response");
			} catch (e: any) {
				// fallback: try to fetch a small random list to show
				try {
					const rnd = await productService.fetchRandomProducts(4);
					const rndArr: unknown = (rnd as any)?.products ?? rnd;
					if (Array.isArray(rndArr) && rndArr.length > 0) {
						if (!cancelled) setBestSellingProducts(rndArr as any[]);
						if (!cancelled && !(e?.message === "Empty best-selling response")) {
							setBsError(
								(e?.message && typeof e.message === "string"
									? `Live best-selling feed unavailable: ${e.message}. Showing estimated list.`
									: "Live best-selling feed unavailable. Showing estimated list.")
							);
						}
						return;
					}
				} catch {
					// ignore and continue to set an error below
				}
				if (!cancelled) {
					setBestSellingProducts([]);
					if (!(e?.message === "Empty best-selling response")) {
						setBsError(
							(e?.message && typeof e.message === "string"
								? `Live best-selling feed unavailable: ${e.message}.`
								: "Live best-selling feed unavailable.")
						);
					}
				}
			} finally {
				if (!cancelled) setBsLoading(false);
			}
		};
		run();
		return () => {
			cancelled = true;
		};
	}, []);

	return (
		<>
			<aside className="space-y-8">
				<div className="space-y-6">
					<h2 className="text-2xl font-semibold">Search</h2>
					<div className="flex w-full items-center space-x-2 relative">
						<Search
							size={20}
							className="cursor-pointer text-gray absolute left-5"
						/>
						<Input
							id="search"
							name="search"
							placeholder="Search blog..."
							className="pl-10"
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
						/>
					</div>

					{searchInput.length > 0 && (
						<div className="w-full flex flex-col gap-4">
							{searchedBlogs.length > 0 &&
								searchedBlogs.map((blog, index) => (
									<BlogCard key={index} blog={blog} isLoading={searchLoading} />
								))}

							{searchedBlogs.length === 0 && (
								<p className="text-center text-sm font-semibold">
									no blogs found.
								</p>
							)}
						</div>
					)}
				</div>

				<Separator className="bg-gray/50" />

				{/* Best Selling Product */}
				<div className="space-y-4">
					<h3 className="font-semibold text-lg">Best Selling Products</h3>
					{bsLoading && <p className="text-sm">Loading best sellers…</p>}
					{!bsLoading && bsError && (
						<p className="text-sm text-red-600">{bsError}</p>
					)}
					{!bsLoading && bestSellingProducts.length > 0 && (
						<div className="flex flex-col gap-3">
							{bestSellingProducts.map((product: any, index) => (
								<div key={index} className="w-full bg-slate-50 rounded-md border p-2 flex items-center gap-3">
									<img src={product?.images?.[0]?.imageUrl || ProductPlaceholderImg} alt={product?.name || 'Product'} className="w-20 h-20 object-cover rounded-md" />
									<div className="flex-1">
										<Link to={`${routes.products.path}/${product?.slug || ''}`} className="font-semibold block text-sm">
											{product?.name || 'Product'}
										</Link>
										<div className="text-xs text-gray-600">{product?.reviews?.length ?? 0} reviews</div>
										<div className="text-sm font-bold mt-1">{formatPrice(product?.basePrice || 0)}</div>
									</div>
								</div>
							))}
						</div>
					)}
					{!bsLoading && bestSellingProducts.length === 0 && (
						<p className="text-sm">No best sellers to show.</p>
					)}
				</div>
			</aside>
		</>
	);
};

export default BlogRightSidebar;
