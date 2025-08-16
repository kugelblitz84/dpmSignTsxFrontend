import { Button } from "@/components/ui/button";
import SectionHeading, {
	SectionHeadingProps,
} from "@/components/section-heading";
import { Link } from "react-router-dom";
import BannerImg from "@/assets/images/working.jpg";
import routes from "@/routes";

const AboutUs = () => {
	const sectionHeadingProp: SectionHeadingProps = {
		title: "Who We Are",
		description:
			"Crafting Excellence in Signage, Awards, and Corporate Gifts.",
	};

	return (
		<section data-aos="fade-up" className="py-8">
			<SectionHeading
				title={sectionHeadingProp.title}
				// description={sectionHeadingProp.description}
			/>

			<div className="row py-8 grid grid-cols-1 xl:grid-cols-2 gap-8">
				<div className="w-full flex items-center xl:items-start justify-center flex-col gap-8">
					{/* <h4 className="text-4xl font-semibold">
                        This is about headline
                    </h4> */}
					<p className="text-base font-semibold w-[95%] xl:w-[90%] text-justify">
						Dhaka Plastic & Metal started its journey in 2013 as a
						small shop in the Dhaka University Market, Katabon, with
						a vision to deliver high-quality signage and branding
						solutions in Bangladesh. Over the years, we have grown
						into a leading manufacturer and retailer, setting
						benchmarks in the industry with premium 3D signage,
						award plaques, corporate gifts, and branding products.
						Our expertise in custom designs and innovative
						craftsmanship has made us the go-to partner for
						corporates, educational institutions, and government
						organizations across Bangladesh. From LED acrylic
						signboards to engraved plaques and nameplates, we turn
						ideas into impactful visual solutions that boost brand
						visibility and recognition.
					</p>
					<p className="text-base font-semibold w-[95%] xl:w-[90%] text-justify">
						Driven by a passion for quality, precision, and customer
						satisfaction, we continue to lead the market with
						tailor-made designs, cutting-edge technology, and
						affordable pricing. Whether you need dynamic signage for
						your storefront, recognition plaques for achievements,
						or branded corporate accessories, we offer end-to-end
						solutions—from design to delivery. Join Dhaka Plastic &
						Metal in elevating your brand identity and creating
						lasting impressions that stand out in Bangladesh's
						growing business landscape.
					</p>

					<Link to={routes.about.path}>
						<Button variant="outline" size="sm">
							Learn More
						</Button>
					</Link>
				</div>
				<div className="w-full flex items-start justify-center">
					<img
						src={BannerImg}
						alt="About Us Banner"
						className="max-w-full xl:max-w-[80%] rounded-md border-2 border-skyblue shadow-lg"
					/>
				</div>
			</div>
		</section>
	);
};

export default AboutUs;
