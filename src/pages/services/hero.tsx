import SectionHeading from "@/components/section-heading";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import routes from "@/routes";
import { Link } from "react-router-dom";

const Hero: React.FC = () => {
	const sectionHeadingProp = {
		title: "Our Services",
	};

	return (
		<section className="py-5 bg-heroBanner bg-cover bg-no-repeat bg-center text-white">
			{/* Section Heading */}
			<SectionHeading title={sectionHeadingProp.title} variant="white" />

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
								to={routes.services.path}
								className="text-base xl:text-lg"
							>
								<BreadcrumbLink className="text-white font-medium hover:text-skyblue transition-all duration-300">
									Our Services
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
