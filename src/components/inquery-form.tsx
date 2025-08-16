import { Send, Trash, Upload } from "lucide-react";
import IllustratedImg from "@/assets/icons/contact-form-illustrator.svg";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import React, { ChangeEvent, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useFormValidation } from "@/hooks/use-form-validation";
import { inqueryService } from "@/api";
import { useDisclosure } from "@mantine/hooks";
import { LoadingOverlay } from "@mantine/core";

interface InqueryFormProps {
	name: string;
	email: string;
	phone: string;
	company: string;
	inqueryType: string;
	designFiles: File[] | [];
	message: string;
}

const InqueryForm = () => {
	const [loading, setLoading] = useDisclosure();
	const { toast } = useToast();
	const [inqueryFormData, setInqueryFormData] = useState<InqueryFormProps>({
		name: "",
		email: "",
		phone: "",
		company: "",
		inqueryType: "",
		designFiles: [],
		message: "",
	});
	const { errors, validateField, validateForm } = useFormValidation(
		inqueryService.inquerySchema
	);

	const handleSubmit = async () => {
		try {
			if (validateForm(inqueryFormData)) {
				setLoading.open();
				await inqueryService.createInquery(
					inqueryFormData.name,
					inqueryFormData.email,
					inqueryFormData.phone,
					inqueryFormData.company,
					inqueryFormData.inqueryType,
					inqueryFormData.designFiles,
					inqueryFormData.message
				);

				toast({
					description: (
						<div className="w-full flex items-center justify-center gap-4 h-auto text-base lg:text-lg">
							<Send size={25} className="min-w-fit" />
							<span>
								Thank you for reaching out! Our team will get back to you within
								24 hours.
							</span>
						</div>
					),
					duration: 10000,
				});

				setInqueryFormData({
					name: "",
					email: "",
					phone: "",
					company: "",
					inqueryType: "",
					designFiles: [],
					message: "",
				});
			}
		} catch (err: any) {
			setLoading.close();
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

	const handleInqueryFormData = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setInqueryFormData({
			...inqueryFormData,
			[name]: value,
		});
		validateField(name, value);
	};

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const files = Array.from(e.target.files).slice(
				0,
				Math.abs(inqueryFormData.designFiles.length - 5)
			);

			setInqueryFormData({
				...inqueryFormData,
				designFiles: [...inqueryFormData.designFiles, ...files],
			});
		}
	};

	return (
		<div className="row py-8 grid grid-cols-1 xl:grid-cols-2 place-items-center gap-4 lg:gap-2">
			<div className="w-full mx-auto py-2 px-4">
				<div className="flex items-center justify-around flex-col gap-4 relative">
					{loading && (
						<LoadingOverlay
							visible={loading}
							zIndex={10}
							overlayProps={{ radius: "xs", blur: 1 }}
						/>
					)}

					<div className="form-group flex-col sm:flex-row items-start">
						<div className="w-full space-y-2">
							<Label
								htmlFor="name"
								className="text-base lg:text-lg cursor-pointer"
							>
								Name
								<span className="text-skyblue"> *</span>
							</Label>
							<Input
								type="text"
								id="name"
								name="name"
								value={inqueryFormData.name}
								onChange={handleInqueryFormData}
								error={errors.name ? true : false}
							/>
							{errors.name && (
								<p className="text-rose-500 font-semibold text-sm">
									{errors.name}
								</p>
							)}
						</div>

						<div className="w-full space-y-2">
							<Label
								htmlFor="email"
								className="text-base lg:text-lg cursor-pointer"
							>
								Email
								<span className="text-skyblue"> *</span>
							</Label>
							<Input
								type="email"
								id="email"
								name="email"
								value={inqueryFormData.email}
								onChange={handleInqueryFormData}
								error={errors.email ? true : false}
							/>
							{errors.email && (
								<p className="text-rose-500 font-semibold text-sm">
									{errors.email}
								</p>
							)}
						</div>
					</div>

					<div className="form-group flex-col sm:flex-row items-start">
						<div className="w-full space-y-2">
							<Label
								htmlFor="phone"
								className="text-base lg:text-lg cursor-pointer"
							>
								Phone Number
								<span className="text-skyblue"> *</span>
							</Label>
							<Input
								type="text"
								id="phone"
								placeholder="017........."
								name="phone"
								value={inqueryFormData.phone}
								onChange={handleInqueryFormData}
								error={errors.phone ? true : false}
							/>
							{errors.phone && (
								<p className="text-rose-500 font-semibold text-sm">
									{errors.phone}
								</p>
							)}
						</div>

						<div className="w-full space-y-2">
							<Label
								htmlFor="company"
								className="text-base lg:text-lg cursor-pointer"
							>
								Your Company/Organization
							</Label>
							<Input
								type="text"
								id="company"
								name="company"
								value={inqueryFormData.company}
								onChange={handleInqueryFormData}
								error={errors.company ? true : false}
							/>
							{errors.company && (
								<p className="text-rose-500 font-semibold text-sm">
									{errors.company}
								</p>
							)}
						</div>
					</div>

					<div className="form-group flex flex-col gap-2 items-start">
						<Select
							onValueChange={(value) => {
								setInqueryFormData({
									...inqueryFormData,
									inqueryType: value,
								});
								validateField("inqueryType", value);
							}}
							name="inqueryType"
						>
							<SelectTrigger
								error={errors.inqueryType ? true : false}
								className="w-full text-base lg:text-lg"
							>
								<SelectValue placeholder="Inquiry Type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem
									className="text-base lg:text-lg"
									value="product-information"
								>
									Product Information
								</SelectItem>
								<SelectItem className="text-base lg:text-lg" value="pricing">
									Pricing
								</SelectItem>
								<SelectItem
									className="text-base lg:text-lg"
									value="customization-options"
								>
									Customization Options
								</SelectItem>
								<SelectItem className="text-base lg:text-lg" value="others">
									Others
								</SelectItem>
							</SelectContent>
						</Select>
						{errors.inqueryType && (
							<p className="text-rose-500 font-semibold text-sm">
								{errors.inqueryType}
							</p>
						)}
					</div>

					{inqueryFormData.designFiles.length < 5 && (
						<Label
							className="relative w-full h-40 border-dashed border-[3px] border-gray/30 hover:border-skyblue/80 transition-all duration-300 cursor-pointer rounded-lg flex items-start justify-center flex-col gap-1.5"
							htmlFor="designFile"
						>
							<Input
								id="designFile"
								type="file"
								multiple
								accept="image/*"
								className="w-full h-full pointer-events-none hidden"
								onChange={handleFileChange}
								name="designFile"
							/>
							<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-40 flex items-center justify-center flex-col gap-3">
								<Upload />
								<span className="text-sm cursor-pointer">
									Click to upload design file. Max 5 image.
								</span>
							</div>
						</Label>
					)}

					{inqueryFormData.designFiles && (
						<div className="w-full h-auto grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
							{inqueryFormData.designFiles.map((designFile, index) => (
								<div
									key={index}
									className="flex items-start justify-center flex-col gap-2 overflow-hidden"
								>
									<img
										className="w-36 h-36 rounded-md"
										src={URL.createObjectURL(designFile)}
										alt="Not Found"
									/>

									<Button
										size="sm"
										variant="destructive"
										onClick={() => {
											setInqueryFormData((prevFormData) => ({
												...prevFormData,
												designFiles: prevFormData.designFiles.filter(
													(_, itemIndex) => itemIndex != index
												),
											}));
										}}
									>
										<Trash />
										Remove
									</Button>
								</div>
							))}
						</div>
					)}
					<div className="form-group flex flex-col gap-2 items-start">
						<Textarea
							name="message"
							cols={30}
							rows={10}
							placeholder="Your message *"
							value={inqueryFormData.message}
							onChange={handleInqueryFormData}
							error={errors.message ? true : false}
						></Textarea>
						{errors.message && (
							<p className="text-rose-500 font-semibold text-sm">
								{errors.message}
							</p>
						)}
					</div>

					<div className="form-group">
						<Button type="submit" className="w-full" onClick={handleSubmit}>
							Send Inquiry
						</Button>
					</div>
				</div>
			</div>
			<img
				src={IllustratedImg}
				className="max-w-full lg:w-2/3"
				alt="Illustration"
			/>
		</div>
	);
};

export default InqueryForm;
