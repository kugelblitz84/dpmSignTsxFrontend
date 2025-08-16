import { Button } from "@/components/ui/button";
import { scroller } from "react-scroll";

const Hero = () => {
	const handleScrollToContact = () => {
		scroller.scrollTo("contactform", {
			smooth: true,
			offset: 0,
			duration: 300,
		});
	};

	return (
		<section className="relative w-full h-screen max-h-[1024px]">
			{/* Background Video */}
			<div className="absolute top-0 left-0 w-full h-full">
				<video
					autoPlay
					loop
					muted
					playsInline
					className="w-full h-full object-cover md:aspect-video aspect-square"
				>
					<source
						src="https://res.cloudinary.com/dl1lwmw6h/video/upload/v1742982151/dpm-muted_zymymf.mp4"
						type="video/mp4"
					/>
					Your browser does not support the video tag.
				</video>
			</div>

			{/* Hero Content Overlay */}
			<div className="relative z-10 flex items-center justify-center w-full h-screen max-h-[1024px] bg-[linear-gradient(104.13deg,rgba(36,169,226,0.45)_15%,rgba(44,54,145,0.45)_82%)]">
				<div
					data-aos="fade-right"
					className="row flex items-center lg:items-start justify-center gap-6 flex-col text-white"
				>
					<h1 className="text-3xl lg:text-5xl font-semibold lg:font-bold tracking-wide leading-10 lg:leading-12">
						Welcome to Dhaka Plastic & Metal
					</h1>
					<p className="text-base lg:text-lg w-full max-w-lg font-medium">
						Your Premier Destination for 3D Signage, Award Plaques & Corporate
						Gift Solutions.
					</p>
					<div onClick={handleScrollToContact}>
						<Button size="lg">Request a Quote</Button>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Hero;
