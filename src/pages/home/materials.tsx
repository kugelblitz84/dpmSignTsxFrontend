import SectionHeading, {
	SectionHeadingProps,
} from "@/components/section-heading";
import MaterialImg1 from "@/assets/images/materials/Waterproof LED Module Light.jpg";
import MaterialImg2 from "@/assets/images/materials/Aluminium composite panel ACP.jpg";
import MaterialImg3 from "@/assets/images/materials/Crystal Glass.jpg";
import MaterialImg4 from "@/assets/images/materials/Imported Power Supply.jpg";
import MaterialImg5 from "@/assets/images/materials/Iron & Aluminium Channel.jpg";
import MaterialImg6 from "@/assets/images/materials/Natural Wood.jpg";
import MaterialImg7 from "@/assets/images/materials/Premium Quality Acrylic Sheet.jpg";
import MaterialImg8 from "@/assets/images/materials/PVC Sheet.jpg";
import MaterialImg9 from "@/assets/images/materials/Stainless Steel Sheet.jpg";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface Material {
	title: string;
	img: string;
}

const Materials = () => {
	const sectionHeadingProp: SectionHeadingProps = {
		title: "We Use Best Quality Materials",
		description: "Premium Materials for Durable and Stunning Results",
	};

	const materials: Material[] = [
		{
			title: "100% Waterproof LED Module Light",
			img: MaterialImg1,
		},
		{
			title: "Aluminium composite panel (ACP)",
			img: MaterialImg2,
		},
		{
			title: "Crystal Glass",
			img: MaterialImg3,
		},
		{
			title: "Imported Power Supply",
			img: MaterialImg4,
		},
		{
			title: "Iron & Aluminium Channel",
			img: MaterialImg5,
		},
		{
			title: "Natural Wood",
			img: MaterialImg6,
		},
		{
			title: "Premium Quality Acrylic Sheet",
			img: MaterialImg7,
		},
		{
			title: "PVC Sheet",
			img: MaterialImg8,
		},
		{
			title: "Stainless Steel Sheet",
			img: MaterialImg9,
		},
	];

	return (
		<section data-aos="fade-up" className="py-10">
			<SectionHeading
				title={sectionHeadingProp.title}
				description={sectionHeadingProp.description}
			/>

			<div className="row py-10 grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-1">
				<Swiper
					autoplay={{
						delay: 1200,
						disableOnInteraction: false,
						pauseOnMouseEnter: true,
					}}
					modules={[Autoplay, Pagination]}
					pagination={{ clickable: true }}
					spaceBetween={30}
					loop={true}
					breakpoints={{
						0: {
							slidesPerView: 1,
						},
						768: {
							slidesPerView: 1,
						},
						1280: {
							slidesPerView: 1,
						},
					}}
				>
					{materials.map((material, index) => (
						<SwiperSlide key={index}>
							<div className="flex flex-col items-center justify-center gap-4 mb-14">
								<img
									src={material.img}
									alt={material.title}
									className="max-w-[70%] rounded-md border-2 border-skyblue shadow-lg"
								/>
								<h4 className="text-xl font-semibold">
									{material.title}
								</h4>
							</div>
						</SwiperSlide>
					))}
				</Swiper>
				<div className="w-full flex items-start justify-start flex-col gap-6">
					<p className="text-base font-semibold w-[95%] xl:w-[90%] text-justify">
						Dhaka Plastic & Metal is committed to delivering
						exceptional quality and durability in every product we
						create. We source and use premium materials to ensure
						our 3D signage, award plaques (Crests), and corporate
						branding solutions meet the highest industry standards.
						From PK Acrylic and 100% waterproof LED module lights to
						Aluminium Composite Panels (ACP) and Crystal Glass, we
						carefully select materials that provide strength,
						elegance, and longevity. Whether it's stainless steel
						sheets, natural wood, or PVC sheets, each component is
						chosen to guarantee a flawless finish and lasting
						performance in all weather conditions.
					</p>

					<p className="text-base font-semibold w-[95%] xl:w-[90%] text-justify">
						Our advanced iron and aluminum channels, combined with
						high-efficiency power supplies, deliver structural
						stability and brilliant lighting effects for signage.
						These materials not only enhance visual appeal but also
						ensure energy efficiency and low maintenance. At Dhaka
						Plastic & Metal, we combine cutting-edge technology with
						premium resources to craft products that stand the test
						of time—offering businesses in Bangladesh superior
						branding solutions that leave a lasting impression.
					</p>
				</div>
			</div>
		</section>
	);
};

export default Materials;
