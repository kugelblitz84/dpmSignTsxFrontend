import {
	Building2,
	GraduationCap,
	Store,
	Landmark,
	Building,
	PartyPopper,
	LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SectionHeading, {
	SectionHeadingProps,
} from "@/components/section-heading";

interface Industry {
	icon: LucideIcon; // Use IconType for Lucide icons
	title: string;
	description: string;
}

const IndustriesSection = () => {
	const sectionHeadingProp: SectionHeadingProps = {
		title: "Industries We Serve",
		description:
			"At Dhaka Plastic & Metal, we cater to a diverse range of industries, providing high-quality signage, award plaques, and branding solutions. Our products are designed to elevate your brand, recognize achievements, and create lasting impressions.",
	};

	const industries: Industry[] = [
		{
			icon: Building2,
			title: "Corporate Sector",
			description:
				"Professional signage, recognition plaques, and branding products.",
		},
		{
			icon: GraduationCap,
			title: "Educational Institutions",
			description: "Customized crests, honor boards, and signage.",
		},
		{
			icon: Store,
			title: "Retail & Hospitality",
			description:
				"Eye-catching signage and promotional items to attract customers.",
		},
		{
			icon: Landmark,
			title: "Government & NGOs",
			description:
				"Recognition products, plaques, and event branding solutions.",
		},
		{
			icon: Building,
			title: "Small Businesses",
			description:
				"Affordable branding solutions to elevate visibility and growth.",
		},
		{
			icon: PartyPopper,
			title: "Culture & Entertainment",
			description:
				"Customized signage, awards, and gifts for events and celebrations.",
		},
	];

	return (
		<section data-aos="fade-up" className="py-10">
			<SectionHeading
				title={sectionHeadingProp.title}
				description={sectionHeadingProp.description}
			/>

			<div className="row grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{industries.map((industry) => (
					<Card
						key={industry.title}
						className="bg-slate-100/40 backdrop-blur-lg shadow-sm border-gray/50"
					>
						<CardHeader>
							<CardTitle className="flex items-center justify-start gap-4">
								<industry.icon
									size={35}
									className="w-16 h-16 bg-skyblue/10 p-4 rounded-full text-skyblue"
								/>
								<h5 className="text-2xl font-semibold">
									{industry.title}
								</h5>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-base font-semibold">
								{industry.description}
							</p>
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
};

export default IndustriesSection;
