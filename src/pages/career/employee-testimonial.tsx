import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const EmployeeTestimonial = () => {
	// Define types for testimonials
	interface Testimonial {
		id: number;
		name: string;
		role: string;
		image: string;
		testimonial: string;
	}

	// Testimonials data
	const testimonials: Testimonial[] = [
		{
			id: 1,
			name: "Habib Ahmed",
			role: "Graphics Designer",
			image: "https://github.com/shadcn.png",
			testimonial:
				"At Dhaka Plastic & Metal, I've had the chance to grow my skills as a designer while working on exciting projects. It's a team that values creativity.",
		},
		{
			id: 2,
			name: "Saad",
			role: "Sales Executive",
			image: "https://github.com/shadcn.png",
			testimonial:
				"The leadership here truly supports your growth. I've closed deals with top clients and learned so much along the way.",
		},
		{
			id: 3,
			name: "Habib Ahmed",
			role: "Graphics Designer",
			image: "https://github.com/shadcn.png",
			testimonial:
				"At Dhaka Plastic & Metal, I've had the chance to grow my skills as a designer while working on exciting projects. It's a team that values creativity.",
		},
	];

	return (
		<section className="py-16">
			<div className="row grid grid-cols-1 xl:grid-cols-2 gap-2 rounded-lg overflow-hidden">
				<div className="max-w-2xl mx-auto flex items-center lg:items-start justify-center gap-4 flex-col lg:py-16">
					<h2 className="text-3xl font-medium">
						Hear from our employees
					</h2>
					<p className="max-w-lg text-slate-950/50 text-base font-medium text-justify">
						We believe in nurturing a diverse and inclusive team. We
						value the contributions of our employees and are
						committed to their growth and development. Here's what
						some of our employees have to say about us.
					</p>
				</div>

				<div className="lg:max-w-6xl w-full h-full mx-auto overflow-hidden relative py-16">
					<div className="w-full flex items-center justify-center">
						<Swiper
							autoplay={{
								delay: 3000,
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
							}}
						>
							{testimonials.map((item, index) => (
								<SwiperSlide key={index}>
									<div className="w-full h-full flex items-center justify-center flex-col gap-8 bg-white border border-gray/50 rounded-lg px-5 py-10">
										<div className="w-full text-xl text-black/60 italic">
											"{item.testimonial}"
										</div>
										<div className="w-full flex items-center gap-2 flex-col">
											<Avatar>
												<AvatarImage src={item.image} />
												<AvatarFallback>
													{item.name}
												</AvatarFallback>
											</Avatar>

											<div className="">
												<h3 className="font-medium text-lg">
													{item.name}
												</h3>
												<h5 className="font-normal text-base">
													{item.role}
												</h5>
											</div>
										</div>
									</div>
								</SwiperSlide>
							))}
						</Swiper>
					</div>

					<div className="pointer-events-none absolute inset-y-0 right-0 w-[20%] invisible lg:visible lg:w-[60%] bg-gradient-to-l from-neutral-200 z-10"></div>
				</div>
			</div>
		</section>
	);
};

export default EmployeeTestimonial;
