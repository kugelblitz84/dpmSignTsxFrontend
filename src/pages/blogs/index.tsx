import BlogsFeed from "@/pages/blogs/blogs-feed";
import BlogSlider from "@/pages/blogs/blog-slider";
import { useBlog } from "@/hooks/use-blog";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { AppPagination } from "@/components/ui/app-pagination";

const Blogs = () => {
	const { blogs, page, setPage, totalPages, error } = useBlog();
	const { toast } = useToast();

	useEffect(() => {
		if (error) {
			toast({
				description: error,
				variant: "destructive",
				duration: 10000,
			});
		}
	}, []);

	return (
		<>
			{blogs && blogs.length >= 3 && <BlogSlider blogs={blogs} />}
			{blogs && blogs.length > 0 && <BlogsFeed blogs={blogs} />}

			{blogs && blogs.length === 0 && (
				<div className="w-full flex items-center justify-center py-10">
					<p className="text-lg font-semibold text-gray">No blogs found.</p>
				</div>
			)}

			<div className="w-full py-8">
				{totalPages > 1 && (
					<AppPagination
						page={page}
						totalPages={totalPages}
						onPageChange={setPage}
					/>
				)}
			</div>
		</>
	);
};

export default Blogs;
