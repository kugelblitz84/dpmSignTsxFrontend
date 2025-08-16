import { Link } from "react-router-dom";
import SectionHeading, {
	SectionHeadingProps,
} from "@/components/section-heading";
import { Button } from "@/components/ui/button";
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
		title: "About Dhaka Plastic & Metal",
		description:
			"Crafting Excellence in Signage, Awards, and Corporate Gifts.",
	};

	return (
		<section className="py-5 bg-heroBanner bg-cover bg-no-repeat bg-center text-white">
			{/* Section Heading */}
			<SectionHeading
				title={sectionHeadingProp.title}
				description={sectionHeadingProp.description}
				variant="white"
			/>

			<div className="row flex items-center justify-center py-2 gap-5">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<Link
								to={routes.home.path}
								className="text-base xl:text-lg"
							>
								<BreadcrumbLink className="text-white font-medium hover:text-skyblue transition-all duration-300">
									Home
								</BreadcrumbLink>
							</Link>
						</BreadcrumbItem>
						<BreadcrumbSeparator className="text-white font-medium" />
						<BreadcrumbItem>
							<Link
								to={routes.about.path}
								className="text-base xl:text-lg"
							>
								<BreadcrumbLink className="text-white font-medium hover:text-skyblue transition-all duration-300">
									About
								</BreadcrumbLink>
							</Link>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>

			<div className="row py-2 flex items-center justify-center">
				<Link to={routes.products.path}>
					<Button>Explore Our Products</Button>
				</Link>
			</div>
		</section>
	);
};

export default Hero;
