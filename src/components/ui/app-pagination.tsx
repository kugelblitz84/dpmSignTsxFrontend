import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationPrevious,
	PaginationNext,
	PaginationLink,
	PaginationEllipsis,
} from "@/components/ui/pagination";

interface PaginationProps {
	page: number;
	totalPages: number;
	onPageChange: (newPage: number) => void;
}

export function AppPagination({
	page,
	totalPages,
	onPageChange,
}: PaginationProps) {
	const getPageNumbers = () => {
		const pages = [];
		if (totalPages <= 5) {
			for (let i = 1; i <= totalPages; i++) pages.push(i);
		} else {
			if (page > 3) pages.push(1, "..."); // Show first page + ellipsis
			for (
				let i = Math.max(2, page - 1);
				i <= Math.min(totalPages - 1, page + 1);
				i++
			) {
				pages.push(i);
			}
			if (page < totalPages - 2) pages.push("...", totalPages); // Show last page + ellipsis
		}
		return pages;
	};

	return (
		<Pagination className="flex justify-center mt-4">
			<PaginationContent>
				{/* Previous Button - Disable Click if on First Page */}
				<PaginationItem>
					{page > 1 ? (
						<PaginationPrevious
							className="cursor-pointer"
							onClick={(e) => {
								e.preventDefault();
								onPageChange(page - 1);
							}}
						/>
					) : (
						<span className="opacity-50 cursor-not-allowed">
							<PaginationPrevious />
						</span>
					)}
				</PaginationItem>

				{getPageNumbers().map((pageNumber, index) => (
					<PaginationItem key={index}>
						{pageNumber === "..." ? (
							<PaginationEllipsis />
						) : (
							<PaginationLink
								className="cursor-pointer"
								isActive={pageNumber === page}
								onClick={(e) => {
									e.preventDefault();
									onPageChange(Number(pageNumber));
								}}
							>
								{pageNumber}
							</PaginationLink>
						)}
					</PaginationItem>
				))}

				{/* Next Button - Disable Click if on Last Page */}
				<PaginationItem>
					{page < totalPages ? (
						<PaginationNext
							className="cursor-pointer"
							onClick={(e) => {
								e.preventDefault();
								onPageChange(page + 1);
							}}
						/>
					) : (
						<span className="opacity-50 cursor-not-allowed">
							<PaginationNext />
						</span>
					)}
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
