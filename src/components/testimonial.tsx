import SectionHeading, {
	SectionHeadingProps,
} from "@/components/section-heading";
import TestimonialSlider from "@/components/testimonial-slider";

const Testimonial = () => {
	const sectionHeadingProp: SectionHeadingProps = {
		title: "What Our Customer Say",
		description:
			"At Dhaka Plastic & Metal, we value the environment. We aim to minimize waste during production and offer eco-friendly materials whenever possible, ensuring a sustainable future for all.",
	};

	return (
		<section data-aos="fade-up" className="py-12">
			<SectionHeading
				title={sectionHeadingProp.title}
				description={sectionHeadingProp.description}
			/>

			{/* TESTIMONIAL SLIDER */}
			<div className="row">
				<TestimonialSlider />
			</div>
		</section>
	);
};

export default Testimonial;
