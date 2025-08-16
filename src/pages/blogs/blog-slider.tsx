import BlogCard from "@/pages/blogs/blog-card";
import SectionHeading from "@/components/section-heading";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router-dom";

import routes from "@/routes";
import { BlogProps, useBlog } from "@/hooks/use-blog";

const BlogSlider = ({ blogs }: { blogs: BlogProps[] }) => {
	const { loading } = useBlog();

	return (
		<section className="py-2">
			<SectionHeading title={"Featured Blog"} />

			<div className="row flex items-center justify-center py-0 gap-5">
				<Breadcrumb>
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
							<Link to={routes.blogs.path} className="text-base xl:text-lg">
								<BreadcrumbLink className="font-medium hover:text-skyblue transition-all duration-300">
									Blogs
								</BreadcrumbLink>
							</Link>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>

			<div className="row py-16">
				<Swiper
					modules={[Autoplay, Pagination]}
					pagination={{ clickable: true }}
					autoplay={{ delay: 1500 }}
					className="w-full"
					breakpoints={{
						0: {
							slidesPerView: 1,
						},
						768: {
							slidesPerView: 2,
						},
						1280: {
							slidesPerView: 3,
						},
					}}
				>
					{blogs.slice(0, 3).map((blog, index) => (
						<SwiperSlide key={index}>
							<div className="w-[80%] mx-auto flex items-center justify-center mb-20">
								<BlogCard blog={blog} isLoading={loading} />
							</div>
						</SwiperSlide>
					))}
				</Swiper>
			</div>
		</section>
	);
};

export default BlogSlider;
