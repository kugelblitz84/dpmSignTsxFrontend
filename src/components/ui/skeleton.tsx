import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

const Skeleton = ({ className, ...props }: SkeletonProps) => {
	return (
		<div
			className={cn(
				"animate-pulse rounded-md bg-neutral-900/10 dark:bg-neutral-50/10",
				className
			)}
			{...props}
		/>
	);
};

export { Skeleton };
