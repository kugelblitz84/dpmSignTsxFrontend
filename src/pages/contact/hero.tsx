import SectionHeading, {
	SectionHeadingProps,
} from "@/components/section-heading";
import { Link } from "react-router-dom";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import routes from "@/routes";

const Hero = () => {
	const sectionHeadingProp: SectionHeadingProps = {
		title: "Contact Dhaka Plastic & Metal - Your Trusted Branding Partner",
		description:
			"We're Here to Assist You - Reach Out for Inquiries, Orders, and Support.",
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
								to={routes.contact.path}
								className="text-base xl:text-lg"
							>
								<BreadcrumbLink className="font-medium hover:text-skyblue transition-all duration-300">
									Contact Us
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
