import { Mail } from "lucide-react";
import NewsletterIllustrator from "@/assets/icons/newsletter-illustrator.svg";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useFormValidation } from "@/hooks/use-form-validation";
import { newsletterService } from "@/api";
import { useDisclosure } from "@mantine/hooks";
import { LoadingOverlay } from "@mantine/core";
import { useToast } from "@/hooks/use-toast";

const Newsletter = () => {
	const [email, setEmail] = useState<string>("");
	const [loading, setLoading] = useDisclosure(false);

	const { errors, setErrors, validateField } = useFormValidation(
		newsletterService.subscribeSchema
	);
	const { toast } = useToast();

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setEmail(value);
		validateField("email", value);
		setErrors((prevErrors) => ({
			...prevErrors,
		}));
	};

	const handleSubscribe = async () => {
		try {
			if (validateField("email", email)) {
				console.log(email);
				setLoading.open();

				const result = await newsletterService.subscribe(email);
				toast({
					description: result.message,
					variant: "success",
					duration: 10000,
				});
				setEmail("");
			}
		} catch (err: any) {
			console.log(err.message);
			toast({
				description: err.message,
				variant: "destructive",
				duration: 10000,
			});
		} finally {
			setLoading.close();
		}
	};

	return (
		<section data-aos="fade-up" className="py-12 bg-gray-50">
			<div className="container mx-auto px-4">
				<div className="flex flex-col lg:flex-row items-center justify-center gap-10 bg-slate-100/40 backdrop-blur-lg border-gray/80 border-2rem rounded-lg overflow-hidden px-6 py-12 text-center">
					{/* Unified center block: image + content treated as one unit */}
					<div className="flex flex-col lg:flex-row items-center justify-center gap-10 max-w-5xl w-full">
						<div className="flex-shrink-0 flex items-center justify-center">
							<img
								src={NewsletterIllustrator}
								className="max-w-[260px] w-full h-auto"
								alt="Newsletter Illustrator"
							/>
						</div>
						<div className="flex flex-col items-center justify-center gap-5 w-full">
							<h2 className="text-2xl xl:text-3xl font-semibold max-w-2xl">
								Stay Updated with Our Latest Products and Offers
							</h2>
							<p className="text-base font-semibold max-w-xl">
								Subscribe to our newsletter to receive updates on new arrivals, exclusive deals, and more.
							</p>
							<div className="relative w-full max-w-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4">
								<LoadingOverlay
									visible={loading}
									zIndex={10}
									overlayProps={{ radius: "xs", blur: 2 }}
								/>
								<div className="relative flex-1">
									<Mail
										className="absolute top-1/2 left-4 -translate-y-1/2 text-gray"
										size={20}
									/>
									<Input
										type="email"
										placeholder="your email"
										className="pl-12"
										value={email}
										onChange={handleEmailChange}
									/>
								</div>
								<Button
									variant="success"
									size="sm"
									onClick={handleSubscribe}
									className="w-full sm:w-auto"
								>
									Subscribe!
								</Button>
							</div>
							{errors.email && (
								<p className="text-rose-500 font-semibold text-sm">
									{errors.email}
								</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Newsletter;
