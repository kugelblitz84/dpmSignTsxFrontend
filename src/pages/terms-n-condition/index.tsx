import { Link } from "react-router-dom";
import SectionHeading from "@/components/section-heading";
import routes from "@/routes";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";

interface Section {
	title: string;
	content: React.ReactNode;
}

const TermsNCondition = () => {
	const [language, setLanguage] = useState<"en" | "bn">("en");

	const enSectionHeadingProp = {
		title: "Terms & Conditions",
		description:
			"Welcome to Dhaka Plastic & Metal. By accessing and using our website Dhaka Plastic & Metal and services, you agree to comply with the terms and conditions set forth below. Please read these terms carefully before proceeding with any orders or usage of our services. If you do not agree with any part of these terms, please do not use this website.",
	};

	const bnSectionHeadingProp = {
		title: "শর্তাবলী ও নীতিমালা",
		description:
			"স্বাগতম! ধন্যবাদ আমাদের ওয়েবসাইট ভিজিট করার জন্য। ঢাকা প্লাস্টিক অ্যান্ড মেটাল-এর পণ্য বা সেবাগুলো ব্যবহারের মাধ্যমে আপনি নিচের শর্তাবলী ও নীতিমালাগুলো মেনে নিতে সম্মত হচ্ছেন। এই নীতিমালাগুলো আমাদের ওয়েবসাইটের সকল ব্যবহারকারী, ক্রেতা, এবং ভিজিটরের জন্য প্রযোজ্য।",
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
			title: "Introduction",
			content: (
				<>
					<p className="text-lg font-semibold">
						This website is operated by{" "}
						<span className="font-manrope font-semibold text-skyblue">
							Dhaka Plastic & Metal{" "}
						</span>
						("we," "our," "us"). By using our website, purchasing products, or
						engaging with our services, you agree to abide by these{" "}
						<Link
							to={routes.termsNCondition.path}
							className="font-manrope font-semibold underline text-skyblue"
						>
							Terms & Conditions
						</Link>
						.
					</p>
					<p className="text-lg font-semibold mt-2">
						These terms apply to all visitors, customers, and users of this
						website.
					</p>
				</>
			),
		},
		{
			title: "Definitions",
			content: (
				<ul className="list-disc list-inside space-y-2 text-lg font-semibold font-manrope pl-8">
					<li>
						<strong>Company:</strong> Refers to Dhaka Plastic & Metal.
					</li>
					<li>
						<strong>Website:</strong> Refers to{" "}
						<Link
							to={routes.home.path}
							className="font-manrope font-semibold underline text-skyblue"
						>
							Dhaka Plastic & Metal
						</Link>
						.
					</li>
					<li>
						<strong>Products:</strong> Includes all customized and ready-made
						signage, crests, corporate gifts, and related products sold by us.
					</li>
					<li>
						<strong>User or Customer:</strong> Refers to any individual,
						business, or institution accessing our website or purchasing our
						products.
					</li>
				</ul>
			),
		},
		{
			title: "Use of the Website",
			content: (
				<ul className="list-disc list-inside space-y-2 text-lg font-semibold font-manrope pl-8">
					<li>
						The content on this website is for informational and transactional
						purposes only.
					</li>
					<li>
						You may not misuse the website for fraudulent activities, data
						extraction, hacking, or actions that violate applicable laws.
					</li>
					<li>
						We reserve the right to restrict or terminate your access to the
						website without prior notice if misuse is detected.
					</li>
				</ul>
			),
		},
		{
			title: "Product Information & Pricing",
			content: (
				<ul className="list-disc list-inside space-y-2 text-lg font-semibold font-manrope pl-8">
					<li>
						All product details, images, and specifications on our website are
						for reference purposes. While we strive to display accurate
						information, minor variations may occur during production.
					</li>
					<li>
						Prices are listed in Bangladeshi Taka (BDT) and are subject to
						change without prior notice.
					</li>
					<li>
						Final pricing for customized products will depend on the design,
						size, quantity, and material specifications shared by the customer.
					</li>
				</ul>
			),
		},
		{
			title: "Orders and Payments",
			content: (
				<>
					<h4 className="font-semibold text-xl">Placing an Order:</h4>
					<ul className="list-disc list-inside space-y-2 mt-2 text-lg font-semibold font-manrope pl-8">
						<li>
							Orders can be placed via our website, email, or direct
							consultation.
						</li>
						<li>
							For customized products, a digital design proof/mockup will be
							provided for approval before production begins.
						</li>
					</ul>
					<h4 className="font-semibold text-xl mt-4">Payment Terms:</h4>
					<ul className="list-disc list-inside space-y-2 mt-2 text-lg font-semibold font-manrope pl-8">
						<li>
							We require only 25% to 50% advanced payment to confirm the order.
						</li>
						<li>
							The remaining payment must be settled before product delivery.
						</li>
						<li>
							We accept payments via bKash, Nagad, bank transfer, and
							credit/debit cards.
						</li>
					</ul>
				</>
			),
		},
		{
			title: "Order Confirmation",
			content: (
				<ul className="list-disc list-inside space-y-2 text-lg font-semibold font-manrope pl-8">
					<li>
						Once the advance payment is made and the design is approved, the
						order will be confirmed, and production will begin.
					</li>
				</ul>
			),
		},
		{
			title: "Cancellations",
			content: (
				<ul className="list-disc list-inside space-y-2 text-lg font-semibold font-manrope pl-8">
					<li>
						Orders can be canceled within 24 hours of placement without any
						charge.
					</li>
					<li>
						For certain customized products, cancellations are not allowed at
						any stage of production.
					</li>
					<li>
						If cancellations occur after design work has started, a design
						charge will apply to compensate for design time and resources.
					</li>
					<li>No refunds will be issued once production has begun.</li>
				</ul>
			),
		},
		{
			title: "Delivery & Shipping",
			content: (
				<ul className="list-disc list-inside space-y-2 text-lg font-semibold font-manrope pl-8">
					<li>
						<strong>Delivery Time:</strong> Standard orders take 7-10 business
						days. Customized orders will be communicated during confirmation.
						Bulk/customized orders will be communicated through order page
						timeline during confirmation.
					</li>
					<li>
						<strong>Delivery Locations:</strong> We deliver across Bangladesh.
					</li>
					<li>
						<strong>Delays:</strong> Dhaka Plastic & Metal is not responsible
						for delays caused by courier services or external factors.
					</li>
					<li>
						<strong>Damaged Shipments:</strong> If your product arrives damaged,
						notify us within 24 hours of delivery with supporting images. We
						will assess the issue and provide a solution based on our{" "}
						<Link
							to={routes.exchangePolicy.path}
							className="font-manrope font-semibold underline text-skyblue"
						>
							Exchange Policy.
						</Link>
					</li>
				</ul>
			),
		},
		{
			title: "Intellectual Property",
			content: (
				<ul className="list-disc list-inside space-y-2 text-lg font-semibold font-manrope pl-8">
					<li>
						All content on this website, including text, images, logos, product
						designs, and graphics, is the exclusive property of Dhaka Plastic &
						Metal.
					</li>
					<li>
						You may not copy, reproduce, or distribute any part of our content
						without written permission.
					</li>
					<li>
						Custom designs created by us for customers remain our intellectual
						property unless explicitly transferred.
					</li>
				</ul>
			),
		},
		{
			title: "Limitation of Liability",
			content: (
				<ul className="list-disc list-inside space-y-2 text-lg font-semibold font-manrope pl-8">
					<li>
						Dhaka Plastic & Metal is not liable for losses resulting from
						improper use of products.
					</li>
					<li>
						Delays or issues caused by third-party services (e.g., couriers,
						payment gateways).
					</li>
					<li>
						Indirect, incidental, or consequential damages arising from website
						use.
					</li>
					<li>
						Our maximum liability will be limited to the value of the purchased
						product.
					</li>
				</ul>
			),
		},
		{
			title: "Governing Law",
			content: (
				<>
					<p className="text-lg font-semibold">
						These Terms & Conditions are governed by the laws of Bangladesh. Any
						disputes shall be resolved in the courts of Dhaka, Bangladesh.
					</p>
				</>
			),
		},
		{
			title: "Updates to Terms & Conditions",
			content: (
				<>
					<p className="text-lg font-semibold">
						We reserve the right to modify or update these Terms & Conditions at
						any time without prior notice. Changes will take effect immediately
						upon posting on this page.
					</p>
				</>
			),
		},
	];

	const bnSections: Section[] = [
		{
			title: "প্রযোজ্য তারিখ",
			content: (
				<>
					<p className="text-lg font-semibold font-firasans">
						১ জানুয়ারি, ২০২৫
					</p>
				</>
			),
		},
		{
			title: "সাধারণ শর্তাবলী",
			content: (
				<>
					<p className="text-lg font-semibold">
						এই শর্তাবলী ঢাকা প্লাস্টিক অ্যান্ড মেটাল ও আপনার
						(ক্রেতা/ব্যবহারকারী) মধ্যে চুক্তির ভিত্তি তৈরি করে। আমাদের পণ্য বা
						সেবা ব্যবহার করলে এই নীতিমালার শর্তাবলী মেনে নেওয়া আপনার জন্য
						বাধ্যতামূলক।
					</p>
					<p className="text-lg font-semibold mt-2">
						আমরা আমাদের শর্তাবলী যেকোনো সময় পরিবর্তন বা আপডেট করার অধিকার রাখি।
						নতুন কোনো পরিবর্তন কার্যকর হওয়ার সাথে সাথেই ওয়েবসাইটে প্রকাশিত
						হবে।
					</p>
				</>
			),
		},
		{
			title: "সংজ্ঞা",
			content: (
				<ul className="list-disc list-inside space-y-2 text-lg font-semibold font-manrope pl-8">
					<li>
						<strong>কোম্পানি:</strong> এখানে "ঢাকা প্লাস্টিক অ্যান্ড মেটাল"।
					</li>
					<li>
						<strong>ওয়েবসাইট:</strong>{" "}
						<Link
							to={routes.home.path}
							className="font-manrope font-semibold underline text-skyblue"
						>
							ঢাকা প্লাস্টিক অ্যান্ড মেটাল
						</Link>
						-এর অফিসিয়াল ওয়েবসাইট।
					</li>
					<li>
						<strong>পণ্য:</strong> আমাদের কাস্টমাইজড সাইনেজ, ক্রেস্ট (সম্মাননা
						স্মারক), কর্পোরেট উপহার, এবং অন্যান্য পণ্য।
					</li>
					<li>
						<strong>ক্রেতা/ব্যবহারকারী:</strong> যে কোনো ব্যক্তি, ব্যবসা
						প্রতিষ্ঠান বা সংস্থা যারা আমাদের পণ্য ক্রয় বা ওয়েবসাইট ব্যবহার
						করছেন।
					</li>
				</ul>
			),
		},
		{
			title: "ওয়েবসাইট ব্যবহারের নীতিমালা",
			content: (
				<ul className="list-disc list-inside space-y-2 text-lg font-semibold font-manrope pl-8">
					<li>
						আমাদের ওয়েবসাইটের কন্টেন্ট শুধুমাত্র তথ্য এবং লেনদেনের জন্য
						ব্যবহারের উপযোগী।
					</li>
					<li>
						অননুমোদিত প্রবেশ, প্রতারণামূলক কার্যক্রম, ডেটা চুরি বা যে কোনো
						বেআইনি কাজ সম্পূর্ণ নিষিদ্ধ।
					</li>
					<li>
						যদি কোনো অনুপযুক্ত বা বেআইনি কাজ ধরা পড়ে, আমরা আপনার অ্যাক্সেস
						বাতিল বা সীমিত করার অধিকার রাখি।
					</li>
				</ul>
			),
		},
		{
			title: "পণ্য সম্পর্কিত তথ্য ও মূল্য",
			content: (
				<ul className="list-disc list-inside space-y-2 text-lg font-semibold font-manrope pl-8">
					<li>
						আমরা পণ্যের বিবরণ, ছবি ও স্পেসিফিকেশন যতটা সম্ভব সঠিকভাবে প্রদর্শনের
						চেষ্টা করি। তবে কাস্টমাইজেশনের সময় কিছু ভিন্নতা থাকতে পারে।
					</li>
					<li>
						সকল মূল্য বাংলাদেশি টাকা (BDT) তে উল্লেখিত, যা পূর্ব ঘোষণা ছাড়াই
						পরিবর্তন হতে পারে।
					</li>
					<li>
						কাস্টমাইজড পণ্যের চূড়ান্ত মূল্য ডিজাইন, আকার, উপকরণ এবং পরিমাণের
						উপর নির্ভর করে।
					</li>
				</ul>
			),
		},
		{
			title: "অর্ডার এবং পেমেন্ট নীতিমালা",
			content: (
				<>
					<h4 className="font-semibold text-xl">অর্ডার দেওয়ার প্রক্রিয়া:</h4>
					<ul className="list-disc list-inside space-y-2 mt-2 text-lg font-semibold font-manrope pl-8">
						<li>
							ওয়েবসাইট, ইমেইল বা সরাসরি পরামর্শের মাধ্যমে অর্ডার দেওয়া যাবে।
						</li>
						<li>
							কাস্টমাইজড পণ্যের জন্য ডিজাইনের মকআপ/প্রুফ গ্রাহকের অনুমোদনের জন্য
							পাঠানো হবে।
						</li>
					</ul>
					<h4 className="font-semibold text-xl mt-4">পেমেন্টের নিয়ম:</h4>
					<ul className="list-disc list-inside space-y-2 mt-2 text-lg font-semibold font-manrope pl-8">
						<li>অর্ডার নিশ্চিত করতে ২৫%-৫০% অগ্রিম পেমেন্ট প্রয়োজন।</li>
						<li>
							বাকি টাকা ক্যাশ অন ডেলিভারি এর মাধ্যমে অথবা সরাসরি শপ থেকে পণ্য
							নেয়ার সময় দিতে হবে।
						</li>
						<li>
							যদি আমাদের ইন্সটলেশন সার্ভিস (ফিটিং সার্ভিস) নেন তাহলে সাইটে
							যাওয়ার আগে সম্পূর্ণ টাকা পরিশোধ করতে হবে। শুধুমাত্র ফিটিং চার্জ
							সাইট থেকে দেয়ার সুযোগ রয়েছে।
						</li>
						<li>
							bKash, Nagad, ব্যাংক ট্রান্সফার, ক্রেডিট/ডেবিট কার্ড এবং নগদ
							পেমেন্ট গ্রহণযোগ্য।
						</li>
					</ul>
				</>
			),
		},
		{
			title: "অর্ডার কনফার্মেশন",
			content: (
				<ul className="list-disc list-inside space-y-2 text-lg font-semibold font-manrope pl-8">
					<li>
						অগ্রিম টাকা জমা হওয়ার পরে এবং ডিজাইন অনুমোদিত হলে অর্ডার কনফার্ম
						হবে।
					</li>
				</ul>
			),
		},
		{
			title: "অর্ডার বাতিল করার নীতি",
			content: (
				<ul className="list-disc list-inside space-y-2 text-lg font-semibold font-manrope pl-8">
					<li>অর্ডার দেওয়ার ২৪ ঘণ্টার মধ্যে বিনামূল্যে বাতিল করা যাবে।</li>
					<li>
						কাস্টম পণ্যের ক্ষেত্রে প্রোডাকশন শুরু হওয়ার পর বাতিল করা যাবে না।
					</li>
					<li>ডিজাইন শুরু হওয়ার পরে বাতিল হলে ডিজাইন চার্জ প্রযোজ্য।</li>
					<li>প্রোডাকশন শুরু হওয়ার পর কোনো রিফান্ড দেওয়া হবে না।</li>
				</ul>
			),
		},
		{
			title: "ডেলিভারি ও শিপিং নীতিমালা",
			content: (
				<ul className="list-disc list-inside space-y-2 text-lg font-semibold font-manrope pl-8">
					<li>
						<strong>ডেলিভারি সময়:</strong> সাধারণ পণ্যের জন্য ৭-১০ কার্যদিবস
						প্রয়োজন। কাস্টমাইজড বা বাল্ক অর্ডারের ক্ষেত্রে সময় অর্ডার
						নিশ্চিতকরণের সময় জানানো হবে।
					</li>
					<li>
						<strong>ডেলিভারি এলাকা:</strong> আমরা বাংলাদেশের যেকোনো স্থানে
						ডেলিভারি প্রদান করি।
					</li>
					<li>
						<strong>ডেলিভারি দেরি:</strong> কুরিয়ার সার্ভিস বা বাহ্যিক
						কারণগুলোর কারণে দেরি হলে কোম্পানি দায়ী থাকবে না।
					</li>
					<li>
						<strong>ডেলিভারির ক্ষতিগ্রস্ত পণ্য:</strong> পণ্য ক্ষতিগ্রস্ত
						অবস্থায় পৌঁছালে, ডেলিভারির ২৪ ঘণ্টার মধ্যে আমাদের অবহিত করতে হবে
						এবং ছবি প্রদান করতে হবে। আমরা আমাদের{" "}
						<Link
							to={routes.exchangePolicy.path}
							className="font-manrope font-semibold underline text-skyblue"
						>
							এক্সচেঞ্জ পলিসি
						</Link>{" "}
						অনুযায়ী সমাধান করব।
					</li>
				</ul>
			),
		},
		{
			title: "ইন্টেলেকচুয়াল প্রোপার্টি নীতিমালা",
			content: (
				<ul className="list-disc list-inside space-y-2 text-lg font-semibold font-manrope pl-8">
					<li>
						আমাদের ওয়েবসাইটের সকল কন্টেন্ট (লেখা, ছবি, ডিজাইন ইত্যাদি) ঢাকা
						প্লাস্টিক অ্যান্ড মেটাল-এর একান্ত সম্পত্তি।
					</li>
					<li>
						অনুমতি ছাড়া কোনো কন্টেন্ট কপি, পুনরুৎপাদন বা বিতরণ করা যাবে না।
					</li>
					<li>
						কাস্টম ডিজাইন আমাদের দ্বারা তৈরি হলেও তা কোম্পানির ইন্টেলেকচুয়াল
						প্রোপার্টি হিসেবে থাকবে, যদি না লিখিত চুক্তিতে ভিন্ন কিছু বলা হয়।
					</li>
				</ul>
			),
		},
		{
			title: "দায় সীমাবদ্ধতা",
			content: (
				<ul className="list-disc list-inside space-y-2 text-lg font-semibold font-manrope pl-8">
					<li>গ্রাহকের পণ্যের ভুল বা অনুপযুক্ত ব্যবহার।</li>
					<li>
						কুরিয়ার, পেমেন্ট গেটওয়ে বা তৃতীয় পক্ষের কোনো সেবার কারণে সৃষ্ট
						সমস্যা।
					</li>
					<li>
						ওয়েবসাইট ব্যবহারের ফলে উদ্ভূত পরোক্ষ, আকস্মিক বা পরিণামমূলক ক্ষতি।
					</li>
					<li>
						সর্বোচ্চ দায়বদ্ধতা ক্রয়ের মূল পণ্যের মূল্যের মধ্যেই সীমাবদ্ধ।
					</li>
				</ul>
			),
		},
		{
			title: "আইন এবং বিরোধ নিষ্পত্তি",
			content: (
				<>
					<p className="text-lg font-semibold">
						এই শর্তাবলী বাংলাদেশের আইন অনুযায়ী পরিচালিত হবে। যেকোনো বিরোধ
						নিষ্পত্তির জন্য ঢাকার আদালত একমাত্র অধিকার রাখে।
					</p>
				</>
			),
		},
		{
			title: "শর্তাবলী হালনাগাদ",
			content: (
				<>
					<p className="text-lg font-semibold">
						আমরা আমাদের শর্তাবলী যেকোনো সময় পূর্ব ঘোষণা ছাড়াই পরিবর্তন বা
						হালনাগাদ করার অধিকার রাখি। পরিবর্তনগুলো এই পৃষ্ঠায় প্রকাশিত হওয়ার
						সাথে সাথে কার্যকর হবে।
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

export default TermsNCondition;
