import {
	VerticalTimeline,
	VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import HomeIcon from "@/assets/icons/home.svg";
import GrowthIcon from "@/assets/icons/growth.svg";
import BankIcon from "@/assets/icons/bank.svg";
import ShopIcon from "@/assets/icons/shop.svg";
import WebIcon from "@/assets/icons/web.svg";
import CheckedIcon from "@/assets/icons/checked.svg";
import BeginningImg from "@/assets/images/beginning.jpg";
import GrowthImg from "@/assets/images/growth.jpg";
import WorkingImg from "@/assets/images/working.jpg";
import IndustryImg from "@/assets/images/industry.jpg";

interface TimelineItem {
	title?: string;
	description?: string;
	dateItems: {
		date: string;
		title: string;
		year?: string;
	};
	iconSrc: string;
	imgSrc?: string;
}

const AboutUsTimeline = () => {
	const timelineContent: TimelineItem[] = [
		{
			title: "Company Story",
			description:
				"We started our journey in 2013 as a small shop in Dhaka University Market, Dhaka, with a passion for creating innovative and attractive signage and gift items. We realized that there was a huge demand for such products in the market, especially from corporate clients who wanted to enhance their brand image and reward their employees and customers. We decided to expand our business and offer a wide range of products and services to cater to the diverse needs of our clients. Today, we have a state-of-the-art factory, a team of skilled and experienced professionals, and a loyal customer base across the country. We are proud of our achievements and grateful for our customers' trust and support.",
			dateItems: {
				date: "15 April 2013",
				title: "Point of beginning",
			},
			iconSrc: HomeIcon,
			imgSrc: BeginningImg,
		},
		{
			title: "Mission and Vission",
			description:
				"Our mission is to provide our customers with the best signage and gift solutions that suit their budget and requirements. We aim to create products that are not only functional and durable, but also aesthetically pleasing and memorable. We want to help our customers express their identity, values, and appreciation through our products. Our vision is to become the most trusted and preferred signage and corporate gift company in Bangladesh and beyond. We aspire to set new standards of excellence and innovation in our industry and to contribute to the social and economic development of our country.",
			dateItems: {
				date: "15 April 2015",
				title: "Contineuously Growing",
			},
			iconSrc: GrowthIcon,
			imgSrc: GrowthImg,
		},
		{
			title: "Values and Principles",
			description: `We believe in the following values and principles that guide our work and behavior: 
                
            Quality: We never compromise on the quality of our products and services. We use the best materials, equipment, and techniques to ensure that our products meet or exceed our customers' expectations.
            
            Creativity: We constantly explore new ideas and designs to create unique and attractive products that stand out from the crowd. We welcome feedback and suggestions from our customers and partners to improve our products and services.
            
            Integrity: We conduct our business with honesty, transparency, and professionalism. We respect our customers, suppliers, employees, and the environment. We honor our commitments and deliver on our promises.
            
            Customer Satisfaction: We strive to provide our customers with the best possible experience from the moment they contact us until they receive their products.`,
			dateItems: {
				date: "2016",
				title: "Established Headoffice",
			},
			iconSrc: BankIcon,
			imgSrc: WorkingImg,
		},
		{
			title: "Customer-Centric Approach",
			description: `We are a customer-centric company that puts our customers at the center of everything we do. We understand that our customers are the reason for our existence and success, and we treat them accordingly. We offer them:
            Personalized Service: We treat each customer as an individual and provide them with personalized service.
            Competitive Pricing: We offer our customers competitive and transparent pricing for our products and services.
            Fast Delivery: We deliver our products to our customers as fast as possible, without compromising on the quality and safety of our products.
            Guarantee and Warranty: We stand behind our products and services and offer our customers a guarantee and warranty for them.

            Thank you for visiting our website and learning more about us. We look forward to serving you and providing you with the best signage and gift solutions.`,
			dateItems: {
				date: "2021",
				title: "Openning our Workshop",
			},
			iconSrc: ShopIcon,
			imgSrc: IndustryImg,
		},
		{
			dateItems: {
				date: "2023",
				title: "Launched our Website",
			},
			iconSrc: WebIcon,
		},
		{
			dateItems: {
				date: new Date().getFullYear().toString(),
				title: "Still Growing",
			},
			iconSrc: CheckedIcon,
		},
	];

	return (
		<>
			<VerticalTimeline lineColor="#000" className="w-full">
				{timelineContent.map((item, index) => (
					<VerticalTimelineElement
						className="w-full"
						key={index}
						contentStyle={{
							background: "#fff",
							color: "#000",
							marginBottom: "4rem",
							marginTop: "0rem",
							top: "0",
						}}
						date={
							<>
								<div className="w-full mb-6 hidden xl:block">
									<h4 className="text-xl text-red">
										{item.dateItems.date} <br />{" "}
										{item.dateItems.year}
									</h4>
									<h5>{item.dateItems.title}</h5>
								</div>
								{item.imgSrc && (
									<img
										src={item.imgSrc}
										className="max-w-full rounded-2xl"
										alt=""
									/>
								)}
							</>
						}
						iconStyle={{
							background: "#fff",
							border: "2px solid rgb(33, 150, 243)",
							padding: "8px",
							color: "#fff",
						}}
						icon={
							<div className="flex items-center justify-center">
								<img src={item.iconSrc} alt="" />
							</div>
						}
					>
						<div className="xl:hidden mb-4 -mt-4">
							<h4 className="text-xl text-red font-semibold">
								{item.dateItems.date} <br />{" "}
								{item.dateItems.year}
							</h4>
							<h5 className="font-medium">
								{item.dateItems.title}
							</h5>
						</div>
						{item.title && (
							<h3 className="text-2xl font-semibold">
								{item.title}
							</h3>
						)}
						{item.description && <p>{item.description}</p>}
					</VerticalTimelineElement>
				))}
			</VerticalTimeline>
		</>
	);
};

export default AboutUsTimeline;
