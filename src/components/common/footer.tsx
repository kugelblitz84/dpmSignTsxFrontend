import { Link } from "react-router-dom";

import PaymentOptionImg from "@/assets/images/payment-options.png";

import routes from "@/routes";

import { contactItems, socialLinks } from "@/components/common/top-bar";

import { ContactItem, SocialLink } from "@/types";

const Footer = () => {
	return (
		<section className="w-full h-auto py-6 bg-zinc-900 text-white">
			<div className="row border-b-2 border-[#CFCFCF] py-12 pr-0 lg:pr-8">
				<div className="w-full h-auto grid grid-cols-1 place-items-center md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0">
					{/* Policies Section */}
					<div className="w-full flex items-center justify-center">
						<div className="flex items-center lg:items-start justify-between gap-4 flex-col">
							<h4 className="text-2xl font-semibold">All Policy</h4>
							<div className="flex items-center lg:items-start justify-between gap-2 flex-col">
								<Link
									to={routes.returnPolicy.path}
									className="text-lg font-normal hover:underline transition-all duration-300"
								>
									Return Policy
								</Link>
								<Link
									to={routes.exchangePolicy.path}
									className="text-lg font-normal hover:underline transition-all duration-300"
								>
									Exchange Policy
								</Link>
								<Link
									to={routes.privacyPolicy.path}
									className="text-lg font-normal hover:underline transition-all duration-300"
								>
									Privacy Policy
								</Link>
							</div>
						</div>
					</div>

					{/* Help Section */}
					<div className="w-full flex items-center justify-center">
						<div className="flex items-center lg:items-start justify-between gap-4 flex-col">
							<h4 className="text-2xl font-semibold">Need Help</h4>
							<div className="flex items-center lg:items-start justify-between gap-2 flex-col">
								<Link
									to={routes.contact.path}
									className="text-lg font-normal hover:underline transition-all duration-300"
								>
									Contact Us
								</Link>
								<Link
									to={routes.faq.path}
									className="text-lg font-normal hover:underline transition-all duration-300"
								>
									FAQs
								</Link>
								<Link
									to={routes.termsNCondition.path}
									className="text-lg font-normal hover:underline transition-all duration-300"
								>
									Terms & Conditions
								</Link>
							</div>
						</div>
					</div>

					{/* Company Section */}
					<div className="flex items-center justify-center">
						<div className="flex items-center lg:items-start justify-between gap-4 flex-col">
							<h4 className="text-2xl font-semibold">Company</h4>
							<div className="flex items-center lg:items-start justify-between gap-2 flex-col">
								<Link
									to={routes.partnerWithUs.path}
									className="text-lg font-normal hover:underline transition-all duration-300"
								>
									Partner With Us
								</Link>
								<Link
									to={routes.career.path}
									className="text-lg font-normal hover:underline transition-all duration-300"
								>
									Careers
								</Link>
								<Link
									to={routes.blogs.path}
									className="text-lg font-normal hover:underline transition-all duration-300"
								>
									Blogs
								</Link>
							</div>
						</div>
					</div>

					{/* Stay Connected Section */}
					<div className="flex items-center justify-center">
						<div className="flex items-center lg:items-start justify-between gap-4 flex-col">
							<h4 className="text-2xl font-semibold">Stay Connected</h4>
							<div className="flex items-center lg:items-start justify-between gap-4 flex-col">
								{contactItems.map((item: ContactItem, index: number) => (
									<div
										key={index}
										className="flex items-center justify-center gap-3"
									>
										<item.icon size={20} />
										<Link
											to={item.to}
											target={item.target}
											className="text-base font-normal hover:underline transition-all duration-300"
										>
											{item.title}
										</Link>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Payment Options and Social Links */}
			<div className="row py-3 pr-0 lg:pr-8 space-y-4">
				<div className="w-full h-auto flex items-center justify-between flex-col lg:flex-row gap-4">
					{/* Payment Options */}
					<div className="flex items-start justify-start flex-col gap-4 py-2">
						<div className="flex items-center lg:items-start justify-center gap-4 flex-col">
							<h4 className="text-2xl font-semibold">We Accept</h4>
							<img
								src={PaymentOptionImg}
								className="max-w-[90%] rounded-lg"
								alt="Payment Options"
							/>
						</div>
					</div>

					{/* Social Links */}
					<div className="flex items-center justify-center py-2">
						<div className="flex items-center lg:items-start justify-center gap-4 flex-col">
							<h4 className="text-2xl font-semibold">Find Us On</h4>
							<div className="flex items-center justify-center gap-4">
								{socialLinks.map((link: SocialLink, index: number) => (
									<Link key={index} to={link.to} target={link.target}>
										<link.icon size={18} />
									</Link>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Copyright Section */}
				<div className="w-full flex flex-col justify-center lg:justify-start md:justify-start">
					{/* BIN & Trade License Numbers */}
					<div className=" flex flex-col md:flex-row lg:flex-row gap-3 ">
						<h6 className=" text-sm lg:text-lg md:text-lg font-normal text-center lg:text-left">
							<strong>BIN:</strong> 003868216-0201
						</h6>
						<h6 className=" text-sm lg:text-lg md:text-lg font-normal text-center lg:text-left">
							<strong>TL:</strong> TRAD/DSCC/012641/2022
						</h6>
					</div>

					<h6 className="w-full text-xs lg:text-lg font-normal text-center  lg:text-left border-t-2 mt-6 pt-4 border-gray">
						Copyright © {new Date().getFullYear()} Dhaka Plastic & Metal.{" "}
						{/* <Link to={routes.sitemap.path} className="text-skyblue underline">
							Sitemap.
						</Link>{" "}
						Developed by Recursivee. */}
					</h6>
				</div>
			</div>
		</section>
	);
};

export default Footer;
