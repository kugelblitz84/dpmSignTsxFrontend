import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Service } from "@/pages/services/core-services"; // Import the Service interface
import { useNavigate } from "react-router-dom";
import routes from "@/routes";

interface ServiceCardProps {
	index: number;
	serviceItem: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ index, serviceItem }) => {
	const navigate = useNavigate();
	const IconComponent = serviceItem.icon;

	// Helper: smooth scroll to contact form
	const scrollToContact = () => {
		const el = document.getElementById("contactform");
		if (!el) return false;
		const headerOffset = 70; // adjust if header changes
		const elementPosition = el.getBoundingClientRect().top + window.scrollY;
		const offsetPosition = elementPosition - headerOffset;
		window.scrollTo({ top: offsetPosition, behavior: "smooth" });
		return true;
	};
	return (
		<Card
			className={
				index % 2 === 0
					? "p-6 shadow-lg grid grid-cols-1 xl:grid-cols-2 gap-6 place-items-center xl:flex flex-row-reverse"
					: "p-6 shadow-lg grid grid-cols-1 xl:grid-cols-2 gap-6 place-items-center"
			}
		>
			<div className="w-full px-2 relative">
				<img
					src={serviceItem.img}
					alt={serviceItem.title}
					className="max-w-full rounded-md"
				/>
			</div>

			<div className="w-full flex items-start justify-between flex-col gap-4">
				<div className="flex items-center gap-3">
					<div className="p-3 bg-skyblue/10 text-skyblue rounded-full">
						<IconComponent className="w-6 h-6 text-primary" />
					</div>
					<h3 className="text-2xl font-semibold">{serviceItem.title}</h3>
				</div>

				<div className="space-y-2">
					<h5 className="text-lg font-semibold">{serviceItem.subtitle}</h5>
					<p className="text-base font-semibold">{serviceItem.description}</p>
				</div>

				<div className="w-full space-y-2">
					<h4 className="text-xl font-semibold">
						{serviceItem.features.title}
					</h4>
					<Separator orientation="horizontal" />
					<ul className="w-full pl-5 flex items-start justify-start flex-col gap-2 space-y-2 list-disc">
						{serviceItem.features.description.map((feature, index) => (
							<li key={index} className="w-full space-y-1">
								<h5 className="text-lg font-medium">{feature.title}</h5>
								<p className="text-sm font-semibold">{feature.description}</p>
							</li>
						))}
					</ul>
				</div>

				<div className="w-full space-y-2">
					<h4 className="text-xl font-semibold">{serviceItem.extra.title}</h4>
					<Separator orientation="horizontal" />
					<ul className="w-full pl-5 flex items-start justify-start flex-col gap-2 list-disc">
						{serviceItem.extra.description.map((item, index) => (
							<li key={index}>{item}</li>
						))}
					</ul>
				</div>

				<Button
					className="w-full"
					variant="outline"
					onClick={() => {
						const cta = (serviceItem.cta || "").toLowerCase().trim();
						// Normalize multiple spaces
						const normalized = cta.replace(/\s+/g, " ");
						const scrollPhrases = [
							"get a free consultation",
							"schedule your installation",
						];
						if (scrollPhrases.some(p => normalized.includes(p))) {
							if (scrollToContact()) return;
						}
						// Fallback navigate to products
						navigate(routes.products.path);
					}}
				>
					{serviceItem.cta}
				</Button>
			</div>
		</Card>
	);
};

export default ServiceCard;
