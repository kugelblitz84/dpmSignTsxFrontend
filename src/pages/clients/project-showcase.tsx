import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import SectionHeading, {
	SectionHeadingProps,
} from "@/components/section-heading";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import Img1 from "@/assets/images/project-showcase/3D Signage for Apex Bangladesh.png";
import Img2 from "@/assets/images/project-showcase/Acrylic Backlit Nameplate for EMK Centre.png";
import Img3 from "@/assets/images/project-showcase/Honour Board for Supreme Court of Bangladesh.png";
import Img4 from "@/assets/images/project-showcase/Custom Award Plaques Crest for Dhaka College.png";
import Img5 from "@/assets/images/project-showcase/Custom Design Lapel Pin for 41st BCS Admin Cadre.png";
import Img6 from "@/assets/images/project-showcase/Paperweight for Prime Asset Group.png";

import routes from "@/routes";

interface Project {
	id: string;
	title: string;
	description: string;
	image: string;
	tags: string[];
}

const ProjectShowcase = () => {
	const sectionHeadingProp: SectionHeadingProps = {
		title: "Project Showcase",
		description:
			"Here's a glimpse of some projects we've completed for our clients",
	};

	const projects: Project[] = [
		{
			id: "1",
			title: "3D Signage for Apex Bangladesh",
			description:
				"Modern 3D LED signage with illuminated letters, enhancing Apex Bangladesh's corporate identity and office entrance visibility.",
			image: Img1,
			tags: ["Corporate", "3D Signage", "3D LED Letter"],
		},
		{
			id: "2",
			title: "Acrylic Backlit Nameplate for EMK Centre",
			description:
				"Elegant acrylic backlit nameplate for EMK Centre, combining premium materials and LED lighting for a modern look.",
			image: Img2,
			tags: ["Office Decor", "Acrylic Nameplate", "Backlit"],
		},
		{
			id: "3",
			title: "Honour Board for Supreme Court",
			description:
				"Custom honour board for the Supreme Court of Bangladesh, showcasing prestige and achievements with premium materials.",
			image: Img3,
			tags: ["Institutional", "Honour Board", "Recognition"],
		},
		{
			id: "4",
			title: "Award Plaques for Dhaka College",
			description:
				"Elegant award plaques (Crest) for Dhaka College, celebrating excellence and achievements with custom designs and finishes.",
			image: Img4,
			tags: ["Education", "Awards", "Crests", "Custom Design"],
		},
		{
			id: "5",
			title: "Lapel Pin for 41st BCS Cadre",
			description:
				"Custom lapel pins for the 41st BCS Admin Cadre, symbolizing achievement, unity, and professional identity.",
			image: Img5,
			tags: ["Corporate Gifts", "Lapel Pin", "Custom Design"],
		},
		{
			id: "6",
			title: "Customize Acrylic Paperweight for Prime Asset Group",
			description:
				"Stylish paperweights for Prime Asset Group, designed as corporate gifts and office décor with branded engravings.",
			image: Img6,
			tags: ["Corporate Gifts", "Paperweight", "Office Accessories"],
		},
	];

	return (
		<section data-aos="fade-up" className="py-10">
			<SectionHeading
				title={sectionHeadingProp.title}
				description={sectionHeadingProp.description}
			/>

			<div className="row py-8">
				<Swiper
					autoplay={{
						delay: 1200,
						disableOnInteraction: false,
						pauseOnMouseEnter: true,
					}}
					modules={[Autoplay]}
					spaceBetween={30}
					loop={true}
					breakpoints={{
						0: {
							slidesPerView: 1,
						},
						768: {
							slidesPerView: 2,
						},
						1280: {
							slidesPerView: 3,
						},
					}}
				>
					{projects.map((project, index) => (
						<SwiperSlide key={index}>
							<Card className="overflow-hidden w-[80%] h-full mx-auto lg:w-full bg-slate-100/40 backdrop-blur-lg shadow-sm border-gray/50">
								<img
									src={project.image}
									alt={project.title}
									className="w-full h-96 object-cover object-center"
								/>
								<CardHeader>
									<CardTitle className="text-xl">
										<h5 className="text-2xl font-semibold">
											{project.title}
										</h5>
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-5">
									<p className="text-base font-medium">
										{project.description}
									</p>
									<div className="flex flex-wrap gap-2">
										{project.tags.map((tag) => (
											<Badge key={tag}>{tag}</Badge>
										))}
									</div>
								</CardContent>
							</Card>
						</SwiperSlide>
					))}
				</Swiper>
			</div>

			<div className="row py-1 flex items-center justify-center">
				<Link to={routes.products.path}>
					<Button variant="secondary">
						Check Our Products
						<ArrowRight />
					</Button>
				</Link>
			</div>
		</section>
	);
};

export default ProjectShowcase;
