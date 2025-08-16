import SectionHeading from "@/components/section-heading";
import ServiceCard from "@/pages/services/service-card";
import {
	Gift,
	Drill,
	Lightbulb,
	Package,
	Trophy,
	Tag,
	LucideIcon,
} from "lucide-react";
import ServiceImg1 from "@/assets/images/services/3D Signage Solutions.jpg";
import ServiceImg2 from "@/assets/images/services/Award Plaques (Crests).jpg";
import ServiceImg3 from "@/assets/images/services/Corporate & Promotional Gifts.jpg";
import ServiceImg4 from "@/assets/images/services/Corporate & Home Nameplates.jpg";
import ServiceImg5 from "@/assets/images/services/Corporate Branding Products.jpg";
import ServiceImg6 from "@/assets/images/services/Signage Installation.jpg";

interface Feature {
	title: string;
	description: string;
}

interface Extra {
	title: string;
	description: string[];
}

export interface Service {
	img: string;
	icon: LucideIcon;
	title: string;
	subtitle: string;
	description: string;
	features: {
		title: string;
		description: Feature[];
	};
	extra: Extra;
	cta: string;
}

export const coreServices: Service[] = [
	{
		img: ServiceImg1,
		icon: Lightbulb,
		title: "3D Signage Solutions",
		subtitle: "Make your brand stand out!",
		description:
			"Our premium 3D signage services help businesses create impactful brand visibility. Using modern techniques and quality materials, we design and manufacture signage solutions that grab attention.",
		features: {
			title: "What We Offer",
			description: [
				{
					title: "LED Acrylic Signboards",
					description:
						"Bright, durable, and energy-efficient for day and night visibility.",
				},
				{
					title: "Neon Signs",
					description:
						"Trendy and stylish for both indoor and outdoor branding.",
				},
				{
					title: "Lightbox Signage",
					description:
						"Perfect for high-impact advertising with illuminated displays.",
				},
			],
		},
		extra: {
			title: "Industries We Serve",
			description: [
				"Retail, Hospitality, Corporate Offices, and Small Businesses.",
			],
		},
		cta: "Get a Free Consultation",
	},
	{
		img: ServiceImg2,
		icon: Trophy,
		title: "Award Plaques (Crests)",
		subtitle: "Celebrate Achievements with Elegance",
		description:
			"We design and craft award plaques that recognize excellence and honor accomplishments. Whether for corporate events, educational institutions, or government organizations, our plaques reflect quality and prestige.",
		features: {
			title: "What We Offer",
			description: [
				{
					title: "Corporate Crests",
					description:
						"Personalized awards for corporate recognition.",
				},
				{
					title: "Event Trophies",
					description:
						"Elegant and durable awards for competitions and ceremonies.",
				},
			],
		},
		extra: {
			title: "Customization Options",
			description: [
				"Materials: Acrylic, wood, glass, or metal.",
				"Design: Shape, color, text engraving, and logos.",
			],
		},
		cta: "Design your Award Plaque",
	},
	{
		img: ServiceImg3,
		icon: Gift,
		title: "Corporate & Promotional Gifts",
		subtitle: "Leave a Lasting Impression",
		description:
			"Customized corporate gifts are a great way to build relationships, promote your brand, and express appreciation. We offer fully personalized solutions for every occasion.",
		features: {
			title: "What We Offer",
			description: [
				{
					title: "Keychains & Nameplates",
					description:
						"Personalized for employees, clients, or giveaways.",
				},
				{
					title: "Custom Mugs",
					description:
						"High-quality printed mugs for promotions or gifts",
				},
				{
					title: "Paperweights & Table Stands",
					description: "Elegant accessories for workspaces.",
				},
				{
					title: "Coat Pins & Badges",
					description: "Ideal for events and institutional branding.",
				},
			],
		},
		extra: {
			title: "Benefits",
			description: [
				"Fully customized to reflect your brand.",
				"Bulk discounts available for corporate orders.",
			],
		},
		cta: "Explore Corporate Gifts",
	},
	{
		img: ServiceImg4,
		icon: Tag,
		title: "Corporate & Home Nameplates",
		subtitle: "Personalized Nameplates for Every Need",
		description:
			"We specialize in creating elegant corporate and home nameplates that combine functionality with aesthetics. Whether it's for an office, workspace, or home, our nameplates are designed to leave a lasting impression.",
		features: {
			title: "What We Offer",
			description: [
				{
					title: "Corporate Office Nameplates",
					description: "Perfect for boardrooms, desks, and doors.",
				},
				{
					title: "Home Nameplates",
					description:
						"Stylish options for houses, apartments, and personal spaces.",
				},
				{
					title: "Material Options",
					description: "Acrylic, wood, stainless steel, or metal.",
				},
				{
					title: "Design Features",
					description:
						"Customized sizes, engraved names, logos, and multi-color finishes.",
				},
			],
		},
		extra: {
			title: "Benefits",
			description: [
				"Durable and weather-resistant materials.",
				"Custom designs to suit your preferences and branding.",
				"Ideal for professionals, families, and businesses.",
			],
		},
		cta: "Customize Your Nameplate",
	},
	{
		img: ServiceImg5,
		icon: Package,
		title: "Corporate Branding Products",
		subtitle: "Elevate Your Brand Presence with Customized Accessories",
		description:
			"We provide a wide range of corporate branding products to enhance your workspace aesthetics and event visibility. Ideal for conferences, meetings, and office interiors, these products showcase professionalism and branding consistency.",
		features: {
			title: "What We Offer",
			description: [
				{
					title: "Table Nameplates",
					description:
						"Engraved and printed nameplates for boardrooms and conferences.",
				},
				{
					title: "Conference Nameplates",
					description:
						"Customizable, durable nameplates for events and meetings",
				},
				{
					title: "Honor Boards",
					description:
						"Wall-mounted boards for schools, colleges, and organizations.",
				},
				{
					title: "Cross Flags",
					description:
						"Elegant flags representing your corporate identity or country.",
				},
				{
					title: "Desk Accessories",
					description:
						"Customized corporate desk items such as stands, clocks, and signage.",
				},
			],
		},
		extra: {
			title: "Benefits",
			description: [
				"Enhance brand visibility in professional settings.",
				"Fully customizable to include logos, names, and event themes.",
				"Perfect for corporate events, official meetings, and boardrooms.",
			],
		},
		cta: "Explore Branding Accessories",
	},
	{
		img: ServiceImg6,
		icon: Drill,
		title: "Signage Installation",
		subtitle: "Seamless and Professional Installation Services",
		description:
			"We don't just design and manufacture your signage - we also ensure that it is installed perfectly. Our experienced installation team guarantees seamless fitting and secure placement for both indoor and outdoor signage.",
		features: {
			title: "What We Offer",
			description: [
				{
					title: "On-Site Installation",
					description:
						"Professional installation of LED, neon, and lightbox signage.",
				},
				{
					title: "Safety and Precision",
					description:
						"Proper alignment, secure fitting, and compliance with safety standards.",
				},
				{
					title: "Maintenance Support",
					description:
						"Post-installation maintenance to ensure long-lasting performance.",
				},
			],
		},
		extra: {
			title: "Benefits of Our Installation Services",
			description: [
				"Professional and timely execution.",
				"No hassle - we handle the entire process.",
				"Perfect fitting for maximum impact.",
			],
		},
		cta: "Schedule Your Installation",
	},
];

const CoreServices = () => {
	const sectionHeadingProp = {
		title: "Core Services",
		description: "Customized Branding, Recognition, and Signage Solutions.",
	};

	return (
		<section data-aos="fade-up" className="py-10">
			{/* Core Services */}
			<SectionHeading
				title={sectionHeadingProp.title}
				description={sectionHeadingProp.description}
			/>

			<div className="row space-y-6">
				{coreServices.map((service, index) => (
					<ServiceCard
						key={index}
						index={index}
						serviceItem={service}
					/>
				))}
			</div>
		</section>
	);
};

export default CoreServices;
