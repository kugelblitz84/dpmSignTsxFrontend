// Breadcrumb and SectionHeading are unused in current layout
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetFooter,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
// Link and routes are unused as breadcrumb is commented out
import ProductCard from "@/components/product-card";
import { SlidersHorizontal } from "lucide-react";
import ProductFilter from "@/pages/products/product-filter"; // Assuming ProductFilter is a separate component
import { ProductProps, useProduct } from "@/hooks/use-product";
import { useEffect, useState } from "react";
import { CategoryProps, useCategory } from "@/hooks/use-category";
import { AppPagination } from "@/components/ui/app-pagination";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import SEO from "@/components/seo";

const Products = () => {
	const { products, totalPages, page, setPage, setLimit, loading } =
		useProduct();
	const { categories } = useCategory();
	const [selectedCategories, setSelectedCategories] = useState<CategoryProps[]>(
		[]
	);
	const [sortedProducts, setSortedProducts] =
		useState<ProductProps[]>(products);
	const [sortedBy, setSortedBy] = useState<
		"default" | "name" | "lowtohigh" | "hightolow" | "recent" | "oldest"
	>("default");

	useEffect(() => {
		let filteredProducts = products;
		if (selectedCategories.length > 0) {
			filteredProducts = products.filter((product) =>
				selectedCategories.some(
					(selectedCat) => selectedCat.categoryId === product.categoryId
				)
			);
		}

		// Sort products based on `sortedBy` criteria
		const sorted = [...filteredProducts];
		if (sortedBy === "lowtohigh") {
			sorted.sort((a, b) => a.basePrice - b.basePrice);
		} else if (sortedBy === "hightolow") {
			sorted.sort((a, b) => b.basePrice - a.basePrice);
		} else if (sortedBy === "recent") {
			sorted.sort(
				(a, b) =>
					new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()
			);
		} else if (sortedBy === "oldest") {
			sorted.sort(
				(a, b) =>
					new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf()
			);
		} else if (sortedBy === "name") {
			sorted.sort((a, b) => a.name.localeCompare(b.name));
		} else {
			sorted.sort((a, b) => a.productId - b.productId); // Default sorting by ID
		}

		// Update the state with the final sorted and filtered products
		setSortedProducts(sorted);
	}, [sortedBy, selectedCategories, products]);

	return (
		<>
			<SEO
				title="Products - Dhaka Plastic & Metal | Signage & Corporate Gifts"
				description="Browse our extensive product catalog, including 3D LED signs, award crests, nameplates, corporate gifts, and custom branding solutions in Bangladesh."
			/>
			{/* <section className="py-5 bg-heroBanner bg-cover bg-no-repeat bg-center text-white">
				<SectionHeading
					title={sectionHeadingProp.title}
					// description={sectionHeadingProp.description}
					variant="white"
				/>

				<div className="row flex items-center justify-center py-2 gap-5">
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<Link to={routes.home.path} className="text-base xl:text-lg">
									<BreadcrumbLink className="text-white font-medium hover:text-skyblue transition-all duration-300">
										Home
									</BreadcrumbLink>
								</Link>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="text-white font-medium" />
							<BreadcrumbItem>
								<Link
									to={routes.products.path}
									className="text-base xl:text-lg"
								>
									<BreadcrumbLink className="text-white font-medium hover:text-skyblue transition-all duration-300">
										Products
									</BreadcrumbLink>
								</Link>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>
			</section> */}

			<section className="py-10 w-11/10 mx-auto">
				<div className="row flex items-center justify-between xl:justify-end">
					<div className="xl:hidden">
						<Sheet>
							<SheetTrigger asChild>
								<Button>
									<SlidersHorizontal size={20} />
									Filter
								</Button>
							</SheetTrigger>
							<SheetContent>
								<ProductFilter
									categories={categories}
									selectedCategories={selectedCategories}
									setSelectedCategories={setSelectedCategories}
								/>
								<SheetFooter>
									<SheetClose asChild>
										<Button type="submit" className="w-full">
											Apply Filter
										</Button>
									</SheetClose>
								</SheetFooter>
							</SheetContent>
						</Sheet>
					</div>

					<div className="flex items-center justify-between gap-3">
						<Select onValueChange={(e) => setSortedBy(e as typeof sortedBy)}>
							<SelectTrigger className="w-[200px]">
								<SelectValue placeholder="Sort by" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value="default">Default</SelectItem>
									<SelectItem value="name">Name</SelectItem>
									<SelectItem value="lowtohigh">Price (low to high)</SelectItem>
									<SelectItem value="hightolow">Price (high to low)</SelectItem>
									<SelectItem value="recent">Recently Added</SelectItem>
									<SelectItem value="oldest">Old Items</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>

						{totalPages > 1 && (
							<Select onValueChange={(e) => setLimit(Number(e) as number)}>
								<SelectTrigger className="w-[150px]">
									<SelectValue placeholder="Show items" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="20">20</SelectItem>
										<SelectItem value="50">50</SelectItem>
										<SelectItem value="90">90</SelectItem>
										<SelectItem value="120">120</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						)}
					</div>
				</div>

				{/* Products */}
				<div className="row py-8 grid xl:grid-cols-7 gap-5 lg:gap-6">
					<div className="xl:col-span-2 hidden xl:block pr-2 xl:pr-4">
						{!loading && (
							<ProductFilter
								categories={categories}
								selectedCategories={selectedCategories}
								setSelectedCategories={setSelectedCategories}
							/>
						)}
						{loading && (
							<div className="space-y-4 animate-pulse">
								{Array(10)
									.fill(0)
									.map((_, index) => (
										<div key={index} className="flex items-center gap-2">
											<Skeleton className="h-4 w-4 rounded-sm" />
											<Skeleton className="h-5 w-40" />
										</div>
									))}
							</div>
						)}
					</div>

					{loading && (
						<div className="col-span-5 w-full">
							<div
								className="w-full grid gap-5 justify-items-center md:justify-items-stretch"
								style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}
							>
								{Array.from({ length: 5 }).map((_, index) => (
									<Card
										key={index}
										className="w-full max-w-[260px] overflow-hidden group"
									>
										<div className="overflow-hidden">
											<Skeleton className="w-full aspect-square" />
										</div>
										<div className="p-4 space-y-4">
											<Skeleton className="h-6 w-16 rounded-lg" />
											<Skeleton className="h-6 w-3/4" />
											<Skeleton className="h-5 w-1/2" />
											<div className="flex pt-2 flex-col gap-2">
												<Skeleton className="h-9 w-30" />
												<Skeleton className="h-6 w-20" />
											</div>
										</div>
									</Card>
								))}
							</div>
						</div>
					)}

					{!loading && sortedProducts.length > 0 ? (
						<div className="col-span-5 xl:col-span-5 w-full">
							<div
								className="w-full grid gap-6 md:gap-7 justify-items-center md:justify-items-stretch items-center md:items-start"
								style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}
							>
								{sortedProducts.map((product, index) => (
									<ProductCard key={index} product={product} />
								))}
							</div>
						</div>
					) : (
						<div className="w-full col-span-5 text-center py-20">
							<p className="text-neutral-600 mb-6 text-lg">No products found</p>
						</div>
					)}
				</div>

				{/* Pagination */}
				<div className="w-full text-black">
					{totalPages > 1 && (
						<AppPagination
							page={page}
							totalPages={totalPages}
							onPageChange={setPage}
						/>
					)}
				</div>
			</section>
		</>
	);
};

export default Products;
