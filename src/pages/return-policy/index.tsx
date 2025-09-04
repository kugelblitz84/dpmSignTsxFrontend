import SectionHeading from "@/components/section-heading";

interface Section {
	title: string;
	content: React.ReactNode; // Content can be JSX, strings, or other React nodes
}

const ReturnPolicy = () => {
	const sectionHeadingProp = {
		title: "Return & Refund Policy",
		description:
			"Dhaka Plastic & Metal, we value every customer relationship and strive to deliver customized signage, award crests, and promotional or corporate gift items that exceed expectations. Since all our products are made-to-order, we follow a specific Return & Refund Policy to ensure clarity, fairness, and your peace of mind. This policy outlines the circumstances under which returns and refunds are processed, and how they are linked to our Exchange Policy.",
	};

	const sections: Section[] = [
		{
			title: "Return Policy",
			content: (
				<div className="space-y-4">
					<p className="text-lg font-semibold">
						Due to the customized nature of our products, we do not accept general returns. However, we do accept returns under the following condition:
					</p>
					<ul className="list-disc list-inside space-y-2 text-lg font-semibold font-manrope pl-8">
						<li>
							Return is only applicable if your product qualifies for an exchange under our Exchange Policy.
						</li>
						<li>
							This includes instances such as major manufacturing defects or clear mismatches with the approved design.
						</li>
					</ul>
					<p className="text-lg font-semibold">
						We encourage all customers to thoroughly review our Exchange Policy to understand eligibility for returns and replacements.
					</p>
				</div>
			),
		},
		{
			title: "Refund Policy",
			content: (
				<div className="space-y-4">
					<p className="text-lg font-semibold">
						We understand that circumstances can change. That's why we offer a flexible and transparent refund process based on the stage of your order:
					</p>
					
					<h4 className="font-semibold text-xl">Full Refund</h4>
					<p className="text-lg font-semibold">You are entitled to a full refund of your initial payment if:</p>
					<ul className="list-disc list-inside space-y-2 text-lg font-semibold font-manrope pl-8">
						<li>You cancel your order before the design approval is finalized.</li>
						<li>The production process has not yet started.</li>
					</ul>

					<h4 className="font-semibold text-xl">Partial Refund</h4>
					<ul className="list-disc list-inside space-y-2 text-lg font-semibold font-manrope pl-8">
						<li>If you cancel your order after approving the final design but before production begins, we will deduct a design fee and refund the rest.</li>
						<li>The design service charge ranges between BDT 200 to BDT 5,000, based on design complexity and order volume.</li>
						<li>The remaining balance will be refunded to your original payment method.</li>
					</ul>

					<h4 className="font-semibold text-xl">No Refund</h4>
					<p className="text-lg font-semibold">Refunds are not applicable in the following cases:</p>
					<ul className="list-disc list-inside space-y-2 text-lg font-semibold font-manrope pl-8">
						<li>Once production has started, cancellations are no longer accepted.</li>
						<li>The product matches the approved design, but does not meet personal preferences or expectations.</li>
						<li>The product was damaged after delivery due to mishandling or external factors.</li>
						<li>Errors occurred due to incorrect information provided during the order process.</li>
					</ul>
					<p className="text-lg font-semibold">
						If you are dissatisfied with the delivered product, we do not offer refunds—but we do provide replacements under the terms outlined in our Exchange Policy.
					</p>
				</div>
			),
		},
		{
			title: "Refund Timeline and Method",
			content: (
				<div className="space-y-4">
					<ul className="list-disc list-inside space-y-2 text-lg font-semibold font-manrope pl-8">
						<li>Once approved, refunds are processed within 3 to 5 business days.</li>
						<li>Refunds will be issued to the same payment method used for the original transaction, including:</li>
					</ul>
					<ul className="list-disc list-inside space-y-2 text-lg font-semibold font-manrope pl-16">
						<li>Bank transfer</li>
						<li>bKash</li>
						<li>Other approved payment channels</li>
					</ul>
				</div>
			),
		},
		{
			title: "Design Approval Responsibility",
			content: (
				<div className="space-y-4">
					<ul className="list-disc list-inside space-y-2 text-lg font-semibold font-manrope pl-8">
						<li>All products are manufactured strictly according to the design approved by you before production.</li>
						<li>We encourage you to carefully review all design elements, dimensions, colors, spelling, and layout—before final approval.</li>
						<li>Dhaka Plastic & Metal is not liable for any errors overlooked during this stage.</li>
					</ul>
				</div>
			),
		},
		{
			title: "Cancellation Policy",
			content: (
				<div className="space-y-4">
					<ul className="list-disc list-inside space-y-2 text-lg font-semibold font-manrope pl-8">
						<li>Orders can be canceled only before production starts.</li>
						<li>Cancellations are not accepted once production has begun due to the customized nature of our products.</li>
					</ul>
					<p className="text-lg font-semibold mt-4">
						We believe in transparency, fairness, and customer satisfaction. Please read our Exchange Policy for complete details on replacements and eligibility conditions.
					</p>
				</div>
			),
		},
	];

	return (
		<section className="py-6 xl:px-4 bg-gray-50">
			<SectionHeading
				title={sectionHeadingProp.title}
				description={sectionHeadingProp.description}
			/>

			<div className="row rounded-lg pt-10 p-6 xl:px-20 bg-slate-100/40 backdrop-blur-lg shadow-sm border border-gray/50">
				{sections.map((section, idx) => (
					<div key={idx} className="mb-8">
						<h2 className="text-xl xl:text-2xl font-semibold text-gray-800 mb-2">
							{section.title}
						</h2>
						<div className="text-gray-600 leading-relaxed">
							{section.content}
						</div>
					</div>
				))}
			</div>

			<div className="row rounded-lg pt-10 p-6">
				<div className="mb-8">
					<h2 className="text-xl xl:text-2xl font-semibold text-gray-800 mb-2">
						Still Have Questions?
					</h2>
					<div className="text-gray-600 leading-relaxed">
						<p className="text-lg font-semibold mb-4">
							Our support team is here to help with any concerns regarding your order, returns, or refunds.
						</p>
						<h3 className="text-lg font-semibold mb-2">Contact Information:</h3>
						<ul className="list-inside space-y-2 text-lg font-semibold font-manrope">
							<li>
								<strong>Email:</strong> customer.support@dpmsign.com
							</li>
							<li>
								<strong>Phone / WhatsApp:</strong> +880 1958253962
							</li>
							<li>
								<strong>Head Office:</strong> Shop-94, Dhaka University Market, Katabon Road, Dhaka-1000
							</li>
						</ul>
					</div>
				</div>
			</div>
		</section>
	);
};

export default ReturnPolicy;
