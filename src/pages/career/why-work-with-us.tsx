import SectionHeading from "@/components/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

type Benefit = {
	title: string;
	description: string;
};

const WhyWorkWithUs: React.FC = () => {
	const benefits: Benefit[] = [
		{
			title: "Career Growth",
			description:
				"Opportunities to develop your skills and advance in a growing company.",
		},
		{
			title: "Collaborative Environment",
			description:
				"Work with a team of passionate professionals who inspire and support each other.",
		},
		{
			title: "Creativity & Innovation",
			description:
				"Be part of a company where ideas and creativity drive results.",
		},
		{
			title: "Recognition & Rewards",
			description:
				"Your hard work and achievements will always be valued and celebrated.",
		},
		{
			title: "Work-Life Balance",
			description:
				"Flexible work conditions that help you thrive personally and professionally.",
		},
		{
			title: "Learning Opportunities",
			description:
				"Regular training sessions and workshops to enhance your skills.",
		},
	];

	return (
		<section className="py-2">
			<SectionHeading title="Why Work With Us" />

			<div className="row grid grid-cols-1 md:grid-cols-3 gap-6">
				{benefits.map((benefit, index) => (
					<Card
						key={index}
						className="bg-slate-100/40 backdrop-blur-lg shadow-sm border-gray/50"
					>
						<CardHeader>
							<CardTitle className="text-xl font-semibold">
								{benefit.title}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-base font-medium">
								{benefit.description}
							</p>
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
};

export default WhyWorkWithUs;
