import BestSellingProducts from "@/pages/home/best-selling-products";
import ClientsAndTestimonial from "@/pages/home/clients-and-testimonial";
import Contact from "@/pages/home/contact";
import Facts from "@/pages/home/facts";
import Hero from "@/pages/home/hero";
import Services from "@/pages/home/services";
import WhyChooseUs from "@/pages/home/why-choose-us";
import AboutUs from "@/pages/home/about-us";
import Materials from "@/pages/home/materials";
import OurProcess from "@/pages/services/our-process";

const Home = () => {
	return (
		<>
			<Hero />
			<BestSellingProducts />
			<Services />
			<Materials />
			<AboutUs />
			<OurProcess />
			<WhyChooseUs />
			<Facts />
			<ClientsAndTestimonial />
			<Contact />
		</>
	);
};

export default Home;
