import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import routes from "@/routes";
import { BlogProps } from "@/hooks/use-blog";
import { Skeleton } from "@/components/ui/skeleton";

const BlogCard = ({
	blog,
	isLoading,
}: {
	blog: BlogProps;
	isLoading: boolean;
}) => {
	return (
		<Card className="xl:w-full w-[90%] mx-auto overflow-hidden bg-slate-100/40 backdrop-blur-lg shadow-sm border-gray/50 flex items-start justify-start flex-col gap-2">
			{isLoading || !blog ? (
				<Skeleton className="w-[40rem] h-[16rem] xl:h-[24rem]" />
			) : (
				blog?.bannerImgUrl && (
					<Link to={`${routes.blogs.path}/${blog.blogId}`}>
						<img
							src={blog.bannerImgUrl}
							alt={blog.title}
							className="w-[40rem] h-[16rem] xl:h-[24rem] object-cover object-center"
						/>
					</Link>
				)
			)}
			<CardHeader>
				<div className="flex items-center text-sm gap-2 mb-2">
					{isLoading || !blog ? (
						<Skeleton className="w-20 h-4" />
					) : (
						<>
							<span>{format(blog?.createdAt, "MMM dd, yyyy")}</span>
							<Separator orientation="vertical" className="h-5 w-[1.5px]" />
						</>
					)}
					{isLoading || !blog ? (
						<Skeleton className="w-20 h-4" />
					) : (
						<Badge size="sm">Admin</Badge>
					)}
				</div>
				<CardTitle className="line-clamp-2 text-left text-base font-semibold">
					{isLoading || !blog ? (
						<Skeleton className="w-3/4 h-6" />
					) : (
						<Link to={`${routes.blogs.path}/${blog?.blogId}`}>
							{blog?.title}
						</Link>
					)}
				</CardTitle>
				<CardDescription className="line-clamp-3 text-left text-sm font-normal">
					{isLoading || !blog ? (
						<Skeleton className="w-96 h-12" />
					) : (
						blog?.content
					)}
				</CardDescription>
			</CardHeader>
		</Card>
	);
};

export default BlogCard;
