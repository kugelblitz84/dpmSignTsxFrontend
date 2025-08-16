import SectionHeading, {
	SectionHeadingProps,
} from "@/components/section-heading";
import { Layers, Gift, Award, LucideIcon } from "lucide-react";

// Define the type for the ExpertiseCard props
interface ExpertiseCardProps {
	icon: LucideIcon; // Lucide icons are compatible with IconType
	title: string;
	description: string;
}

// Define the type for a feature object
interface Feature {
	icon: LucideIcon;
	title: string;
	description: string;
}

// ExpertiseCard component
const ExpertiseCard = ({
	icon: Icon,
	title,
	description,
}: ExpertiseCardProps) => {
	return (
		<div className="flex flex-col items-center text-center px-6 py-10 shadow-sm rounded-lg gap-2 border-gray/50 border-2rem bg-slate-100/40 backdrop-blur-lg">
			<div className="p-5 bg-skyblue/10 text-skyblue rounded-full">
				<Icon className="w-8 h-8" />
			</div>
			<h3 className="text-2xl font-semibold">{title}</h3>
			<p className="w-[80%] mx-auto text-base font-semibold">
				{description}
			</p>
		</div>
	);
};

const OurExpertise = () => {
	const sectionHeadingProp: SectionHeadingProps = {
		title: "Our Expertise",
		description:
			"Our commitment to precision and excellence ensures that every product reflects your unique identity.",
	};

	const features: Feature[] = [
		{
			icon: Layers, // Replace with the appropriate icon for "3D Signage Solutions"
			title: "3D Signage Solutions",
			description:
				"3D LED acrylic signboards, neon signs, and lightbox signage.",
		},
		{
			icon: Award, // Replace with the appropriate icon for "Award Plaques (Crests)"
			title: "Award Plaques (Crests)",
			description:
				"Customized recognition plaques for institutions, corporates, and events.",
		},
		{
			icon: Gift, // Replace with the appropriate icon for "Corporate Gifts"
			title: "Corporate Gifts",
			description:
				"Personalized keychains, mugs, paperweights, table stands, and nameplates.",
		},
	];

	return (
		<section data-aos="fade-up" className="py-10">
			<SectionHeading
				title={sectionHeadingProp.title}
				description={sectionHeadingProp.description}
			/>

			<div className="row grid xl:grid-cols-3 place-content-baseline gap-4 py-8">
				{features.map((feature, index) => (
					<ExpertiseCard
						key={index}
						icon={feature.icon}
						title={feature.title}
						description={feature.description}
					/>
				))}
			</div>
		</section>
	);
};

export default OurExpertise;
