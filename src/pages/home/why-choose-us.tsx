import { Link } from "react-router-dom";
import SectionHeading, {
	SectionHeadingProps,
} from "@/components/section-heading";
import { Button } from "@/components/ui/button";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { BadgeCheck, ShieldCheck, Cog, LucideIcon } from "lucide-react";
import routes from "@/routes";

interface SpecialtyCard {
	icon: LucideIcon;
	title: string;
	description: string;
	button: {
		title: string;
		link: string;
	};
}

interface WhyChooseUsCardProps {
	icon: LucideIcon;
	title: string;
	description: string;
	button: {
		title: string;
		link: string;
	};
}

const WhyChooseUs = () => {
	const sectionHeadingProp: SectionHeadingProps = {
		title: "Why Choose Us",
		description:
			"At Dhaka Plastic & Metal, we combine technology, creativity, and passion to deliver exceptional results. Here's why our clients trust us.",
	};

	const ourSpecialties: SpecialtyCard[] = [
		{
			icon: BadgeCheck,
			title: "Product Quality & Standard",
			description:
				"We are committed to providing our customers with high-quality products that meet or exceed the relevant industry standards.",
			button: {
				title: "Shop Now",
				link: routes.products.path,
			},
		},
		{
			icon: ShieldCheck,
			title: "Guarantee and Warranty",
			description:
				"We stand behind our products and services and offer our customers a guarantee and warranty for them.",
			button: {
				title: "Know More",
				link: routes.about.path,
			},
		},
		{
			icon: Cog,
			title: "Customization",
			description:
				"We offer a wide range of customization as per our customer requirements.",
			button: {
				title: "Contact Us",
				link: routes.contact.path,
			},
		},
	];

	return (
		<section data-aos="fade-up" className="py-8">
			<SectionHeading
				title={sectionHeadingProp.title}
				description={sectionHeadingProp.description}
			/>

			<div className="row py-10">
				<Swiper
					autoplay={{
						delay: 1200,
						disableOnInteraction: false,
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
					{ourSpecialties.map((card, index) => (
						<SwiperSlide key={index}>
							<WhyChooseUsCard
								key={index}
								icon={card.icon}
								title={card.title}
								description={card.description}
								button={card.button}
							/>
						</SwiperSlide>
					))}
				</Swiper>
			</div>
		</section>
	);
};

const WhyChooseUsCard = ({
	icon: Icon,
	title,
	description,
	button,
}: WhyChooseUsCardProps) => {
	return (
		<div className="w-full h-full flex items-center justify-center flex-col gap-4 text-center px-6 py-10 shadow-sm rounded-lg border-gray/50 border-2rem bg-slate-100/40 backdrop-blur-lg">
			<div className="p-5 bg-skyblue/10 text-skyblue rounded-full">
				<Icon className="w-8 h-8" />
			</div>
			<h3 className="text-2xl font-semibold">{title}</h3>
			<p className="w-[80%] mx-auto text-base font-semibold">
				{description}
			</p>
			<Link to={button.link}>
				<Button>{button.title}</Button>
			</Link>
		</div>
	);
};

export default WhyChooseUs;
