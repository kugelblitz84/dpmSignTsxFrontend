import SectionHeading, {
	SectionHeadingProps,
} from "@/components/section-heading";
import InqueryForm from "@/components/inquery-form";

const Contact = () => {
	const sectionHeadingProp: SectionHeadingProps = {
		title: "Let's Talk!",
		description:
			"Fill out the form below or call us directly. We'll respond within 24 hours to assist you with inquiries, bulk orders, or support.",
	};

	return (
		<section id="contactform" data-aos="fade-up" className="py-8">
			<SectionHeading
				title={sectionHeadingProp.title}
				description={sectionHeadingProp.description}
			/>

			{/* Inquery Form */}
			<InqueryForm />
		</section>
	);
};

export default Contact;
