import SectionHeading, {
	SectionHeadingProps,
} from "@/components/section-heading";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import routes from "@/routes";
import { coreServices, Service } from "@/pages/services/core-services";

interface ServiceCardProps {
	serviceItem: Service;
}

const Services = () => {
	const sectionHeadingProp: SectionHeadingProps = {
		title: "Our Services",
		description:
			"Explore the wide array of services we offer at Dhaka Plastic & Metal, tailored to meet your unique needs. From precision manufacturing to customized solutions, we are committed to delivering excellence every step of the way!",
	};

	return (
		<section data-aos="fade-up" className="py-8">
			<SectionHeading
				title={sectionHeadingProp.title}
				description={sectionHeadingProp.description}
			/>

			<div className="row py-8">
				<Swiper
					autoplay={{
						delay: 1200,
						disableOnInteraction: false,
						pauseOnMouseEnter: true,
					}}
					modules={[Autoplay]}
					spaceBetween={20}
					loop={true}
					breakpoints={{
						0: {
							slidesPerView: 1,
						},
						768: {
							slidesPerView: 2,
						},
						1280: {
							slidesPerView: 3,
						},
					}}
				>
					{coreServices.map((service, index) => (
						<SwiperSlide key={index}>
							<ServiceCard serviceItem={service} />
						</SwiperSlide>
					))}
				</Swiper>
			</div>

			<div className="row py-8 flex items-center justify-center">
				<Link to={routes.services.path}>
					<Button>Read More</Button>
				</Link>
			</div>
		</section>
	);
};

const ServiceCard = ({ serviceItem }: ServiceCardProps) => {
	const IconComponent = serviceItem.icon;

	return (
		<Card className="shadow-lg w-full h-full flex items-start justify-start flex-col gap-5 overflow-hidden">
			<div className="w-full">
				<img
					src={serviceItem.img}
					alt={serviceItem.title}
					className="max-w-full"
				/>
			</div>

			<div className="w-full flex items-start justify-between flex-col gap-5 p-4">
				<div className="flex items-center justify-center gap-3">
					<div className="p-3 bg-skyblue/10 text-skyblue rounded-full">
						<IconComponent className="w-6 h-6 text-primary" />
					</div>
					<h3 className="text-2xl font-semibold">
						{serviceItem.title}
					</h3>
				</div>

				<div className="space-y-2 text-left">
					<h5 className="text-lg font-semibold">
						{serviceItem.subtitle}
					</h5>
					<p className="text-base font-semibold">
						{serviceItem.description}
					</p>
				</div>

				<Button variant="outline" size="sm" className="w-full">
					{serviceItem.cta}
				</Button>
			</div>
		</Card>
	);
};

export default Services;
