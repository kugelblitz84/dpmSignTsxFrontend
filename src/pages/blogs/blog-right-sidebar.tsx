import BlogCard from "@/pages/blogs/blog-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import ProductCard from "@/components/product-card";
import { Separator } from "@/components/ui/separator";
import { useBlog } from "@/hooks/use-blog";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";
import { productService } from "@/api";
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
					if (!cancelled) setBestSellingProducts(arr as any[]);
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
							{bestSellingProducts.map((product, index) => (
								<ProductCard key={index} product={product} orientation="horizontal" />
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
