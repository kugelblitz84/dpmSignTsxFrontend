import { Link } from "react-router-dom";
import SectionHeading from "@/components/section-heading";

interface Section {
	title: string;
	content: React.ReactNode; // Content can be JSX, strings, or other React nodes
}

const ReturnPolicy = () => {
	const sectionHeadingProp = {
		title: "Return Policy",
		description:
			"At Dhaka Plastic & Metal, we are committed to delivering high-quality products and ensuring customer satisfaction. We strive for perfection in every product we deliver. While we do not offer refunds or returns, we are committed to providing a replacement for eligible issues as outlined below",
	};

	const sections: Section[] = [
		{
			title: "Replacement Policy",
			content: (
				<div className="space-y-4">
					<p className="text-lg font-semibold ">
						We will provide a replacement for the same product under
						the following conditions:
					</p>
					<h4 className="font-semibold text-xl">
						A. Major Defects in Materials or Craftsmanship:
					</h4>
					<ul className="list-disc list-inside space-y-2 text-lg font-semibold font-manrope pl-8">
						<li>
							Products with significant defects that impact
							functionality or appearance are eligible.
						</li>
						<li>
							Minor imperfections are not considered for
							replacement
						</li>
					</ul>

					<h4 className="font-semibold text-xl">
						B. Mismatch with Approved Design Specifications:
					</h4>
					<ul className="list-disc list-inside space-y-2 text-lg font-semibold font-manrope pl-8">
						<li>
							If the delivered product does not align with the
							design specifications you approved during the order
							process, it will qualify for a replacement.
						</li>
					</ul>
				</div>
			),
		},
		{
			title: "Non-Eligible Cases",
			content: (
				<div className="space-y-4">
					<p className="text-lg font-semibold">
						The following cases are not eligible for replacement:
					</p>
					<ul className="list-disc space-y-2 text-lg font-semibold font-manrope pl-8">
						<li>
							<strong>Minor Defects:</strong> Small or minor
							defects that do not affect functionality or
							appearance.
						</li>
						<li>
							<strong>Design Changes:</strong> Changes to the
							design or specifications after approval.
						</li>
						<li>
							<strong>Damage Post-Delivery:</strong> Products
							damaged due to misuse or mishandling after delivery.
						</li>
					</ul>
				</div>
			),
		},
		{
			title: "Replacement Process",
			content: (
				<div className="space-y-4">
					<p className="text-lg font-semibold">
						Follow these steps to initiate the replacement process:
					</p>
					<ul className="list-decimal space-y-2 text-lg font-semibold font-manrope pl-8">
						<li>
							<strong>Contact Us:</strong> Notify us within 24
							hours of receiving the product by emailing{" "}
							<Link
								to="mailto:info@dpmsign.com"
								className="text-skyblue"
							>
								info@dpmsign.com
							</Link>{" "}
							or calling{" "}
							<Link
								to="tel:+8801958253961"
								className="text-skyblue"
							>
								+8801958253961
							</Link>
							.
						</li>
						<li>
							<strong>Provide Details:</strong> Include your order
							ID, photos of the issue, and a description of the
							problem.
						</li>
						<li>
							<strong>Review:</strong> Our team will review the
							request and confirm if the product qualifies for
							replacement.
						</li>
						<li>
							<strong>Replacement Timeline:</strong> Once
							approved, the replacement will be produced and
							delivered within 7-15 business days, depending on
							the complexity of the product.
						</li>
					</ul>
				</div>
			),
		},
		{
			title: "Cancellation Policy",
			content: (
				<div className="space-y-4">
					<p className="text-lg font-semibold">
						Our cancellation policy is as follows:
					</p>
					<ul className="list-decimal space-y-2 text-lg font-semibold font-manrope pl-8">
						<li>
							<strong>Within 24 Hours:</strong> Orders can be
							canceled within 24 hours of placement for a full
							refund.
						</li>
						<li>
							<strong>After 24 Hours:</strong> Cancellations may
							not be possible for customized products if
							production has started.
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

export default ReturnPolicy;
