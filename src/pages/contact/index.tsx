import GetInTouch from "@/components/get-in-touch";
import Newsletter from "@/pages/contact/newsletter";
import OurLocations from "@/pages/contact/our-locations";
import Hero from "@/pages/contact/hero";
import SEO from "@/components/seo";

const ContactUs = () => {
	return (
		<>
			<SEO
				title="Contact Us | Get a Free Quote | Dhaka Plastic & Metal"
				description="Get in touch with us for free consultation and quote. Contact Dhaka's top signage and branding experts for your next project. We're here to help."
			/>
			<Hero />
			<OurLocations />
			<GetInTouch />
			<Newsletter />
		</>
	);
};

export default ContactUs;
