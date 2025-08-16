import {
	Send,
	MessagesSquare,
	Wallet,
	PenTool,
	Hammer,
	Truck,
	LucideIcon,
} from "lucide-react";
import SectionHeading from "@/components/section-heading";
import ProcessSteps from "@/pages/services/process-step";

export interface ProcessItem {
	id: number;
	icon: LucideIcon;
	title: string;
	description: string;
}

const processItems: ProcessItem[] = [
	{
		id: 1,
		icon: Send,
		title: "Send Order Request",
		description: "Share your requirements and place your order.",
	},
	{
		id: 2,
		icon: MessagesSquare,
		title: "Consultation",
		description: "Discuss ideas and finalize the details with our team.",
	},
	{
		id: 3,
		icon: Wallet,
		title: "Make Initial Payment",
		description: "Secure your order by making an advance payment (25-50%).",
	},
	{
		id: 4,
		icon: PenTool,
		title: "Design & Approval",
		description: "Our experts create a digital mockup for your approval.",
	},
	{
		id: 5,
		icon: Hammer,
		title: "Production",
		description:
			"We craft your product with precision and quality materials.",
	},
	{
		id: 6,
		icon: Truck,
		title: "Installation & Delivery",
		description: "Delivered or installed, ready to impress.",
	},
];

const OurProcess: React.FC = () => {
	const sectionHeadingProp = {
		title: "Our Process",
		description:
			"Turning Your Ideas into Reality—Simple, Seamless, and Stress-Free.",
	};
	// const isMobile = useIsMobile();

	// const [currentIndex, setCurrentIndex] = useState(1);

	// const slideNext = () => {
	// 	setCurrentIndex((prevIndex) =>
	// 		prevIndex === processItems.length ? 1 : prevIndex + 1
	// 	);

	// 	processItems.forEach((_, i) => {
	// 		const cardEl = document.getElementById(`process-card-${i + 1}`);
	// 		if (cardEl) {
	// 			if (i > currentIndex - 1) {
	// 				cardEl.style.transform = `translateX(-${
	// 					(currentIndex % processItems.length) *
	// 					(isMobile ? 115 : 106)
	// 				}%)`;
	// 			}

	// 			if (currentIndex === processItems.length) {
	// 				cardEl.style.transform = `translateX(0)`;
	// 			}
	// 		}
	// 	});
	// };

	return (
		<section data-aos="fade-up" className="py-10">
			<SectionHeading
				title={sectionHeadingProp.title}
				description={sectionHeadingProp.description}
			/>

			<div className="row py-6">
				<ProcessSteps processItems={processItems} />
			</div>
		</section>
	);
};

export default OurProcess;
