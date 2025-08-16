import SectionHeading, {
	SectionHeadingProps,
} from "@/components/section-heading";

const Hero = () => {
	// Define the props for SectionHeading with TypeScript types
	const sectionHeadingProps: SectionHeadingProps = {
		title: "Careers at Dhaka Plastic & Metal",
		description: "Shape the Future of Branding Solutions with Us",
		variant: "white", // Assuming 'variant' is a valid prop for SectionHeading
	};

	return (
		<section className="py-36 bg-careerBanner bg-cover bg-no-repeat bg-center">
			<SectionHeading
				title={sectionHeadingProps.title}
				description={sectionHeadingProps.description}
				variant={sectionHeadingProps.variant}
			/>
		</section>
	);
};

export default Hero;
