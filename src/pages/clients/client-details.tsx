import SectionHeading from "@/components/section-heading";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import React from "react";

// Collect logos from new folder structure (use exact folder names)
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

const ClientDetails: React.FC = () => {
	const sectionHeadingProp = {
		title: "Our Valued Clients",
		description:
			"We are honored to have worked with some of the most respected organizations and institutions in Bangladesh, including:",
	};

	return (
		<section data-aos="fade-up" className="py-10">
			<SectionHeading
				title={sectionHeadingProp.title}
				description={sectionHeadingProp.description}
			/>

			<div className="row py-10 grid grid-cols-1 xl:grid-cols-3 gap-10">
				<div className="flex items-center justify-center flex-col gap-10 bg-skyblue/10 py-8 rounded-lg drop-shadow-2xl">
					<h4 className="text-3xl font-semibold text-skyblue">Corporate Clients</h4>
					<Swiper
						autoplay={{
							delay: 3000,
							disableOnInteraction: false,
							pauseOnMouseEnter: true,
						}}
						modules={[Autoplay]}
						loop={true}
						slidesPerView={3}
					>
						{corpLogos.map((logo, index) => (
							<SwiperSlide key={`corp-${index}`}>
								<div className="flex items-center justify-center">
									<img
										src={logo}
										alt="Client logo"
										className="w-1/2 filter hover:filter-none transition-all duration-300 cursor-pointer mx-auto"
									/>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				</div>

				<div className="flex items-center justify-center flex-col gap-10 bg-skyblue/10 py-8 rounded-lg drop-shadow-2xl">
					<h4 className="text-3xl font-semibold text-skyblue">Educational Institutions</h4>
					<Swiper
						autoplay={{
							delay: 3000,
							disableOnInteraction: false,
							pauseOnMouseEnter: true,
						}}
						modules={[Autoplay]}
						loop={true}
						slidesPerView={3}
					>
						{eduLogos.map((logo, index) => (
							<SwiperSlide key={`edu-${index}`}>
								<div className="flex items-center justify-center">
									<img
										src={logo}
										alt="Client logo"
										className="w-1/2 filter hover:filter-none transition-all duration-300 cursor-pointer mx-auto"
									/>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				</div>

				<div className="flex items-center justify-center flex-col gap-10 bg-skyblue/10 py-8 rounded-lg drop-shadow-2xl">
					<h4 className="text-3xl font-semibold text-skyblue">Government & NGOs</h4>
					<Swiper
						autoplay={{
							delay: 3000,
							disableOnInteraction: false,
							pauseOnMouseEnter: true,
						}}
						modules={[Autoplay]}
						loop={true}
						slidesPerView={3}
					>
						{govLogos.map((logo, index) => (
							<SwiperSlide key={`gov-${index}`}>
								<div className="flex items-center justify-center">
									<img
										src={logo}
										alt="Client logo"
										className="w-1/2 filter hover:filter-none transition-all duration-300 cursor-pointer mx-auto"
									/>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			</div>

			<div className="row py-10 flex items-center justify-center flex-col gap-10">
				<h4 className="text-3xl font-semibold text-skyblue">Small Business & Retail</h4>
				<p className="text-base font-medium text-center">
					Numerous small businesses, retail outlets, and hospitality brands across the country have trusted us for their branding solutions.
				</p>
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
						0: { slidesPerView: 1 },
						768: { slidesPerView: 3 },
						1024: { slidesPerView: 5 },
						1280: { slidesPerView: 6 },
					}}
				>
					{smbLogos.map((logo, index) => (
						<SwiperSlide key={`smb-${index}`}>
							<div className="flex items-center justify-center">
								<img
									src={logo}
									alt="Client logo"
									className="max-w-full lg:w-1/2 filter hover:filter-none transition-all duration-300 cursor-pointer mx-auto"
								/>
							</div>
						</SwiperSlide>
					))}
				</Swiper>
			</div>
		</section>
	);
};

export default ClientDetails;
