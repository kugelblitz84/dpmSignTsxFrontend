import SectionHeading from "@/components/section-heading";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

// Define the type for a single FAQ item
type FAQItem = {
	question: string;
	answer: string;
};

const FAQ = () => {
	// Array of FAQs with type safety
	const faqs: FAQItem[] = [
		{
			question: "What is the recruitment process?",
			answer: "The process includes: 1. Application submission and shortlisting, 2. Phone or in-person interview, 3. Final selection and offer letter.",
		},
		{
			question: "Can I apply for multiple positions?",
			answer: "Yes, you can apply for more than one position if you meet the qualifications.",
		},
		{
			question: "Do you provide training for new hires?",
			answer: "Yes, we provide orientation and role-specific training to help new hires succeed.",
		},
		{
			question: "Are internships paid?",
			answer: "Yes, our internship programs offer stipends based on performance and project involvement.",
		},
	];

	return (
		<section className="py-10">
			{/* Section Heading */}
			<SectionHeading title="Frequently Asked Questions" />

			{/* FAQ List */}
			<div className="row space-y-5">
				{faqs.map((faq, index) => (
					<Accordion
						key={index} // Add key prop here
						type="single"
						collapsible
						className="w-full xl:w-[60%] mx-auto rounded-lg bg-slate-100 backdrop-blur-lg shadow-sm border border-neutral-800"
					>
						<AccordionItem value={`item-${index}`}>
							<AccordionTrigger className="px-5 text-base data-[state=open]:text-skyblue">
								{faq.question}
							</AccordionTrigger>
							<AccordionContent className="px-5 space-y-4">
								<p className="text-sm font-semibold">
									{faq.answer}
								</p>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				))}
			</div>
		</section>
	);
};

export default FAQ;
