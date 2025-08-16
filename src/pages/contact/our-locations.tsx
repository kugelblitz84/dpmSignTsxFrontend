import { MapPin, Phone, Mail, Clock } from "lucide-react";
import SectionHeading, {
	SectionHeadingProps,
} from "@/components/section-heading";

interface Location {
	title: string;
	address: string;
	phone: string;
	email: string | null;
	hours: string;
}

const OurLocations = () => {
	const sectionHeadingProp: SectionHeadingProps = {
		title: "Our Locations",
		description:
			"At Dhaka Plastic & Metal, we make communication easy. Whether you have questions about our products, need a quote for bulk orders, or want to discuss custom solutions, our team is just a call, click, or visit away.",
	};

	const locations: Location[] = [
		{
			title: "Head Office",
			address:
				"Shop-94, Dhaka University Market, Katabon Road, Dhaka-1000.",
			phone: "+880 1958253962",
			email: "info@dpmsign.com",
			hours: "Sunday-Friday: 10:00 AM - 10:00 PM",
		},
		{
			title: "Branch Office",
			address:
				"Shop-142, Dhaka University Market, Katabon Road, Dhaka-1000.",
			phone: "+880 1958253965",
			email: "info@dpmsign.com",
			hours: "Sunday-Friday: 10:00 AM - 10:00 PM",
		},
		{
			title: "Workshop",
			address:
				"Vojjo Teler Goli, Near Bata Signal More, Elephant Road, Dhaka-1205.",
			phone: "+880 1919960198",
			email: null,
			hours: "Sunday-Friday: 10:00 AM - 10:00 PM",
		},
	];

	return (
		<section data-aos="fade-up" className="py-12 bg-gray-50">
			<SectionHeading
				title={sectionHeadingProp.title}
				description={sectionHeadingProp.description}
			/>

			<div className="row h-auto grid grid-cols-1 xl:grid-cols-3 gap-8">
				{locations.map((location, index) => (
					<div
						key={index}
						className="flex flex-col items-start justify-start gap-4 text-center bg-slate-100/40 backdrop-blur-lg px-6 py-10 shadow-sm rounded-lg border-gray/50 border-2rem h-auto"
					>
						<h3 className="text-xl font-semibold">
							{location.title}
						</h3>
						<div className="w-full flex items-center justify-start gap-3">
							<div className="p-3 bg-skyblue/10 text-skyblue rounded-full">
								<MapPin className="w-5 h-5" />
							</div>
							<p className="text-base font-semibold text-left">
								{location.address}
							</p>
						</div>

						<div className="w-full flex items-center justify-start gap-3">
							<div className="p-3 bg-skyblue/10 text-skyblue rounded-full">
								<Phone className="w-5 h-5" />
							</div>
							<p className="text-base font-semibold text-left">
								{location.phone}
							</p>
						</div>

						{location.email && (
							<div className="w-full flex items-center justify-start gap-3">
								<div className="p-3 bg-skyblue/10 text-skyblue rounded-full">
									<Mail className="w-5 h-5" />
								</div>
								<p className="text-base font-semibold text-left">
									{location.email}
								</p>
							</div>
						)}
						<div className="w-full flex items-center justify-start gap-3">
							<div className="p-3 bg-skyblue/10 text-skyblue rounded-full">
								<Clock className="w-5 h-5" />
							</div>
							<p className="text-base lg:text-lg font-semibold text-left">
								{location.hours}
							</p>
						</div>
					</div>
				))}
			</div>

			<div className="row mt-10">
				<h3 className="text-3xl font-semibold text-gray-800 text-center mb-5">
					Find Us on Google Maps
				</h3>
				<iframe
					src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d281.5173582238235!2d90.38853740899265!3d23.735410403442728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8c6cef6e5bd%3A0x424c7d1c2dae79ae!2sDhaka%20Plastic%20%26%20Metal!5e0!3m2!1sen!2sbd!4v1735059918761!5m2!1sen!2sbd"
					width="100%"
					height="450"
					allowFullScreen
					loading="lazy"
					className="rounded-md shadow-md border-0"
				></iframe>
			</div>
		</section>
	);
};

export default OurLocations;
