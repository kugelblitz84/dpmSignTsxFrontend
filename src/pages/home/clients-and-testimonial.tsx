import SectionHeading, {
	SectionHeadingProps,
} from "@/components/section-heading";
import TestimonialSlider from "@/components/testimonial-slider";
import ClientsSlider from "@/components/client-slider";

const ClientsAndTestimonial = () => {
	const sectionHeadingProp: SectionHeadingProps = {
		title: "Our Satisfied Clients",
		description:
			"Our valued clients trust Dhaka Plastic & Metal for delivering top-notch products and exceptional service. From small businesses to industry leaders, we are proud to support a diverse range of customers with innovative solutions tailored to their needs. Here's what some of them have to say about working with us.",
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

			{/* CLIENTS SLIDER */}
			<div className="row">
				<ClientsSlider />
			</div>
		</section>
	);
};

export default ClientsAndTestimonial;
