import { Separator } from "@/components/ui/separator";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Define the type for a testimonial object
interface Testimonial {
	name: string;
	title: string;
	img: string; // Add an image URL if available
	description: string;
}

const TestimonialSlider = () => {
	const testimonials: Testimonial[] = [
		{
			name: "CEO",
			title: "Creative IT",
			img: "", // Add an image URL if available
			description:
				"Dhaka Plastic & Metal provided us with exceptional LED signage that transformed our office front. Highly professional and reliable!",
		},
		{
			name: "Principal",
			title: "Faridpur Engineering College",
			img: "", // Add an image URL if available
			description:
				"The award crests and honor boards we received were beautifully crafted. Our students and faculty are delighted with the quality.",
		},
		{
			name: "Owner",
			title: "Zara Shoes",
			img: "", // Add an image URL if available
			description:
				"As a small business owner, I appreciate Dhaka Plastic & Metal's affordability and commitment to quality. Their signage helped elevate my shop's visibility.",
		},
		{
			name: "Institution",
			title: "University of Dhaka",
			img: "", // Add an image URL if available
			description:
				"The award crests we ordered were beautifully designed and delivered on time. A big thank you to the team!",
		},
	];

	return (
		<section className="py-12 mt-6">
			<Swiper
				autoplay={{
					delay: 3000,
					disableOnInteraction: false,
				}}
				modules={[Autoplay]}
				spaceBetween={40}
				loop={true}
				breakpoints={{
					0: {
						slidesPerView: 1,
					},
					1024: {
						slidesPerView: 2,
					},
				}}
			>
				{testimonials.map((item, index) => (
					<SwiperSlide key={index}>
						<div className="flex items-center justify-center flex-col gap-4">
							<svg
								className="h-12 mx-auto text-skyblue"
								viewBox="0 0 24 27"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z"
									fill="currentColor"
								/>
							</svg>
							<h3 className="w-full text-3xl font-semibold text-black/60">
								{item.description}
							</h3>

							<div className="w-full h-full flex items-center justify-center gap-4 mt-5">
								<h4 className="text-lg font-medium">
									{item.name}
								</h4>

								<Separator
									className="h-8"
									orientation="vertical"
								/>
								<h4 className="text-base font-medium text-black/60">
									{item.title}
								</h4>
							</div>
						</div>
					</SwiperSlide>
				))}
			</Swiper>
		</section>
	);
};

export default TestimonialSlider;
