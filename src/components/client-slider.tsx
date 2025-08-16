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

// Define the type for a client object
interface Client {
	title: string;
	img: string;
	url: string;
}

const ClientsSlider = () => {
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
		</section>
	);
};

export default ClientsSlider;
