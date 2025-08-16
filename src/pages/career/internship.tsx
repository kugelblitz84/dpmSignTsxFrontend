import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useJobs } from "@/hooks/use-job";
import { GraduationCap } from "lucide-react";
import React from "react";

const Internship: React.FC = () => {
	const { jobs } = useJobs();

	if (jobs.length === 0) return null;

	return (
		<section className="py-8">
			<div className="row">
				<Card className="xl:w-[70%] mx-auto bg-slate-100/40 backdrop-blur-lg shadow-sm border-gray/50">
					<CardHeader>
						<div className="flex items-center gap-3">
							<GraduationCap size={35} className="text-skyblue" />
							<CardTitle className="text-2xl">Internship Program</CardTitle>
						</div>
					</CardHeader>
					<CardContent>
						<h3 className="text-xl font-semibold mb-4">
							Kickstart Your Career with Real-World Experience
						</h3>
						<div className="grid md:grid-cols-2 gap-8">
							<div>
								<h4 className="font-semibold mb-2">As an intern, you will:</h4>
								<ul className="list-disc pl-5 space-y-2">
									<li>
										Gain hands-on experience in graphic design, sales, or
										marketing
									</li>
									<li>
										Work closely with industry professionals on live projects
									</li>
									<li>
										Develop valuable skills that prepare you for the future
									</li>
								</ul>
							</div>
							<div>
								<h4 className="font-semibold mb-2">Eligibility:</h4>
								<ul className="list-disc pl-5 space-y-2">
									<li>Current university students or recent graduates</li>
									<li>
										Eager to learn and adapt in a dynamic work environment
									</li>
								</ul>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</section>
	);
};

export default Internship;
