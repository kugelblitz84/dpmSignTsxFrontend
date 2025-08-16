import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";
import BlogRightSidebar from "@/pages/blogs/blog-right-sidebar";
import { BlogProps, useBlog } from "@/hooks/use-blog";
import { useEffect, useState } from "react";
import routes from "@/routes";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import MarkdownPreview from "@/components/markdown-preview";

const Blog = () => {
	const { blogId } = useParams();
	const navigate = useNavigate();

	const { blogs, loading } = useBlog();
	const [blog, setBlog] = useState<BlogProps | null>(null);

	useEffect(() => {
		if (loading || blogs.length === 0) return;

		const foundBlog = blogs.find((blog) => blog.blogId === Number(blogId));

		if (!foundBlog) {
			navigate(routes.notFound.path);
			return;
		}

		setBlog(foundBlog);
	}, [blogs, loading]);

	return (
		<>
			<section className="py-10">
				<div className="row py-8 grid lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2 space-y-5">
						{loading && <Skeleton className="w-1/2 h-8" />}

						{!loading && blog && (
							<>
								<div className="w-full flex items-center py-0">
									<Breadcrumb>
										<BreadcrumbList>
											<BreadcrumbItem>
												<Link
													to={routes.home.path}
													className="text-base xl:text-lg"
												>
													<BreadcrumbLink className="font-medium hover:text-skyblue transition-all duration-300">
														Home
													</BreadcrumbLink>
												</Link>
											</BreadcrumbItem>
											<BreadcrumbSeparator className="font-medium" />
											<BreadcrumbItem>
												<Link
													to={routes.blogs.path}
													className="text-base xl:text-lg"
												>
													<BreadcrumbLink className="font-medium hover:text-skyblue transition-all duration-300">
														Blogs
													</BreadcrumbLink>
												</Link>
											</BreadcrumbItem>
											<BreadcrumbSeparator className="font-medium" />
											<BreadcrumbItem>
												<Link
													to={`${routes.blogs.path}/${blog?.blogId}`}
													className="text-base xl:text-lg"
												>
													<BreadcrumbLink className="font-medium hover:text-skyblue transition-all duration-300">
														{blog?.title}
													</BreadcrumbLink>
												</Link>
											</BreadcrumbItem>
										</BreadcrumbList>
									</Breadcrumb>
								</div>
								<h2 className="text-2xl font-semibold">{blog.title}</h2>
							</>
						)}

						<div className="w-full flex items-center justify-center">
							{loading && <Skeleton className="w-full h-64 rounded-lg" />}
							{!loading && blog && (
								<img
									src={blog?.bannerImgUrl}
									alt={blog?.title}
									className="max-w-full rounded-lg"
								/>
							)}
						</div>

						<div className="w-full flex items-center gap-4">
							{loading && (
								<>
									<Skeleton className="w-24 h-4" />
									<Skeleton className="w-16 h-6" />
								</>
							)}
							{!loading && blog && (
								<>
									<h6 className="font-para text-sm">
										{new Date(blog?.createdAt).toDateString()}
									</h6>

									<Badge size="sm">Admin</Badge>
								</>
							)}
						</div>

						<div className="prose max-w-none py-6 mb-6 font-normal text-base space-y-5">
							{loading && (
								<>
									<Skeleton className="w-full h-6" />
									<Skeleton className="w-full h-6" />
									<Skeleton className="w-1/2 h-6" />
								</>
							)}

							{!loading && blog && (
								<MarkdownPreview
									key={blog.blogId.toString()}
									content={blog.content}
								/>
							)}
						</div>
					</div>
					<BlogRightSidebar />
				</div>
			</section>
		</>
	);
};

export default Blog;
