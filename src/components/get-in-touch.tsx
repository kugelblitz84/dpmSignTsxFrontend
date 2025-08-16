import InqueryForm from "@/components/inquery-form";
import SectionHeading, {
	SectionHeadingProps,
} from "@/components/section-heading";

const GetInTouch = () => {
	const sectionHeadingProp: SectionHeadingProps = {
		title: "Get In Touch",
		description:
			"Fill out the form below or call us directly. We'll respond within 24 hours to assist you with inquiries, bulk orders, or support.",
	};

	return (
		<section data-aos="fade-up" className="py-1">
			<SectionHeading
				title={sectionHeadingProp.title}
				description={sectionHeadingProp.description}
			/>

			{/* Inquery Form */}
			<InqueryForm />
		</section>
	);
};

export default GetInTouch;
