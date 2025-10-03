import WhyWorkWithUs from "@/pages/career/why-work-with-us";
import JobPost from "@/pages/career/job-post";
import Internship from "@/pages/career/internship";
import FAQ from "@/pages/career/faq";
import Contact from "@/pages/career/contact";
import EmployeeTestimonial from "@/pages/career/employee-testimonial";
import JobProvider from "@/hooks/use-job";
import React from "react";
import Hero from "@/pages/career/hero";
import SEO from "@/components/seo";

const OurCareer: React.FC = () => {
	return (
		<>
			<SEO
				title="Careers at Dhaka Plastic & Metal | Join Our Team"
				description="Build your career at a leading signage company in Bangladesh. Explore current job openings at Dhaka Plastic & Metal and join our team of experts."
			/>
			<Hero />

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
