import { Link } from "react-router-dom";
import SectionHeading from "@/components/section-heading";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";

interface Section {
	title: string;
	content: React.ReactNode;
}

const PPolicy = () => {
	const [language, setLanguage] = useState<"en" | "bn">("en");

	const enSectionHeadingProp = {
		title: "Privacy Policy",
		description:
			"Dhaka Plastic & Metal is committed to safeguarding the privacy of our customers and visitors. This Privacy Policy outlines how we collect, use, share, and protect your personal information when you interact with our website and services. By using our website www.dpmsign.com, you consent to the collection and use of your data in accordance with this Privacy Policy.",
	};

	const bnSectionHeadingProp = {
		title: "গোপনীয়তা নীতি",
		description:
			"Dhaka Plastic & Metal (ঢাকা প্লাস্টিক অ্যান্ড মেটাল) আমাদের গ্রাহক এবং দর্শকদের ব্যক্তিগত তথ্যের গোপনীয়তা রক্ষা করতে প্রতিশ্রুতিবদ্ধ। এই গোপনীয়তা নীতিমালায় আমরা কীভাবে আপনার ব্যক্তিগত তথ্য সংগ্রহ, ব্যবহার, শেয়ার এবং সুরক্ষা করি তা ব্যাখ্যা করা হয়েছে। আমাদের ওয়েবসাইট www.dpmsign.com ব্যবহার করে আপনি এই নীতিমালা অনুযায়ী আপনার তথ্য সংগ্রহ ও ব্যবহারের সম্মতি প্রদান করছেন।",
	};

	const enSections: Section[] = [
		{
			title: "Effective Date",
			content: (
				<>
					<p className="text-lg font-semibold font-firasans">01.01.2025</p>
				</>
			),
		},
		{
			title: "Information We Collect",
			content: (
				<div className="space-y-4">
					<p className="text-lg font-semibold">
						We collect various types of information to provide our services
						efficiently and improve your experience. The information we collect
						includes:
					</p>
					<div>
						<h4 className="text-xl font-semibold font-firasans">
							A. Personal Information
						</h4>
						<ul className="list-disc space-y-2 text-lg font-semibold font-manrope pl-8">
							<li>Full name</li>
							<li>Email address</li>
							<li>Phone number</li>
							<li>Shipping and billing address</li>
							<li>Business details (for B2B customers or partnerships)</li>
						</ul>
					</div>
					<div>
						<h4 className="text-xl font-semibold font-firasans">
							B. Non-Personal Information
						</h4>
						<ul className="list-disc space-y-2 text-lg font-semibold font-manrope pl-8">
							<li>IP address, browser type, and operating system</li>
							<li>
								Website usage data (pages visited, time spent, clicks, etc.)
							</li>
							<li>Device type and geographic location (approximate)</li>
						</ul>
					</div>
					<div>
						<h4 className="text-xl font-semibold font-firasans">
							C. Payment Information
						</h4>
						<ul className="list-disc space-y-2 text-lg font-semibold font-manrope pl-8">
							<li>
								For secure transactions, we collect payment details, which are
								processed through trusted third-party payment gateways.
							</li>
							<li>
								<strong>Note:</strong> We do not store your card information.
							</li>
						</ul>
					</div>
					<div>
						<h4 className="text-xl font-semibold font-firasans">
							D. Uploaded Files
						</h4>
						<p className="ml-6 text-lg font-semibold">
							If you upload design files (e.g., PDFs, JPGs, PNGs) for product
							customization, these files are stored securely for order
							processing.
						</p>
					</div>
				</div>
			),
		},
		{
			title: "How We Use Your Information",
			content: (
				<div className="space-y-4">
					<p className="text-lg font-semibold">
						We use the collected information for the following purposes:
					</p>
					<ol className="list-decimal space-y-2 text-lg font-semibold font-manrope pl-8">
						<li>
							<strong>Order Fulfillment:</strong> Processing your orders,
							customizing products, and delivering them on time.
						</li>
						<li>
							<strong>Communication:</strong> Responding to inquiries, sharing
							order updates, and providing support.
						</li>
						<li>
							<strong>Personalization:</strong> Enhancing your experience by
							recommending relevant products or offers.
						</li>
						<li>
							<strong>Marketing:</strong> Sending promotional emails (with your
							consent) about new products, discounts, or company updates.
						</li>
						<li>
							<strong>Improvement:</strong> Analyzing user behavior to improve
							website performance and product offerings.
						</li>
						<li>
							<strong>Legal Compliance:</strong> Meeting legal and regulatory
							requirements.
						</li>
					</ol>
				</div>
			),
		},
		{
			title: "Cookies and Tracking Technologies",
			content: (
				<div className="space-y-4">
					<p className="text-lg font-semibold">
						Our website uses cookies to improve functionality and analyze
						visitor behavior.
					</p>
					<ul className="list-disc space-y-2 text-lg font-semibold font-manrope pl-8">
						<li>
							<strong>What Are Cookies?</strong>
							<br />
							Cookies are small data files stored on your device to help us
							recognize your preferences and enhance your browsing experience.
						</li>
						<li>
							<strong>Types of Cookies We Use:</strong>
						</li>
						<ol className="list-decimal space-y-2 text-lg font-semibold font-manrope pl-8">
							<li>
								<strong>Essential Cookies:</strong> Necessary for website
								functionality (e.g., order processing).
							</li>
							<li>
								<strong>Analytical Cookies:</strong> Help us analyze website
								traffic and optimize user experience.
							</li>
							<li>
								<strong>Marketing Cookies:</strong> Allow us to show
								personalized ads and promotions.
							</li>
						</ol>
					</ul>
					<p className="text-lg font-semibold mt-4">
						<strong>Managing Cookies:</strong> You can disable cookies in your
						browser settings. Note that disabling cookies may affect website
						performance.
					</p>
				</div>
			),
		},
		{
			title: "How We Share Your Information",
			content: (
				<div className="space-y-4">
					<p className="text-lg font-semibold">
						We do not sell or trade your personal information. However, we may
						share your data in the following circumstances:
					</p>
					<ol className="list-decimal space-y-2 text-lg font-semibold font-manrope pl-8">
						<li>
							<strong>Service Providers:</strong> Trusted partners who help us
							with:
							<ul className="list-disc space-y-2 text-lg font-semibold font-manrope pl-8">
								<li>Payment processing</li>
								<li>Order delivery and logistics</li>
								<li>Website analytics</li>
							</ul>
						</li>
						<li>
							<strong>Legal Requirements:</strong> If required by law, we may
							disclose your information to comply with legal obligations or
							protect our rights.
						</li>
						<li>
							<strong>Business Transfers:</strong> In case of a merger,
							acquisition, or sale of assets, your information may be
							transferred to the new entity.
						</li>
					</ol>
				</div>
			),
		},
		{
			title: "Data Security",
			content: (
				<div className="space-y-4">
					<p className="text-lg font-semibold">
						We take data security seriously and implement the following
						measures:
					</p>
					<ul className="list-disc space-y-2 text-lg font-semibold font-manrope pl-8">
						<li>
							<strong>SSL Encryption:</strong> Ensures secure data transmission.
						</li>
						<li>
							<strong>Access Control:</strong> Limited access to personal data
							to authorized employees only.
						</li>
						<li>
							<strong>Regular Audits:</strong> Periodic checks to prevent
							unauthorized access.
						</li>
					</ul>
					<p className="text-lg font-semibold">
						While we take every precaution to protect your data, no method of
						transmission over the Internet is 100% secure.
					</p>
				</div>
			),
		},
		{
			title: "Your Rights",
			content: (
				<div className="space-y-4">
					<p className="text-lg font-semibold">
						You have the following rights regarding your personal data:
					</p>
					<ul className="list-disc space-y-2 text-lg font-semibold font-manrope pl-8">
						<li>
							<strong>Access:</strong> Request details about the personal data
							we hold about you.
						</li>
						<li>
							<strong>Correction:</strong> Update or correct inaccurate or
							incomplete information.
						</li>
						<li>
							<strong>Deletion:</strong> Request deletion of your data, subject
							to legal obligations.
						</li>
						<li>
							<strong>Opt-Out:</strong> Unsubscribe from marketing emails by
							clicking the "Unsubscribe" link in our emails.
						</li>
					</ul>
					<p className="text-lg font-semibold">
						To exercise your rights, email us at{" "}
						<Link to="mailto:info@dpmsign.com" className="text-skyblue">
							info@dpmsign.com
						</Link>
						.
					</p>
				</div>
			),
		},
		{
			title: "Third Party Links",
			content: (
				<>
					<p className="text-lg font-semibold">
						Our website may contain links to third-party websites. We are not
						responsible for their privacy practices. Please review their privacy
						policies before sharing any information.
					</p>
				</>
			),
		},
		{
			title: "Updates to This Policy",
			content: (
				<>
					<p className="text-lg font-semibold">
						We may update this Privacy Policy from time to time to reflect
						changes in our practices or legal requirements. Updates will be
						posted on this page with the “Effective Date” revised.
					</p>
				</>
			),
		},
	];

	const bnSections: Section[] = [
		{
			title: "কার্যকর তারিখ",
			content: (
				<>
					<p className="text-lg font-semibold font-firasans">
						০১ জানুয়ারি, ২০২৫
					</p>
				</>
			),
		},
		{
			title: "আমরা যে তথ্য সংগ্রহ করি",
			content: (
				<div className="space-y-4">
					<p className="text-lg font-semibold">
						আমাদের সেবাগুলি কার্যকরীভাবে প্রদান এবং আপনার অভিজ্ঞতা উন্নত করার
						জন্য আমরা বিভিন্ন ধরনের তথ্য সংগ্রহ করি।
					</p>
					<div>
						<h4 className="text-xl font-semibold font-firasans">
							ক. ব্যক্তিগত তথ্য
						</h4>
						<ul className="list-disc space-y-2 text-lg font-semibold font-manrope pl-8">
							<li>পুরো নাম</li>
							<li>ইমেইল ঠিকানা</li>
							<li>ফোন নম্বর</li>
							<li>শিপিং ও বিলিং ঠিকানা</li>
							<li>ব্যবসায়িক তথ্য (কর্পোরেট বা পার্টনারশিপের জন্য)</li>
						</ul>
					</div>
					<div>
						<h4 className="text-xl font-semibold font-firasans">
							খ. অ-ব্যক্তিগত তথ্য
						</h4>
						<ul className="list-disc space-y-2 text-lg font-semibold font-manrope pl-8">
							<li>আইপি ঠিকানা, ব্রাউজারের ধরন এবং অপারেটিং সিস্টেম</li>
							<li>
								ওয়েবসাইট ব্যবহার সংক্রান্ত ডেটা (যেমন: পৃষ্ঠাগুলি পরিদর্শনের
								সময়, সময়কাল, ক্লিক ইত্যাদি)
							</li>
							<li>ডিভাইসের ধরন এবং আনুমানিক ভৌগোলিক অবস্থান</li>
						</ul>
					</div>
					<div>
						<h4 className="text-xl font-semibold font-firasans">
							গ. পেমেন্ট তথ্য
						</h4>
						<ul className="list-disc space-y-2 text-lg font-semibold font-manrope pl-8">
							<li>
								আমরা নিরাপদ লেনদেনের জন্য পেমেন্টের তথ্য সংগ্রহ করি, যা
								নির্ভরযোগ্য তৃতীয় পক্ষের মাধ্যমে প্রক্রিয়া করা হয়।
							</li>
							<li>
								<strong>দ্রষ্টব্য:</strong> আমরা আপনার কার্ড সংক্রান্ত তথ্য
								সংরক্ষণ করি না।
							</li>
						</ul>
					</div>
					<div>
						<h4 className="text-xl font-semibold font-firasans">
							ঘ. আপলোড করা ফাইল
						</h4>
						<p className="ml-6 text-lg font-semibold">
							আপনি যদি পণ্য কাস্টমাইজেশনের জন্য নকশা ফাইল (যেমন: PDF, JPG, PNG)
							আপলোড করেন, তবে সেগুলি কেবল অর্ডার প্রসেসিংয়ের জন্য নিরাপদভাবে
							সংরক্ষণ করা হয়।
						</p>
					</div>
				</div>
			),
		},
		{
			title: "তথ্যের ব্যবহার",
			content: (
				<div className="space-y-4">
					<p className="text-lg font-semibold">
						আমরা আপনার তথ্য নিম্নলিখিত উদ্দেশ্যে ব্যবহার করি:
					</p>
					<ol className="list-decimal space-y-2 text-lg font-semibold font-manrope pl-8">
						<li>
							<strong>অর্ডার প্রসেসিং:</strong> আপনার অর্ডার সম্পন্ন করা,
							কাস্টমাইজ করা এবং সময়মতো ডেলিভারি প্রদান।
						</li>
						<li>
							<strong>যোগাযোগ:</strong> আপনার প্রশ্নের উত্তর দেওয়া, অর্ডার
							আপডেট শেয়ার করা এবং সহায়তা প্রদান।
						</li>
						<li>
							<strong>ব্যক্তিগতকরণ:</strong> আপনার জন্য প্রাসঙ্গিক পণ্য বা অফার
							সুপারিশ।
						</li>
						<li>
							<strong>বিপণন:</strong> আপনার সম্মতি নিয়ে নতুন পণ্য, ছাড় বা
							আপডেট সম্পর্কে ইমেইল প্রেরণ।
						</li>
						<li>
							<strong>উন্নয়ন:</strong> ব্যবহারকারীর আচরণ বিশ্লেষণ করে ওয়েবসাইট
							ও পণ্যের মান উন্নত করা।
						</li>
						<li>
							<strong>আইনি বাধ্যবাধকতা:</strong> আইনগত এবং নিয়ন্ত্রক
							প্রয়োজনীয়তা পূরণ করা।
						</li>
					</ol>
				</div>
			),
		},
		{
			title: "কুকি এবং ট্র্যাকিং প্রযুক্তি",
			content: (
				<div className="space-y-4">
					<p className="text-lg font-semibold">
						আমাদের ওয়েবসাইট কুকি ব্যবহার করে কার্যকারিতা বৃদ্ধি এবং দর্শকদের
						আচরণ বিশ্লেষণ করে।
					</p>
					<ul className="list-disc space-y-2 text-lg font-semibold font-manrope pl-8">
						<li>
							<strong>কুকি কী?</strong>
							<br />
							কুকি হলো ছোট ডেটা ফাইল যা আপনার পছন্দগুলি চিহ্নিত করতে এবং
							ব্রাউজিং অভিজ্ঞতা উন্নত করতে আপনার ডিভাইসে সংরক্ষিত হয়।
						</li>
						<li>
							<strong>আমরা যে ধরনের কুকি ব্যবহার করি:</strong>
						</li>
						<ol className="list-decimal space-y-2 text-lg font-semibold font-manrope pl-8">
							<li>
								<strong>প্রয়োজনীয় কুকি:</strong> ওয়েবসাইট কার্যকারিতার জন্য
								অপরিহার্য।
							</li>
							<li>
								<strong>বিশ্লেষণাত্মক কুকি:</strong> ওয়েবসাইট ট্রাফিক বিশ্লেষণে
								সাহায্য করে।
							</li>
							<li>
								<strong>বিপণন কুকি:</strong> ব্যক্তিগতকৃত বিজ্ঞাপন প্রদর্শনের
								জন্য।
							</li>
						</ol>
					</ul>
					<p className="text-lg font-semibold mt-4">
						<strong>কুকি ব্যবস্থাপনা:</strong> আপনার ব্রাউজারের সেটিংস থেকে কুকি
						নিষ্ক্রিয় করতে পারেন। তবে এটি ওয়েবসাইটের কার্যকারিতা প্রভাবিত করতে
						পারে।
					</p>
				</div>
			),
		},
		{
			title: "তথ্য শেয়ারিং",
			content: (
				<div className="space-y-4">
					<p className="text-lg font-semibold">
						আমরা আপনার ব্যক্তিগত তথ্য বিক্রি বা বিনিময় করি না। তবে, নির্দিষ্ট
						ক্ষেত্রে তথ্য শেয়ার করা হতে পারে:
					</p>
					<ol className="list-decimal space-y-2 text-lg font-semibold font-manrope pl-8">
						<li>
							<strong>সেবা প্রদানকারী:</strong>
							<ul className="list-disc space-y-2 text-lg font-semibold font-manrope pl-8">
								<li>পেমেন্ট প্রসেসিং</li>
								<li>অর্ডার ডেলিভারি ও লজিস্টিক</li>
								<li>ওয়েবসাইট অ্যানালিটিক্স</li>
							</ul>
						</li>
						<li>
							<strong>আইনি প্রয়োজন:</strong> আইনগত বাধ্যবাধকতা মেনে চলতে বা
							আমাদের অধিকার রক্ষার জন্য।
						</li>
						<li>
							<strong>ব্যবসায়িক স্থানান্তর:</strong> অধিগ্রহণ বা সম্পদ
							বিক্রয়ের ক্ষেত্রে তথ্য নতুন প্রতিষ্ঠানে স্থানান্তর হতে পারে।
						</li>
					</ol>
				</div>
			),
		},
		{
			title: "তথ্যের নিরাপত্তা",
			content: (
				<div className="space-y-4">
					<p className="text-lg font-semibold">
						আমরা নিচের নিরাপত্তা ব্যবস্থা গ্রহণ করি:
					</p>
					<ul className="list-disc space-y-2 text-lg font-semibold font-manrope pl-8">
						<li>
							<strong>SSL এনক্রিপশন:</strong> ডেটা ট্রান্সমিশনের সময় সুরক্ষিত
							থাকে।
						</li>
						<li>
							<strong>অ্যাক্সেস নিয়ন্ত্রণ:</strong> অনুমোদিত কর্মচারীদের সীমিত
							প্রবেশাধিকার।
						</li>
						<li>
							<strong>নিয়মিত অডিট:</strong> অননুমোদিত অ্যাক্সেস রোধ করতে।
						</li>
					</ul>
					<p className="text-lg font-semibold">
						আমরা আপনার তথ্য সুরক্ষিত রাখতে সর্বোচ্চ সতর্কতা অবলম্বন করি, তবে
						ইন্টারনেটের মাধ্যমে ডেটা ট্রান্সমিশন ১০০% নিরাপদ নয়।
					</p>
				</div>
			),
		},
		{
			title: "আপনার অধিকার",
			content: (
				<div className="space-y-4">
					<p className="text-lg font-semibold">
						আপনার ব্যক্তিগত তথ্য সম্পর্কে আপনি নিম্নলিখিত অধিকার রাখেন:
					</p>
					<ul className="list-disc space-y-2 text-lg font-semibold font-manrope pl-8">
						<li>
							<strong>অ্যাক্সেস:</strong> আমরা কী তথ্য সংগ্রহ করেছি তা জানতে
							অনুরোধ করতে পারেন।
						</li>
						<li>
							<strong>সংশোধন:</strong> ভুল বা অসম্পূর্ণ তথ্য আপডেট করতে।
						</li>
						<li>
							<strong>মুছে ফেলা:</strong> আইন অনুযায়ী আপনার তথ্য মুছে ফেলার
							অনুরোধ।
						</li>
						<li>
							<strong>অপ্ট-আউট:</strong> ইমেইলে "Unsubscribe" লিঙ্কে ক্লিক করে
							মার্কেটিং ইমেইল থেকে সরে আসা।
						</li>
					</ul>
					<p className="text-lg font-semibold">
						আপনার অধিকার প্রয়োগ করতে আমাদের{" "}
						<Link to="mailto:info@dpmsign.com" className="text-skyblue">
							info@dpmsign.com
						</Link>{" "}
						এ ইমেইল করুন।
					</p>
				</div>
			),
		},
		{
			title: "তৃতীয় পক্ষের লিঙ্ক",
			content: (
				<>
					<p className="text-lg font-semibold">
						আমাদের ওয়েবসাইটে তৃতীয় পক্ষের ওয়েবসাইটের লিঙ্ক থাকতে পারে। আমরা
						তাদের গোপনীয়তা নীতির জন্য দায়ী নই। তথ্য শেয়ার করার আগে তাদের
						গোপনীয়তা নীতি পর্যালোচনা করুন।
					</p>
				</>
			),
		},
		{
			title: "নীতিমালার হালনাগাদ",
			content: (
				<>
					<p className="text-lg font-semibold">
						আমরা প্রয়োজন অনুযায়ী এই গোপনীয়তা নীতি হালনাগাদ করতে পারি।
						হালনাগাদকৃত নীতি এই পৃষ্ঠায় প্রকাশ করা হবে এবং কার্যকর তারিখ সংশোধন
						করা হবে।
					</p>
				</>
			),
		},
	];

	const sectionHeadingProp =
		language === "en" ? enSectionHeadingProp : bnSectionHeadingProp;
	const sections = language === "en" ? enSections : bnSections;

	return (
		<section className="py-6 xl:px-4 bg-gray-50">
			<div className="flex justify-end mb-4 px-6 xl:px-20">
				<ToggleGroup
					type="single"
					value={language}
					onValueChange={(value: "en" | "bn") => value && setLanguage(value)}
					className="bg-white rounded-md shadow-sm border border-gray-200"
				>
					<ToggleGroupItem
						value="en"
						className="px-4 py-2 text-sm font-medium data-[state=on]:bg-skyblue data-[state=on]:text-white"
					>
						EN
					</ToggleGroupItem>
					<ToggleGroupItem
						value="bn"
						className="px-4 py-2 text-sm font-medium data-[state=on]:bg-skyblue data-[state=on]:text-white"
					>
						BN
					</ToggleGroupItem>
				</ToggleGroup>
			</div>

			<SectionHeading
				title={sectionHeadingProp.title}
				description={sectionHeadingProp.description}
			/>

			<div className="row rounded-lg pt-10 p-6 xl:px-20 bg-slate-100/40 backdrop-blur-lg shadow-sm border border-gray/50">
				{sections.map((section, idx) => (
					<div key={idx} className="mb-8">
						<h2 className="text-xl xl:text-2xl font-semibold text-gray-800 mb-2">
							{section.title}
						</h2>
						<div className="text-gray-600 leading-relaxed">
							{section.content}
						</div>
					</div>
				))}
			</div>

			<div className="row rounded-lg pt-10 p-6">
				<div className="mb-8">
					<h2 className="text-xl xl:text-2xl font-semibold text-gray-800 mb-2">
						{language === "en" ? "Contact Us" : "যোগাযোগ"}
					</h2>
					<div className="text-gray-600 leading-relaxed">
						<ul className="list-inside space-y-2 text-lg font-semibold font-manrope">
							<li>
								<strong>
									{language === "en" ? "Head Office:" : "প্রধান কার্যালয়:"}
								</strong>{" "}
								{language === "en"
									? "Shop-94, Dhaka University Market, Katabon Road, Dhaka-1000"
									: "শপ নাম্বার-৯৪, ঢাকা বিশ্ববিদ্যালয় মার্কেট, কাটাবন রোড, ঢাকা-১০০০"}
							</li>
							<li>
								<strong>
									{language === "en" ? "Branch Office:" : "শাখা কার্যালয়:"}
								</strong>{" "}
								{language === "en"
									? "Shop-142, Dhaka University Market, Katabon Road, Dhaka-1000"
									: "শপ নাম্বার-১৪২, ঢাকা বিশ্ববিদ্যালয় মার্কেট, কাটাবন রোড, ঢাকা-১০০০"}
							</li>
							<li>
								<strong>{language === "en" ? "Phone:" : "ফোন:"}</strong>{" "}
								{language === "en" ? "+880 1958253962" : "+8801958253961"}
							</li>
							<li>
								<strong>{language === "en" ? "Email:" : "ইমেইল:"}</strong>{" "}
								info@dpmsign.com
							</li>
						</ul>
					</div>
				</div>
			</div>
		</section>
	);
};

export default PPolicy;
