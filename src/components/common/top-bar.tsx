import {
	Phone,
	Mail,
	Facebook,
	Instagram,
	Linkedin,
	Youtube,
} from "lucide-react";
import { Link } from "react-router-dom";

import { ContactItem, SocialLink } from "@/types";

export const contactItems: ContactItem[] = [
	{
		title: "+8801958253962",
		to: "tel:+8801958253962",
		target: "_blank",
		icon: Phone,
	},
	{
		title: "+8801958253965",
		to: "tel:+8801958253965",
		target: "_blank",
		icon: Phone,
	},
	{
		title: "info@dpmsign.com",
		to: "mailto:info@dpmsign.com",
		target: "_blank",
		icon: Mail,
	},
];

export const socialLinks: SocialLink[] = [
	{
		title: "Facebook",
		to: "https://www.facebook.com/dpmsign/",
		target: "_blank",
		icon: Facebook,
	},
	{
		title: "Instagram",
		to: "https://www.instagram.com/dpmsign/",
		target: "_blank",
		icon: Instagram,
	},
	{
		title: "LinkedinIn",
		to: "https://www.linkedin.com/company/dpmsign/",
		target: "_blank",
		icon: Linkedin,
	},
	{
		title: "Youtube",
		to: "https://www.youtube.com/@dpmsign/",
		target: "_blank",
		icon: Youtube,
	},
];

const TopBar = () => {
	return (
		<section className="bg-topBarBg w-full hidden lg:block text-white">
			<div className="row h-12 py-2 flex items-center justify-center gap-6">
				<div className="flex items-center justify-center gap-4">
					{contactItems.map((item, index) => (
						<div
							key={index}
							className="flex items-center justify-center gap-3"
						>
							<item.icon size={18} />
							<Link
								to={item.to}
								target={item.target}
								className="underline font-montserrat text-base"
							>
								{item.title}
							</Link>
						</div>
					))}
				</div>
				<div className="flex items-center justify-center">
					<div className="flex items-center justify-center gap-4">
						{socialLinks.map((item, index) => (
							<Link key={index} to={item.to} target={item.target}>
								<item.icon size={18} />
							</Link>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default TopBar;
