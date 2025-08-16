import Hero from "@/pages/career/hero";
import WhyWorkWithUs from "@/pages/career/why-work-with-us";
import JobPost from "@/pages/career/job-post";
import Internship from "@/pages/career/internship";
import FAQ from "@/pages/career/faq";
import Contact from "@/pages/career/contact";
import EmployeeTestimonial from "@/pages/career/employee-testimonial";
import JobProvider from "@/hooks/use-job";
import React from "react";

const OurCareer: React.FC = () => {
	return (
		<>
			{/* Hero Section */}
			{/* <Hero /> */}

			{/* Open Positions */}
			<JobProvider>
				<JobPost />

				{/* Internship Program */}
				<Internship />
			</JobProvider>

			{/* Why Work With Us */}
			<WhyWorkWithUs />

			{/* Employee Testimonial */}
			<EmployeeTestimonial />

			{/* FAQs */}
			<FAQ />

			{/* Contact Section */}
			<Contact />
		</>
	);
};

export default OurCareer;
