import BlogCard from "@/pages/blogs/blog-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
// import ProductCard from "@/components/product-card";
import { Separator } from "@/components/ui/separator";
import { useBlog } from "@/hooks/use-blog";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";

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
					{/* {bestSellingProducts.map((product, index) => (
						<ProductCard
							key={index}
							productId={product.id}
							productImg={product.img}
							productName={product.title}
							productCategory={product.category}
							orientation="horizontal"
						/>
					))} */}
				</div>
			</aside>
		</>
	);
};

export default BlogRightSidebar;
