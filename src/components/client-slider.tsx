// Load all logos from all subfolders in clients
const corpLogos = Object.values(
	import.meta.glob(
		"@/assets/images/clients/Corporate Clients/*.{png,jpg,jpeg,svg,webp}",
		{ eager: true, as: "url" }
	)
) as string[];
const eduLogos = Object.values(
	import.meta.glob(
		"@/assets/images/clients/Educational Institutions/*.{png,jpg,jpeg,svg,webp}",
		{ eager: true, as: "url" }
	)
) as string[];
const govLogos = Object.values(
	import.meta.glob(
		"@/assets/images/clients/Government & NGOs/*.{png,jpg,jpeg,svg,webp}",
		{ eager: true, as: "url" }
	)
) as string[];
const smbLogos = Object.values(
	import.meta.glob(
		"@/assets/images/clients/Small Business & Retail/*.{png,jpg,jpeg,svg,webp}",
		{ eager: true, as: "url" }
	)
) as string[];
const allLogos = [...corpLogos, ...eduLogos, ...govLogos, ...smbLogos];

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Define the type for a client object
const ClientsSlider = () => {
	return (
		<section className="py-12 mt-6">
			<Swiper
				autoplay={{
					delay: 3000,
					disableOnInteraction: false,
					pauseOnMouseEnter: true,
				}}
				modules={[Autoplay]}
				spaceBetween={10}
				loop={true}
				breakpoints={{
					0: {
						slidesPerView: 1,
					},
					768: {
						slidesPerView: 3,
					},
					1024: {
						slidesPerView: 5,
					},
					1280: {
						slidesPerView: 6,
					},
				}}
			>
				{allLogos.map((logo, index) => (
					<SwiperSlide key={index}>
						<div className="flex items-center justify-center">
							<img
								src={logo}
								alt="Client logo"
								className="max-w-full lg:w-1/2 filter  hover:filter-none transition-all duration-300 cursor-pointer mx-auto"
							/>
						</div>
					</SwiperSlide>
				))}
			</Swiper>
		</section>
	);
};

export default ClientsSlider;
