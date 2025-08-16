import { Link } from "react-router-dom";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, StarHalf } from "lucide-react";
import routes from "@/routes";
import { ProductProps, ProductReviewProps } from "@/hooks/use-product";
import ProductPlaceholderImg from "@/assets/images/product-placeholder.jpg";
import { useCategory } from "@/hooks/use-category";
import { currencySymbol } from "@/config";
import { formatPrice } from "@/lib/utils";

export interface ProductCardProps {
    product: ProductProps;
    orientation?: "vertical" | "horizontal";
}

const ProductCard = ({
    product,
    orientation = "vertical",
}: ProductCardProps) => {
    const { categories } = useCategory();

    const productCategory = useMemo(() =>
        categories.find((category) => category.categoryId === product.categoryId),
        [categories, product.categoryId]
    );

    const publishedReviews = useMemo(() =>
        product.reviews.filter((review) => review.status === "published"),
        [product.reviews]
    );

    const averageRating = useMemo(() =>
        getAverageRating(publishedReviews),
        [publishedReviews]
    );

    if (orientation === "horizontal") {
        return (
            <div className="w-1/3 bg-slate-100/40 backdrop-blur-lg shadow-sm border-neutral-300 grid grid-cols-3 gap-3 border rounded-lg overflow-hidden">
                <Link to={`${routes.products.path}/${product.slug}`}>
                    <img
                        src={product.images[0]?.imageUrl || ProductPlaceholderImg}
                        alt={product.name}
                        className="object-cover w-full h-full rounded-l-lg group-hover:scale-105 transition-transform duration-300 ease-in-out"
                    />
                </Link>
                <div className="col-span-2 w-full h-auto flex items-start justify-center flex-col gap-1.5 py-2 pr-3">
                    <div className="w-full">
                        {productCategory && (
                            <Badge size="sm">{productCategory.name}</Badge>
                        )}
                    </div>
                    <Link
                        to={`${routes.products.path}/${product.slug}`}
                        className="w-full text-left"
                    >
                        {/* Removed 'truncate' to show the full name */}
                        <h3 className="text-md font-semibold tracking-wide text-left w-full">
                            {product.name}
                        </h3>
                    </Link>
                    <div className="flex items-center justify-center place-content-center gap-1">
                        {renderStars(averageRating)}
                        <span className="text-xs pl-1">
                            {publishedReviews.length} reviews
                        </span>
                    </div>
                    <div className="w-full flex items-start justify-start">
                        <h4 className="text-xl font-semibold">
                            {currencySymbol} {formatPrice(product?.basePrice)}
                        </h4>
                    </div>
                </div>
            </div>
        );
    } else {
        // Default vertical card
        return (
            // Restored original structure with smaller dimensions
            <div className="min-w-[220px] bg-slate-100/40 backdrop-blur-lg shadow-sm flex items-center justify-center flex-col">
                <Link to={`${routes.products.path}/${product.slug}`}>
                    {/* Compact image container with original rounding */}
                    <div className="w-[16rem] h-[15rem] overflow-hidden rounded-t-lg hover:*:scale-110">
                        <img
                            src={product.images[0]?.imageUrl || ProductPlaceholderImg}
                            alt={product.name}
                            className="w-full h-full object-cover transition-all duration-300"
                        />
                    </div>
                </Link>
                {/* Content container with original border style and flexible height */}
                <div className="w-[16rem] h-full flex flex-col justify-between gap-2 py-3 px-4 border-b border-l border-r rounded-b-lg border-neutral-300">
                    <div>
                        {productCategory && (
                            <Badge size="sm">{productCategory.name}</Badge>
                        )}
                    </div>
                    <Link
                        to={`${routes.products.path}/${product.slug}`}
                        className="w-full text-left"
                    >
                        {/* Removed 'truncate' to show the full name, allowing it to wrap */}
                        <h3 className="text-lg font-semibold tracking-wide text-left w-full min-h-[2.25rem]">
                            {product.name}
                        </h3>
                    </Link>
                    <div className="flex items-center justify-start gap-1">
                        {renderStars(averageRating)}
                        <span className="text-xs pl-1">
                            ({publishedReviews.length})
                        </span>
                    </div>
                    <div className="w-full flex items-center justify-start gap-3 py-1">
                        <h4 className="text-2xl font-bold">
                            {currencySymbol} {formatPrice(product?.basePrice)}
                        </h4>
                    </div>
                    {/* Restored the "View Details" link button */}
                    <Link
                        className="w-full flex items-start"
                        to={`${routes.products.path}/${product.slug}`}
                    >
                        <Button variant="link" className="p-0 h-auto">
                            View Details
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }
};

// This function is now more efficient as it receives pre-filtered reviews
const getAverageRating = (publishedReviews: ProductReviewProps[]) => {
    if (!publishedReviews.length) return 0;
    const totalRating = publishedReviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRating / publishedReviews.length;
};

// Reduced star size for a more compact look
const renderStars = (averageRating: number) => {
    const fullStars = Math.floor(averageRating);
    const halfStar = averageRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    const starSize = 16; // Smaller star size

    return (
        <>
            {[...Array(fullStars)].map((_, index) => (
                <Star
                    key={`full-${index}`}
                    size={starSize}
                    className="text-skyblue fill-skyblue"
                />
            ))}
            {halfStar && <StarHalf size={starSize} className="text-skyblue fill-skyblue" />}
            {[...Array(emptyStars)].map((_, index) => (
                <Star key={`empty-${index}`} size={starSize} className="text-gray-300" />
            ))}
        </>
    );
};

export default ProductCard;