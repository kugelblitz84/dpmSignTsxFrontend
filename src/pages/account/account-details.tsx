import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeClosed } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { LoadingOverlay } from "@mantine/core";
import { Textarea } from "@/components/ui/textarea";
import { useFormValidation } from "@/hooks/use-form-validation";
import { customerService } from "@/api";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useDisclosure } from "@mantine/hooks";

interface EditFormProps {
	name: string;
	phone: string;
	currentPassword: string;
	newPassword: string;
	billingAddress: string;
	shippingAddress: string;
}

const AccountDetails = () => {
	const { customer, token, logout } = useAuth();
	const [loading, setLoading] = useDisclosure();
	const { toast } = useToast();
	const [showCurrentPassword, setShowCurrentPassword] =
		useState<boolean>(false);
	const [showNewPassword, setShowNewPassword] = useState<boolean>(false);

	const [editFormData, setEditFormData] = useState<EditFormProps>({
		name: customer?.name || "",
		phone: customer?.phone || "",
		billingAddress: customer?.billingAddress || "",
		shippingAddress: customer?.shippingAddress || "",
		currentPassword: "",
		newPassword: "",
	});

	const { errors, validateField, validateForm } = useFormValidation(
		customerService.editDetailsSchema
	);

	const handleEditFormData = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;

		console.log({ name, value });

		validateField(name, value);
		setEditFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleUpdate = async () => {
		try {
			if (validateForm(editFormData)) {
				setLoading.open();

				if (!token || !customer) return logout();

				const response = await customerService.updateCustomerProfile(
					token,
					editFormData.name,
					editFormData.currentPassword,
					editFormData.newPassword,
					editFormData.phone,
					editFormData.billingAddress,
					editFormData.shippingAddress
				);

				if (response.status === 200) {
					toast({
						description:
							response.message || "Your profile updated successfully.",
						variant: "success",
						duration: 10000,
					});

					setTimeout(() => {
						return logout();
					}, 2000);
				}
			}
		} catch (err: any) {
			setLoading.close();
			console.log(err.message);
			toast({
				description: err.message,
				variant: "destructive",
				duration: 10000,
			});
		}
	};

	return (
		<>
			{customer && (
				<Card className="w-full relative">
					{loading && (
						<>
							<LoadingOverlay
								visible={loading}
								zIndex={10}
								overlayProps={{ radius: "xs", blur: 1 }}
							/>
						</>
					)}

					<CardHeader>
						<CardTitle className="text-xl">Account Information</CardTitle>
						<CardDescription>
							Edit your account information here.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex items-start justify-center gap-2 w-full flex-col py-2">
							<Label
								htmlFor="name"
								className="text-base lg:text-lg cursor-pointer"
							>
								Name
							</Label>
							<Input
								id="name"
								name="name"
								value={editFormData.name}
								onChange={handleEditFormData}
								error={errors.name ? true : false}
							/>

							{errors.name && (
								<p className="text-rose-500 font-semibold text-sm">
									{errors.name}
								</p>
							)}
						</div>

						<div className="flex items-start justify-center gap-2 w-full flex-col py-2">
							<Label
								htmlFor="email"
								className="text-base lg:text-lg cursor-pointer"
							>
								Email Address
							</Label>
							<Input disabled readOnly value={customer.email} id="email" />
						</div>

						<div className="flex items-start justify-center gap-2 w-full flex-col py-2">
							<Label
								htmlFor="phone"
								className="text-base lg:text-lg cursor-pointer"
							>
								Phone
								<span className="text-skyblue"> *</span>
							</Label>
							<Input
								id="phone"
								placeholder="017........"
								name="phone"
								value={editFormData.phone}
								onChange={handleEditFormData}
								error={errors.phone ? true : false}
							/>
							{errors.phone && (
								<p className="text-rose-500 font-semibold text-sm">
									{errors.phone}
								</p>
							)}
						</div>

						<div className="flex items-start justify-center gap-2 w-full flex-col py-2">
							<Label
								htmlFor="currentPassword"
								className="text-base lg:text-lg cursor-pointer"
							>
								Current Password
							</Label>
							<div className="flex w-full items-center space-x-2 relative">
								<Input
									type={showCurrentPassword ? "text" : "password"}
									id="currentPassword"
									name="currentPassword"
									value={editFormData.currentPassword}
									onChange={handleEditFormData}
									error={errors.currentPassword ? true : false}
								/>
								{showCurrentPassword ? (
									<EyeClosed
										size={20}
										className="cursor-pointer text-gray absolute right-5"
										onClick={() => setShowCurrentPassword(false)}
									/>
								) : (
									<Eye
										size={20}
										className="cursor-pointer text-gray absolute right-5"
										onClick={() => setShowCurrentPassword(true)}
									/>
								)}
							</div>

							{errors.currentPassword && (
								<p className="text-rose-500 font-semibold text-sm">
									{errors.currentPassword}
								</p>
							)}
						</div>

						<div className="flex items-start justify-center gap-2 w-full flex-col py-2">
							<Label
								htmlFor="newPassword"
								className="text-base lg:text-lg cursor-pointer"
							>
								New Password
							</Label>
							<div className="flex w-full items-center space-x-2 relative">
								<Input
									type={showNewPassword ? "text" : "password"}
									id="newPassword"
									name="newPassword"
									value={editFormData.newPassword}
									onChange={handleEditFormData}
									error={errors.newPassword ? true : false}
								/>
								{showNewPassword ? (
									<EyeClosed
										size={20}
										className="cursor-pointer text-gray absolute right-5"
										onClick={() => setShowNewPassword(false)}
									/>
								) : (
									<Eye
										size={20}
										className="cursor-pointer text-gray absolute right-5"
										onClick={() => setShowNewPassword(true)}
									/>
								)}
							</div>
							{errors.newPassword && (
								<p className="text-rose-500 font-semibold text-sm">
									{errors.newPassword}
								</p>
							)}
						</div>

						<div className="flex items-start justify-center gap-2 w-full flex-col py-2">
							<Label
								htmlFor="billingAddress"
								className="text-base lg:text-lg cursor-pointer"
							>
								Billing Address
								<span className="text-skyblue"> *</span>
							</Label>
							<Textarea
								id="billingAddress"
								name="billingAddress"
								rows={5}
								value={editFormData.billingAddress}
								onChange={handleEditFormData}
								error={errors.billingAddress ? true : false}
							/>
							{errors.billingAddress && (
								<p className="text-rose-500 font-semibold text-sm">
									{errors.billingAddress}
								</p>
							)}
						</div>

						<div className="flex items-start justify-center gap-2 w-full flex-col py-2">
							<Label
								htmlFor="shippingAddress"
								className="text-base lg:text-lg cursor-pointer"
							>
								Shipping Address
								<span className="text-skyblue"> *</span>
							</Label>
							<Textarea
								id="shippingAddress"
								name="shippingAddress"
								rows={5}
								value={editFormData.shippingAddress}
								onChange={handleEditFormData}
								error={errors.shippingAddress ? true : false}
							/>
							{errors.shippingAddress && (
								<p className="text-rose-500 font-semibold text-sm">
									{errors.shippingAddress}
								</p>
							)}
						</div>
					</CardContent>

					<CardFooter className="flex justify-between">
						<div className="flex items-start justify-center gap-2 w-full flex-col py-2">
							<p className="text-base font-semibold text-gray py-3">
								Leave blank all the fields to put unchange
							</p>
							<Button className="w-full" onClick={handleUpdate}>
								Save Changes
							</Button>
						</div>
					</CardFooter>
				</Card>
			)}
		</>
	);
};

export default AccountDetails;
