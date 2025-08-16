import SectionHeading, {
	SectionHeadingProps,
} from "@/components/section-heading";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Link } from "react-router-dom";
import routes from "@/routes";

const Hero = () => {
	const sectionHeadingProp: SectionHeadingProps = {
		title: "Trusted by Leading Organizations Across Bangladesh",
		description:
			"At Dhaka Plastic & Metal, we take pride in partnering with businesses, educational institutions, government organizations, and individuals to deliver high-quality 3D signage, award plaques, and corporate branding solutions. Our commitment to craftsmanship, innovation, and customer satisfaction has earned us the trust of a diverse range of clients.",
	};

	return (
		<section className="py-5">
			{/* Section Heading */}
			<SectionHeading
				title={sectionHeadingProp.title}
				description={sectionHeadingProp.description}
			/>

			<div className="row flex items-center justify-center py-2 gap-5">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<Link
								to={routes.home.path}
								className="text-base xl:text-lg"
							>
								<BreadcrumbLink className="font-medium hover:text-skyblue transition-all duration-300">
									Home
								</BreadcrumbLink>
							</Link>
						</BreadcrumbItem>
						<BreadcrumbSeparator className="font-medium" />
						<BreadcrumbItem>
							<Link
								to={routes.clients.path}
								className="text-base xl:text-lg"
							>
								<BreadcrumbLink className="font-medium hover:text-skyblue transition-all duration-300">
									Our Clients
								</BreadcrumbLink>
							</Link>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>
		</section>
	);
};

export default Hero;
