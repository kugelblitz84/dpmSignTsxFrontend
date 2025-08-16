import SectionHeading from "@/components/section-heading";

import BracImg from "@/assets/images/clients/brac.png";
import BaImg from "@/assets/images/clients/bangladesh-army.png";
import BpdbImg from "@/assets/images/clients/bangladesh-power-development-board.png";
import BkashImg from "@/assets/images/clients/bkash.png";
import BupImg from "@/assets/images/clients/bup.png";
import PranImg from "@/assets/images/clients/pran.png";
import RflImg from "@/assets/images/clients/rfl.png";
import RunnerImg from "@/assets/images/clients/runner.png";
import WaltonImg from "@/assets/images/clients/walton.png";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import React from "react";

type Client = {
	title: string;
	img: string;
	url: string;
};

const ClientDetails: React.FC = () => {
	const sectionHeadingProp = {
		title: "Our Valued Clients",
		description:
			"We are honored to have worked with some of the most respected organizations and institutions in Bangladesh, including:",
	};

	const clients: Client[] = [
		{
			title: "Brac",
			img: BracImg,
			url: "/",
		},
		{
			title: "Bangladesh Army",
			img: BaImg,
			url: "/",
		},
		{
			title: "Bangladesh Power Development Board",
			img: BpdbImg,
			url: "/",
		},
		{
			title: "Bkash",
			img: BkashImg,
			url: "/",
		},
		{
			title: "BUP",
			img: BupImg,
			url: "/",
		},
		{
			title: "Pran",
			img: PranImg,
			url: "/",
		},
		{
			title: "RFL",
			img: RflImg,
			url: "/",
		},
		{
			title: "Runner",
			img: RunnerImg,
			url: "/",
		},
		{
			title: "Walton",
			img: WaltonImg,
			url: "/",
		},
	];

	return (
		<section data-aos="fade-up" className="py-10">
			<SectionHeading
				title={sectionHeadingProp.title}
				description={sectionHeadingProp.description}
			/>

			<div className="row py-10 grid grid-cols-1 xl:grid-cols-3 gap-10">
				<div className="flex items-center justify-center flex-col gap-10 bg-skyblue/10 py-8 rounded-lg drop-shadow-2xl">
					<h4 className="text-3xl font-semibold text-skyblue">
						Corporate Clients
					</h4>
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
						{clients.map((client, index) => (
							<SwiperSlide key={index}>
								<div className="flex items-center justify-center">
									<img
										src={client.img}
										alt={client.title}
										className="w-1/2 filter  hover:filter-none transition-all duration-300 cursor-pointer mx-auto"
									/>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				</div>

				<div className="flex items-center justify-center flex-col gap-10 bg-skyblue/10 py-8 rounded-lg drop-shadow-2xl">
					<h4 className="text-3xl font-semibold text-skyblue">
						Educational Institutions
					</h4>
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
						{clients.map((client, index) => (
							<SwiperSlide key={index}>
								<div className="flex items-center justify-center">
									<img
										src={client.img}
										alt={client.title}
										className="w-1/2 filter  hover:filter-none transition-all duration-300 cursor-pointer mx-auto"
									/>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				</div>

				<div className="flex items-center justify-center flex-col gap-10 bg-skyblue/10 py-8 rounded-lg drop-shadow-2xl">
					<h4 className="text-3xl font-semibold text-skyblue">
						Government & NGOs
					</h4>
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
						{clients.map((client, index) => (
							<SwiperSlide key={index}>
								<div className="flex items-center justify-center">
									<img
										src={client.img}
										alt={client.title}
										className="w-1/2 filter  hover:filter-none transition-all duration-300 cursor-pointer mx-auto"
									/>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			</div>

			<div className="row py-10 flex items-center justify-center flex-col gap-10">
				<h4 className="text-3xl font-semibold text-skyblue">
					Small Business & Retail
				</h4>
				<p className="text-base font-medium text-center">
					Numerous small businesses, retail outlets, and hospitality
					brands across the country have trusted us for their branding
					solutions.
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
					{clients.map((client, index) => (
						<SwiperSlide key={index}>
							<div className="flex items-center justify-center">
								<img
									src={client.img}
									alt={client.title}
									className="max-w-full lg:w-1/2 filter  hover:filter-none transition-all duration-300 cursor-pointer mx-auto"
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
