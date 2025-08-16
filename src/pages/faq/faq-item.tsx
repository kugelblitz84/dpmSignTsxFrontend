import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import SectionHeading from "@/components/section-heading";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import routes from "@/routes";

interface FAQ {
	id: string;
	question: string;
	answer: string;
}

interface FAQCategory {
	title: string;
	items: FAQ[];
}

interface FAQCardProps {
	faq: FAQ;
}

const FAQCard = ({ faq }: FAQCardProps) => {
	return (
		<Accordion
			type="single"
			collapsible
			className="w-full rounded-lg bg-slate-100 backdrop-blur-lg shadow-sm border border-neutral-800"
		>
			<AccordionItem value={faq.id}>
				<AccordionTrigger className="px-5 text-base data-[state=open]:text-skyblue">
					{faq.question}
				</AccordionTrigger>
				<AccordionContent className="px-5 space-y-4">
					<Separator className="h-[1px]" />
					<p className="text-sm font-semibold">{faq.answer}</p>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
};

const FAQItems = () => {
	const sectionHeadingProp = {
		title: "Frequently Asked Questions",
	};

	const faqs: FAQCategory[] = [
		{
			title: "General Questions",
			items: [
				{
					id: "general-1",
					question: "What industries or clients do you cater to?",
					answer: "We serve a diverse range of clients, including corporate organizations, educational institutions, government bodies, small businesses, and individuals looking for high-quality signage or customized gifts.",
				},
				{
					id: "general-2",
					question: "Why choose Dhaka Plastic & Metal?",
					answer: "We stand out due to our:\n- Commitment to quality and craftsmanship.\n- Fully customizable products.\n- Reliable delivery and customer service.\n- Competitive pricing.",
				},
				{
					id: "general-3",
					question: "Do you have a physical store?",
					answer: "Yes, we operate offline & online both to serve customers efficiently across Bangladesh.",
				},
				{
					id: "general-4",
					question:
						"How can I stay updated about new products and offers?",
					answer: "Subscribe to our newsletter at the bottom of the page or follow us on social media for regular updates.",
				},
			],
		},
		{
			title: "Products & Customization",
			items: [
				{
					id: "products-1",
					question: "Are there limitations to customization?",
					answer: "Most products are fully customizable. However, certain materials or designs may have technical or feasibility constraints. Our team will inform you during the design approval process.",
				},
				{
					id: "products-2",
					question:
						"Can I request a sample before placing a bulk order?",
					answer: "Yes, we offer samples for certain products. Sample costs and delivery charges may apply.",
				},
				{
					id: "products-3",
					question:
						"How do I know my design will look right on the product?",
					answer: "We share a digital proof/mockup for approval before production begins to ensure your satisfaction.",
				},
				{
					id: "products-4",
					question:
						"Do you offer environmentally friendly materials?",
					answer: "Yes, we have options for sustainable and eco-friendly materials, particularly for corporate gifts and signage.",
				},
				{
					id: "products-5",
					question: "Can I reorder the same design later?",
					answer: "Absolutely. We retain your approved design files for up to one year to simplify reorders.",
				},
			],
		},
		{
			title: "Ordering & Payment",
			items: [
				{
					id: "ordering-1",
					question: "Is there a minimum order quantity?",
					answer: "Yes, certain products like award plaques and keychains have a minimum order requirement. Details are mentioned on the respective product pages.",
				},
				{
					id: "ordering-2",
					question:
						"How do I calculate the cost of customized products?",
					answer: "Use the price estimator on our product pages. Enter your specifications (size, material, quantity) to get an estimated cost. Final pricing will be confirmed during order review.",
				},
				{
					id: "ordering-3",
					question: "Are there hidden charges?",
					answer: "No, all costs, including customization and delivery, are transparently communicated before finalizing the order.",
				},
				{
					id: "ordering-4",
					question: "Can I pay in installments for bulk orders?",
					answer: "Payment plans may be available for large corporate orders. Contact our sales team to discuss options.",
				},
			],
		},
		{
			title: "Delivery & Shipping",
			items: [
				{
					id: "delivery-1",
					question: "What areas do you deliver to?",
					answer: "We deliver across Bangladesh, including rural and remote locations. For detailed delivery zones, contact us.",
				},
				{
					id: "delivery-2",
					question: "Can I schedule delivery for a specific date?",
					answer: "Yes, scheduled delivery is available for certain products. Mention your preferred date during checkout or while placing your order.",
				},
				{
					id: "delivery-3",
					question: "What happens if my order is delayed?",
					answer: "In rare cases of delays, our team will keep you updated and prioritize resolution. Compensation may apply if the delay is significant and not caused by external factors.",
				},
				{
					id: "delivery-4",
					question: "How are products packaged for delivery?",
					answer: "Products are securely packaged using protective materials to ensure they arrive in perfect condition.",
				},
			],
		},
		{
			title: "Exchange & Replacement Policy",
			items: [
				{
					id: "exchange-1",
					question: "How long does it take to process an exchange?",
					answer: "Once approved, exchanges are typically processed within 7-10 business days, depending on the product.",
				},
				{
					id: "exchange-2",
					question:
						"What if the replacement product also has issues?",
					answer: "We conduct thorough quality checks before shipping replacements. In rare cases of repeated issues, contact our support team for immediate resolution.",
				},
				{
					id: "exchange-3",
					question:
						"Can I exchange a product for a different design or material?",
					answer: "Exchanges are only applicable for the same product type. Design or material changes will be considered a new order.",
				},
			],
		},
		{
			title: "Campus Ambassador & Business Partner Programs",
			items: [
				{
					id: "programs-1",
					question:
						"How can I track sales generated through my referral code as a Campus Ambassador?",
					answer: "After signing up, you’ll have access to a personal dashboard to track sales, commissions, and performance analytics.",
				},
				{
					id: "programs-2",
					question:
						"Are there performance bonuses for Campus Ambassadors?",
					answer: "Yes, top-performing ambassadors may receive additional bonuses based on monthly or quarterly targets.",
				},
				{
					id: "programs-3",
					question:
						"What support do you provide to business partners?",
					answer: "Business partners receive promotional materials, exclusive pricing, and dedicated account management support.",
				},
			],
		},
		{
			title: "Technical Support",
			items: [
				{
					id: "support-1",
					question: "Can I edit my order details after placing it?",
					answer: "Editing is allowed within 12 hours of placing the order. Contact our support team to make changes.",
				},
				{
					id: "support-2",
					question: "How do I reset my account password?",
					answer: "Click on 'Forgot Password' on the login page and follow the steps to reset your password.",
				},
				{
					id: "support-3",
					question:
						"What should I do if I experience a payment failure?",
					answer: "Check your payment details and try again. If the issue persists, contact us immediately at info@dpmsign.com or +8801958253962.",
				},
			],
		},
		{
			title: "Contact Us",
			items: [
				{
					id: "contact-1",
					question:
						"How quickly can I expect a response to my query?",
					answer: "Our customer support team typically responds within 24 hours during business hours.",
				},
				{
					id: "contact-2",
					question: "Do you offer live chat support?",
					answer: "Yes, live chat is available on our website during business hours for instant assistance.",
				},
			],
		},
	];

	return (
		<section data-aos="fade-up" className="py-12">
			<SectionHeading title={sectionHeadingProp.title} />

			<div className="row py-8 grid grid-cols-1 xl:grid-cols-2 gap-10 place-content-start place-items-start">
				{faqs.map((faq, index) => (
					<div
						key={index}
						className="w-full flex items-start justify-center flex-col gap-4"
					>
						<h3 className="text-2xl font-semibold text-skyblue">
							{faq.title}
						</h3>

						{faq.items.map((item) => (
							<FAQCard key={item.id} faq={item} />
						))}
					</div>
				))}
			</div>

			<div className="row py-8 flex items-center justify-center flex-col gap-4">
				<p className="text-base font-semibold text-neutral-800 underline">
					Can't find the answer you're looking for?
				</p>
				<Link to={routes.contact.path}>
					<Button>Contact Us</Button>
				</Link>
			</div>
		</section>
	);
};

export default FAQItems;
