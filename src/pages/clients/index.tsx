import Hero from "@/pages/clients/hero";
import Testimonial from "@/components/testimonial";
import ClientDetails from "@/pages/clients/client-details";
import ContactSection from "@/pages/clients/contact-section";
import IndustriesSection from "@/pages/clients/industries-section";
import ProjectShowcase from "@/pages/clients/project-showcase";

const OurClients = () => {
	return (
		<>
			{/* <Hero /> */}
			<ClientDetails />
			<Testimonial />
			<IndustriesSection />
			<ProjectShowcase />
			<ContactSection />
		</>
	);
};

export default OurClients;
