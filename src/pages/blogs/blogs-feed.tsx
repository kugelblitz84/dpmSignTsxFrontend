import BlogCard from "@/pages/blogs/blog-card";

import BlogRightSidebar from "@/pages/blogs/blog-right-sidebar";
import { BlogProps, useBlog } from "@/hooks/use-blog";

const BlogsFeed = ({ blogs }: { blogs: BlogProps[] }) => {
	const { loading } = useBlog();

	return (
		<section className="py-10">
			<div className="row py-8 grid lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2">
					<h2 className="text-2xl font-semibold mb-6">Most Viewed Blogs</h2>
					<div className="grid md:grid-cols-2 gap-6">
						{blogs.map((blog, index) => (
							<BlogCard key={index} blog={blog} isLoading={loading} />
						))}
					</div>
				</div>

				{/* Sidebar */}
				<BlogRightSidebar />
			</div>
		</section>
	);
};

export default BlogsFeed;
