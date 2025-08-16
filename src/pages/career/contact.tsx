import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Mail, Phone } from "lucide-react";
import React from "react";

const Contact: React.FC = () => {
	return (
		<section className="py-10">
			<div className="row">
				<Card className="xl:w-[60%] mx-auto bg-slate-100/40 backdrop-blur-lg shadow-sm border-gray/50">
					<CardHeader>
						<CardTitle className="text-2xl">Contact Us</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid md:grid-cols-2 gap-8">
							<div className="space-y-4">
								<div className="flex items-center gap-3">
									<Mail size={20} className="text-skyblue" />
									<a
										href="mailto:career@dpmsign.com"
										className=" transition-all duration-300 hover:text-skyblue hover:underline"
									>
										career@dpmsign.com
									</a>
								</div>
								<div className="flex items-center gap-3">
									<Phone size={20} className="text-skyblue" />
									<a
										href="tel:+8801958253962"
										className=" transition-all duration-300 hover:text-skyblue hover:underline"
									>
										+8801958253962
									</a>
								</div>
							</div>
							<div className="space-y-4">
								<div className="flex items-center gap-3">
									<Building2
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
								<div className="flex items-center gap-3">
									<Building2
										size={20}
										className="text-skyblue"
									/>
									<div>
										<span className="text-lg font-semibold">
											Branch Office:
										</span>
										<p className="text-sm font-medium">
											Shop-142, Dhaka University Market,
											Katabon Road, Dhaka-1000
										</p>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</section>
	);
};

export default Contact;
