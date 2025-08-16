import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Building2, GraduationCap, Mail, MapPin, Phone } from "lucide-react";
import ProgramCard, { Program } from "@/pages/partner-with-us/program-card";
import StepCard from "@/pages/partner-with-us/step-card";
import SectionHeading from "@/components/section-heading";

interface Step {
	title: string;
	description: string;
}

const PartnerWithUs: React.FC = () => {
	const programs: Program[] = [
		{
			title: "Campus Ambassador Program",
			icon: GraduationCap,
			description:
				"Become a Campus Ambassador to gain real-world experience, develop skills, and earn incentives. Promote Dhaka Plastic & Metal's products in your network and grow with us.",
			benefits: [
				"Earn 5-15% incentives on confirmed orders (excluding the first order as a test)",
				"Build your marketing and leadership skills",
				"Get certificates and letters of recommendation",
			],
			requirements: [
				"Students currently enrolled in universities or colleges",
				"Passionate about marketing and branding",
			],
		},
		{
			title: "Small Business Partnership Program",
			icon: Building2,
			description:
				"Expand your business offerings by partnering with us. Buy or manufacture products at a discount and resell to your customers for profit.",
			benefits: [
				"Exclusive discounts on bulk orders",
				"Access to marketing materials and catalogs",
				"Additional profits through resale options",
			],
			requirements: [
				"Small Business Owners or retailers with valid business registration or ID",
			],
		},
	];

	const steps: Step[] = [
		{
			title: "Apply",
			description:
				"Email us at info@dhakaplastics.com or visit our office with your details.",
		},
		{
			title: "Verification",
			description:
				"Submit student ID for ambassadors or business verification for partners.",
		},
		{
			title: "Marketing & Promotion",
			description:
				"Use flyers and catalogs to promote our products online or offline.",
		},
		{
			title: "Order Submission",
			description:
				"Collect orders and submit them via email, WhatsApp, or forms.",
		},
		{
			title: "Payment & Incentives",
			description:
				"Earn 5–15% incentives after successful delivery. Payments sent via bank transfer, bKash, or Nagad.",
		},
		{
			title: "Rewards",
			description:
				"Top performers get bonuses, certificates, and advanced opportunities.",
		},
	];

	return (
		<>
			{/* Hero Section */}
			<section className="py-10">
				<SectionHeading
					title="Grow with Dhaka Plastic & Metal"
					description="Expand Your Opportunities Today!"
				/>

				<div className="row space-y-16 py-4">
					<div className="grid gap-10 md:grid-cols-2">
						{programs.map((program, index) => (
							<ProgramCard key={index} program={program} />
						))}
					</div>
				</div>
			</section>

			{/* How It Works */}
			<section className="py-10">
				<div className="row">
					<SectionHeading title="How It Works" />

					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 py-4">
						{steps.map((step, index) => (
							<StepCard key={index} step={index + 1} {...step} />
						))}
					</div>
				</div>
			</section>

			{/* Contact Section */}
			<section className="py-10">
				<div className="row">
					<Card className="xl:w-[60%] mx-auto bg-slate-100/40 backdrop-blur-lg shadow-sm border-gray/50">
						<CardHeader>
							<CardTitle className="text-2xl xl:text-center">
								Start Growing with Us!
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-around w-full pb-6">
								<div className="flex items-center justify-center gap-4">
									<Mail size={20} className="text-skyblue" />
									<a
										href="mailto:career@dpmsign.com"
										className=" transition-all duration-300 hover:text-skyblue hover:underline"
									>
										career@dpmsign.com
									</a>
								</div>

								<div className="flex items-center justify-center gap-4">
									<Phone size={20} className="text-skyblue" />
									<a
										href="tel:+8801958253962"
										className=" transition-all duration-300 hover:text-skyblue hover:underline"
									>
										+8801958253962
									</a>
								</div>

								<div className="flex items-center justify-center gap-4">
									<MapPin
										size={20}
										className="text-skyblue"
									/>
									<div>
										<span className="text-lg font-semibold">
											Head Office:
										</span>
										<p className="text-sm font-medium">
											Shop-94, Dhaka University Market,
											Katabon Road, Dhaka-1000
										</p>
									</div>
								</div>
							</div>
							<div className="w-full flex items-start xl:items-center flex-col gap-4">
								<Separator className="opacity-20" />
								<Button size="sm">Apply Now →</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</section>
		</>
	);
};

export default PartnerWithUs;
