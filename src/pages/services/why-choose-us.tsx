import SectionHeading from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import {
	Award,
	Settings,
	Shield,
	Timer,
	Hammer,
	Users,
	LucideIcon,
} from "lucide-react";

interface WhyChooseUsCardProps {
	icon: LucideIcon;
	title: string;
	description: string;
}

const WhyChooseUsCard = ({
	icon: Icon,
	title,
	description,
}: WhyChooseUsCardProps) => {
	return (
		<div className="flex items-center flex-col gap-3 p-4 rounded-lg bg-secondary/50">
			<div className="w-full flex items-center gap-3">
				<div className="p-3 bg-skyblue/10 text-skyblue rounded-full">
					<Icon className="w-6 h-6" />
				</div>
				<h3 className="text-2xl font-semibold">{title}</h3>
			</div>
			<p className="text-sm font-semibold">{description}</p>
		</div>
	);
};

const WhyChooseUs = () => {
	const sectionHeadingProp = {
		title: "Why Choose Dhaka Plastic & Metal",
		description:
			"At Dhaka Plastic & Metal, we combine technology, creativity, and passion to deliver exceptional results. Here's why our clients trust us.",
	};

	const features = [
		{
			icon: Settings,
			title: "Fully Customizable Solutions",
			description:
				"Every product is tailored to your specifications - from size and material to design and finish.",
		},
		{
			icon: Award,
			title: "High-Quality Craftsmanship",
			description:
				"We use premium materials and state-of-the-art machinery to deliver products that exceed your expectations.",
		},
		{
			icon: Hammer,
			title: "Professional Installation",
			description:
				"Our team ensures signage is securely installed and positioned for optimal visibility and durability.",
		},
		{
			icon: Timer,
			title: "On-Time Delivery",
			description:
				"We ensure your orders are delivered within the agreed timeframe without compromising quality.",
		},
		{
			icon: Shield,
			title: "Trusted by Leading Organizations",
			description:
				"Our work speaks for itself, and we take pride in serving top corporates, educational institutions, and small businesses.",
		},
		{
			icon: Users,
			title: "Affordable Pricing",
			description:
				"We provide competitive pricing for customized products without compromising quality.",
		},
	];

	return (
		<section data-aos="fade-up" className="py-10">
			<SectionHeading
				title={sectionHeadingProp.title}
				description={sectionHeadingProp.description}
			/>

			<div className="row grid md:grid-cols-2 xl:grid-cols-3 gap-4 py-8">
				{features.map((feature, index) => (
					<WhyChooseUsCard
						key={index}
						icon={feature.icon}
						title={feature.title}
						description={feature.description}
					/>
				))}
			</div>

			<div className="row w-full text-center mt-5">
				<Button>Get a Quote Now</Button>
			</div>
		</section>
	);
};

export default WhyChooseUs;
