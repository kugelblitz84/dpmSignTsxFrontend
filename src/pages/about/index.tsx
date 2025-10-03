import Team from "@/pages/about/team";
import WhoWeAre from "@/pages/about/who-we-are";
import OurExpertise from "@/pages/about/our-expertise";
import Testimonial from "@/components/testimonial";
import Hero from "@/pages/about/hero";
import SEO from "@/components/seo";

const AboutUs = () => {
	return (
		<>
			<SEO
				title="About Dhaka Plastic & Metal | Signage & Corporate Branding"
				description="Discover the story of Dhaka Plastic & Metal. Learn about our mission, expertise, and commitment to delivering premium signage and branding since 2013."
			/>
			<Hero />
			<WhoWeAre />
			<OurExpertise />
			<Testimonial />
			<Team />
		</>
	);
};

export default AboutUs;
