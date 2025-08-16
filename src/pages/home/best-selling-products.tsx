// import ProductImage1 from "@/assets/images/best-selling-product-1.jpg";
// import ProductImage2 from "@/assets/images/best-selling-product-2.jpg";
// import ProductImage3 from "@/assets/images/best-selling-product-3.jpg";
// import ProductImage4 from "@/assets/images/best-selling-product-4.jpg";
// import ProductImage5 from "@/assets/images/best-selling-product-5.jpg";
import SectionHeading, {
	SectionHeadingProps,
} from "@/components/section-heading";

// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import ProductCard from "@/components/product-card";

// interface Product {
// 	id: string;
// 	title: string;
// 	description: string;
// 	img: string;
// 	category: string;
// }

const BestSellingProducts = () => {
	const sectionHeadingProp: SectionHeadingProps = {
		title: "Our Best Selling Products",
	};

	// const bestSellingProducts: Product[] = [
	// 	{
	// 		id: "prdct10",
	// 		title: "LED Signage",
	// 		description:
	// 			"There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't",
	// 		img: ProductImage1,
	// 		category: "acrylic",
	// 	},
	// 	{
	// 		id: "prdct10",
	// 		title: "School Shirt Badge",
	// 		description:
	// 			"There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't",
	// 		img: ProductImage2,
	// 		category: "acrylic",
	// 	},
	// 	{
	// 		id: "prdct10",
	// 		title: "Wooden Crest",
	// 		description:
	// 			"There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't",
	// 		img: ProductImage3,
	// 		category: "acrylic",
	// 	},
	// 	{
	// 		id: "prdct10",
	// 		title: "Creative IT Institute Award Plaque",
	// 		description:
	// 			"There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't",
	// 		img: ProductImage4,
	// 		category: "acrylic",
	// 	},
	// 	{
	// 		id: "prdct10",
	// 		title: "LED Signage Installation",
	// 		description:
	// 			"There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't",
	// 		img: ProductImage5,
	// 		category: "acrylic",
	// 	},
	// ];

	return (
		<section data-aos="fade-up" className="py-8">
			<SectionHeading title={sectionHeadingProp.title} />

			{/* <div className="row py-2">
				<Swiper
					autoplay={{
						delay: 1200,
						disableOnInteraction: false,
						pauseOnMouseEnter: true,
					}}
					modules={[Autoplay]}
					spaceBetween={30}
					loop={true}
					breakpoints={{
						0: {
							slidesPerView: 1,
						},
						768: {
							slidesPerView: 2,
						},
						1280: {
							slidesPerView: 4,
						},
					}}
				>
					{bestSellingProducts.map((product, index) => (
						<SwiperSlide key={index}>
							<ProductCard
								productId={product.id}
								productImg={product.img}
								productName={product.title}
								productCategory={product.category}
							/>
						</SwiperSlide>
					))}
				</Swiper>
			</div> */}
		</section>
	);
};

export default BestSellingProducts;
