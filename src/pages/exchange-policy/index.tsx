import SectionHeading, {
	SectionHeadingProps,
} from "@/components/section-heading";

interface Section {
	title: string;
	content: JSX.Element;
}

const ExchangePolicy = () => {
	const sectionHeadingProp: SectionHeadingProps = {
		title: "Exchange Policy",
		description:
			"At Dhaka Plastic & Metal, we are committed to delivering high-quality products that meet your expectations. While we do not offer returns or refunds, we provide an exchange option under specific conditions to ensure your satisfaction. Please review the following terms carefully to understand the eligibility, process, and guidelines for product exchanges.",
	};

	const sections: Section[] = [
		{
			title: "Eligibility for Exchange",
			content: (
				<div className="space-y-4">
					<p className="text-lg font-semibold ">
						You may request an exchange under the following
						conditions:
					</p>
					<h4 className="font-semibold text-xl">
						A. Major Defects in Materials or Craftsmanship:
					</h4>
					<ul className="list-disc list-inside space-y-2 text-lg font-semibold font-manrope pl-8">
						<li>
							Exchanges are accepted if the product has
							significant defects that impact its quality,
							durability, or functionality.
						</li>
						<li>
							<strong>Examples:</strong> include broken materials,
							misaligned signage parts, or damaged edges that
							render the product unusable.
						</li>
					</ul>
					<p className="text-lg font-semibold font-manrope xl:pl-8">
						<strong>Note:</strong> Minor imperfections that do not
						affect product quality (e.g., small surface marks or
						slight color variations) do not qualify for an exchange.
					</p>

					<h4 className="font-semibold text-xl">
						B. Design Mismatch:
					</h4>
					<ul className="list-disc list-inside space-y-2 text-lg font-semibold font-manrope pl-8">
						<li>
							If the final delivered product does not match the
							<strong>
								{" "}
								approved design specifications
							</strong>{" "}
							(e.g., incorrect size, design, or spelling errors),
							it is eligible for exchange.
						</li>
						<li>
							Approved designs include the digital proof/mockup
							shared before production.
						</li>
					</ul>
				</div>
			),
		},
		{
			title: "Non-Exchangeable Items",
			content: (
				<div className="space-y-4">
					<p className="text-lg font-semibold">
						We cannot accept exchanges under the following
						circumstances:
					</p>
					<ul className="list-disc list-inside space-y-2 mt-2 text-lg font-semibold font-manrope pl-8">
						<li>
							Products with <strong>minor imperfections</strong>{" "}
							that do not affect overall functionality or
							appearance.
						</li>
						<li>
							Products that{" "}
							<strong>match the approved design</strong> but fail
							to meet subjective preferences.
						</li>
						<li>
							Damage caused after delivery due to{" "}
							<strong>improper handling</strong> or external
							factors.
						</li>
						<li>
							Customized products where design errors occurred due
							to <strong>incorrect information</strong> provided
							by the customer.
						</li>
					</ul>
				</div>
			),
		},
		{
			title: "Exchange Request Process",
			content: (
				<div className="space-y-4">
					<p className="text-lg font-semibold">
						Follow these simple steps to request an exchange:
					</p>
					<ol className="list-decimal list-inside space-y-4 mt-2 text-lg font-semibold font-manrope pl-8">
						<li>
							<strong>Notify Us:</strong> Contact us within{" "}
							<strong>24 hours</strong> of receiving the product
							via:
							<ul className="list-disc list-inside mt-2 space-y-1 pl-6">
								<li>
									<strong>Email:</strong>{" "}
									customer.support@dpmsign.com
								</li>
								<li>
									<strong>Phone/WhatsApp:</strong> +880
									1958253962
								</li>
							</ul>
						</li>
						<li>
							<strong>Provide Supporting Evidence:</strong> Share
							the following details:
							<ul className="list-disc list-inside mt-2 space-y-1 pl-6">
								<li>Order ID or Invoice Number.</li>
								<li>
									Photos or videos clearly showing the defect
									or mismatch.
								</li>
							</ul>
						</li>
						<li>
							<strong>Assessment and Approval:</strong>
							<ul className="list-disc list-inside mt-2 space-y-1 pl-6">
								<li>
									Our quality control team will review the
									request within{" "}
									<strong>3 business days</strong>.
								</li>
								<li>
									If the issue is confirmed, we will approve
									the exchange and provide next steps.
								</li>
							</ul>
						</li>
						<li>
							<strong>Product Collection/Return:</strong>
							<ul className="list-disc list-inside mt-2 space-y-1 pl-6">
								<li>
									You may need to send back the product to our
									workshop at:{" "}
									<strong>
										Vojjo Teler Goli, Near Bata Signal More,
										Elephant Road, Dhaka-1205
									</strong>
									.
								</li>
								<li>
									Dhaka Plastic & Metal{" "}
									<strong>
										does not cover return shipping costs
									</strong>
									. These must be borne by the customer.
								</li>
							</ul>
						</li>
						<li>
							<strong>Replacement Process:</strong>
							<ul className="list-disc list-inside mt-2 space-y-1 pl-6">
								<li>
									Once the returned product is received and
									reviewed, we will produce the replacement
									product and deliver it within the agreed{" "}
									<strong>timeline</strong>.
								</li>
								<li>
									No additional charges will apply for
									eligible exchanges.
								</li>
							</ul>
						</li>
					</ol>
				</div>
			),
		},
		{
			title: "Exchange Timeline",
			content: (
				<div className="space-y-4">
					<ul className="list-disc list-inside space-y-2 text-lg font-semibold font-manrope pl-8">
						<li>
							Exchange requests are reviewed within{" "}
							<strong>3 business days</strong>.
						</li>
						<li>
							Replacements are typically produced and delivered
							within <strong>7-15 business days</strong> (subject
							to production complexity and order volume).
						</li>
					</ul>
				</div>
			),
		},
		{
			title: "Design Approval Disclaimer",
			content: (
				<div className="space-y-4">
					<ul className="list-disc list-inside space-y-2 text-lg font-semibold font-manrope pl-8">
						<li>
							All customized products are produced based on the
							final approved design shared by the customer.
						</li>
						<li>
							We recommend carefully reviewing the design,
							dimensions, text, and specifications before
							approval.
						</li>
						<li>
							Dhaka Plastic & Metal is not liable for errors
							overlooked during the approval process.
						</li>
					</ul>
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
						Contact Us
					</h2>
					<div className="text-gray-600 leading-relaxed">
						<ul className="list-inside space-y-2 text-lg font-semibold font-manrope">
							<li>
								<strong>Head Office:</strong> Shop-94, Dhaka
								University Market, Katabon Road, Dhaka-1000
							</li>
							<li>
								<strong>Branch Office:</strong> Shop-142, Dhaka
								University Market, Katabon Road, Dhaka-1000
							</li>
							<li>
								<strong>Phone:</strong> +880 1958253962
							</li>
							<li>
								<strong>Email:</strong> info@dpmsign.com
							</li>
						</ul>
					</div>
				</div>
			</div>
		</section>
	);
};

export default ExchangePolicy;
