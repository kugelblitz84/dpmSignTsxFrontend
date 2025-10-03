import Testimonial from "@/components/testimonial";
import ClientDetails from "@/pages/clients/client-details";
import ContactSection from "@/pages/clients/contact-section";
import IndustriesSection from "@/pages/clients/industries-section";
import ProjectShowcase from "@/pages/clients/project-showcase";
import Hero from "@/pages/clients/hero";
import SEO from "@/components/seo";

const OurClients = () => {
	return (
		<>
			<SEO
				title="Clients of Dhaka Plastic & Metal | Trusted by Top Brands"
				description="We are proud to have served a diverse range of corporate, educational, and government clients across Bangladesh. See the leading brands we've worked with."
			/>
			<Hero />
			<ClientDetails />
			<Testimonial />
			<IndustriesSection />
			<ProjectShowcase />
			<ContactSection />
		</>
	);
};

export default OurClients;
