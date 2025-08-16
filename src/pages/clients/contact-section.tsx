import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin } from "lucide-react";
import SectionHeading from "@/components/section-heading";
import React from "react";

const ContactSection: React.FC = () => {
	const sectionHeadingProp = {
		title: "Let's Work Together",
		description:
			"Do you want to elevate your brand with our custom signage, plaques, or corporate gifts? Reach out today to discuss your project requirements.",
	};

	return (
		<section data-aos="fade-up" className="py-10">
			<SectionHeading
				title={sectionHeadingProp.title}
				description={sectionHeadingProp.description}
			/>

			<div className="row py-8">
				<Card className="xl:w-[80%] bg-slate-100/40 backdrop-blur-lg shadow-sm border-gray/50 mx-auto">
					<CardContent className="grid xl:grid-cols-3 place-items-start gap-6 p-6">
						{/* Phone Section */}
						<div className="flex items-start xl:items-center justify-start xl:justify-center gap-4 xl:flex-col">
							<div className="bg-primary/10 p-3 rounded-full">
								<Phone
									className="xl:h-16 xl:w-16 w-12 h-12 text-skyblue bg-skyblue/10 rounded-full p-3 xl:p-4"
									size={35}
								/>
							</div>
							<div className="w-full flex items-start xl:items-center xl:justify-center gap-2 flex-col xl:text-center">
								<h3 className="text-xl font-semibold">Phone</h3>
								<p className="text-base font-semibold">
									+880 1958253962
								</p>
							</div>
						</div>

						{/* Email Section */}
						<div className="flex items-start xl:items-center justify-start xl:justify-center gap-4 xl:flex-col">
							<div className="bg-primary/10 p-3 rounded-full">
								<Mail
									className="xl:h-16 xl:w-16 w-12 h-12 text-skyblue bg-skyblue/10 rounded-full p-3 xl:p-4"
									size={35}
								/>
							</div>
							<div className="w-full flex items-start xl:items-center xl:justify-center gap-2 flex-col xl:text-center">
								<h3 className="text-xl font-semibold">Email</h3>
								<p className="text-base font-semibold">
									info@dpmsign.com
								</p>
							</div>
						</div>

						{/* Address Section */}
						<div className="flex items-start xl:items-center justify-start xl:justify-center gap-4 xl:flex-col">
							<div className="bg-primary/10 p-3 rounded-full">
								<MapPin
									className="xl:h-16 xl:w-16 w-12 h-12 text-skyblue bg-skyblue/10 rounded-full p-3 xl:p-4"
									size={35}
								/>
							</div>
							<div className="w-full flex items-start xl:items-center xl:justify-center gap-2 flex-col xl:text-center">
								<h3 className="text-xl font-semibold">
									Visit Us
								</h3>
								<p className="text-base font-semibold">
									Head Office: Shop-94, Dhaka University
									Market, Katabon Road, Dhaka-1000
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</section>
	);
};

export default ContactSection;
