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
import SEO from "@/components/seo";
import HomeOgImage from "@/assets/images/Home_Open_Graph_Meta_Tag_Image[1].jpg";

const Home = () => {
	return (
		<>
			<SEO
				title="Dhaka Plastic & Metal | Custom 3D Signage, Award Plaques & Corporate Branding Solutions"
				description="Discover Dhaka Plastic & Metal - Bangladesh's trusted manufacturer of premium 3D signage, award plaques, and corporate branding products. Elevate your brand with custom designs, top-quality craftsmanship, and professional services. Contact us today for innovative solutions that leave lasting impressions."
				image={HomeOgImage}
			/>
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
