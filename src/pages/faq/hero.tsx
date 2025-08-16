import SectionHeading, {
	SectionHeadingProps,
} from "@/components/section-heading";

const Hero = () => {
	const sectionHeadingProp: SectionHeadingProps = {
		title: "Welcome to Our FAQ Page",
		description:
			"We're here to answer all your questions about our products, services, and processes. If you don't find what you're looking for, feel free to contact us at info@dpmsign.com or +8801958253962.",
	};

	return (
		<section className="py-5">
			{/* Section Heading */}
			<SectionHeading
				title={sectionHeadingProp.title}
				description={sectionHeadingProp.description}
			/>
		</section>
	);
};

export default Hero;
