import GetInTouch from "@/components/get-in-touch";
import CoreServices from "@/pages/services/core-services";
import OurProcess from "@/pages/services/our-process";
import WhyChooseUs from "@/pages/services/why-choose-us";
import Hero from "@/pages/services/hero";

const OurServices = () => {
	return (
		<>
			<Hero />
			<OurProcess />
			<CoreServices />
			<WhyChooseUs />
			<GetInTouch />
		</>
	);
};

export default OurServices;
