import FAQItems from "@/pages/faq/faq-item";
import Hero from "@/pages/faq/hero";
import SEO from "@/components/seo";

const FAQ = () => {
	return (
		<>
			<SEO
				title="Frequently Asked Questions (FAQ) | Dhaka Plastic & Metal"
				description="Find answers to common questions about our signage products, design process, materials, installation, and pricing. Your queries, answered."
			/>
			<Hero />
			<FAQItems />
		</>
	);
};

export default FAQ;
