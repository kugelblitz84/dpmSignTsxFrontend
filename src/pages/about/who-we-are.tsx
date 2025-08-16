import AboutUsTimeline from "@/components/about-us-timeline";
import SectionHeading, {
	SectionHeadingProps,
} from "@/components/section-heading";

const WhoWeAre = () => {
	const sectionHeadingProp: SectionHeadingProps = {
		title: "Who We Are",
		description:
			"At Dhaka Plastic & Metal, we bring your vision to life through innovative branding solutions. Specializing in 3D signage, award plaques (crests), and custom corporate gifts, we take pride in delivering products that resonate with quality, craftsmanship, and creativity. From small businesses to large organizations, we help clients across Bangladesh make a lasting impact.",
	};

	return (
		<section data-aos="fade-up" className="py-10">
			{/* Section Heading */}
			<SectionHeading
				title={sectionHeadingProp.title}
				description={sectionHeadingProp.description}
			/>

			<div className="row py-10">
				<h2 className="w-full text-center text-3xl lg:text-4xl font-semibold pb-16">
					Our Journey
				</h2>
				<AboutUsTimeline />
			</div>
		</section>
	);
};

export default WhoWeAre;
