import GetInTouch from "@/components/get-in-touch";
import CoreServices from "@/pages/services/core-services";
import OurProcess from "@/pages/services/our-process";
import WhyChooseUs from "@/pages/services/why-choose-us";
import Hero from "@/pages/services/hero";
import SEO from "@/components/seo";

const OurServices = () => {
	return (
		<>
			<SEO
				title="Our Services - Dhaka Plastic & Metal | Branding Solutions"
				description="We offer end-to-end services including expert design consultation, precision manufacturing, and professional signage installation across Bangladesh."
			/>
			<Hero />
			<OurProcess />
			<CoreServices />
			<WhyChooseUs />
			<GetInTouch />
		</>
	);
};

export default OurServices;
