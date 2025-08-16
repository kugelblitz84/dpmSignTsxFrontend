import SectionHeading, {
	SectionHeadingProps,
} from "@/components/section-heading";
import { useState, useEffect } from "react";
import CountUp from "react-countup";

interface Fact {
	title: string;
	count: number;
	suffix: string;
}

const Facts = () => {
	const sectionHeadingProp: SectionHeadingProps = {
		title: "Our Success in Numbers",
		description:
			"Building Trust Through Excellence, Quality, and Innovation",
	};

	const factsData: Fact[] = [
		{
			title: "Years of Excellence",
			count: 12,
			suffix: "+",
		},
		{
			title: "Satisfied Clients",
			count: 100000,
			suffix: "+",
		},
		{
			title: "Successful Projects Completed",
			count: 25000,
			suffix: "+",
		},
		{
			title: "Products Sold",
			count: 500000,
			suffix: "+",
		},
		{
			title: "Team of Experts",
			count: 25,
			suffix: "+",
		},
	];

	const [isVisible, setIsVisible] = useState<boolean>(false);

	// Intersection Observer to trigger animation when the section is visible
	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
				}
			},
			{ threshold: 0.5 }
		);

		const projectsSection = document.getElementById("projects");
		if (projectsSection) observer.observe(projectsSection);

		return () => {
			if (projectsSection) observer.unobserve(projectsSection);
		};
	}, []);

	return (
		<section
			id="projects"
			className="mt-8 py-20 bg-transparent relative overflow-hidden backdrop:blur-[250px] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:bg-factsBg before:bg-cover before:bg-center before:bg-no-repeat before:bg-fixed before:opacity-95 before:-z-[1] before:backdrop:blur-[250px] after:content-[''] after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0 after:opacity-85 after:-z-[1] after:backdrop:blur-[250px] after:bg-shapesBg after:bg-fixed"
		>
			<SectionHeading
				title={sectionHeadingProp.title}
				description={sectionHeadingProp.description}
				variant="white"
			/>

			<div className="row grid grid-cols-1 xl:grid-cols-5 gap-40 xl:gap-4 place-items-center h-auto py-10 mt-10 text-white">
				{factsData.map((fact, index) => (
					<div
						key={index}
						className="flex items-center justify-center flex-col gap-2"
					>
						{isVisible && (
							<CountUp
								end={fact.count}
								duration={4}
								delay={0.5}
								suffix={fact.suffix}
								className="text-6xl font-bold"
							/>
						)}
						<h5 className="text-lg font-medium">{fact.title}</h5>
					</div>
				))}
			</div>
		</section>
	);
};

export default Facts;
