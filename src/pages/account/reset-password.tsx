import SectionHeading, {
	SectionHeadingProps,
} from "@/components/section-heading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useFormValidation } from "@/hooks/use-form-validation";
import { customerService } from "@/api";
import { useDisclosure } from "@mantine/hooks";
import { LoadingOverlay } from "@mantine/core";
import { useAuth } from "@/hooks/use-auth";
import routes from "@/routes";
import { Eye, EyeClosed } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
	const { login } = useAuth();
	const [loading, setLoading] = useDisclosure(false);
	const [email, setEmail] = useState<string>("");
	const [isEmailSent, setIsEmailSent] = useState<boolean>(false);
	const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
	const [isVerifiedOTP, setVerifiedOTP] = useState<boolean>(false);
	const [timeLeft, setTimeLeft] = useState(2 * 60); // 2 minutes in seconds
	const [enableTimer, setEnableTimer] = useState<boolean>(false);
	const [password, setPassword] = useState<string>("");
	const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);
	const { errors, setErrors, validateField } = useFormValidation(
		customerService.resetPasswordSchema
	);
	const { toast } = useToast();

	// Handle email input change
	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setEmail(value);
		validateField("email", value);
		setErrors((prevErrors) => ({
			...prevErrors,
			global: "",
		}));
	};

	// Handle reset password request
	const requestResetPassword = async () => {
		try {
			if (validateField("email", email)) {
				setLoading.open();

				// Simulate API call
				const result = await customerService.requestResetPassword(
					email
				);
				toast({
					title: result.message,
					description: `A reset password OTP has been sent to [${email}]`,
					variant: "success",
					duration: 10000,
				});
				setIsEmailSent(true);
				setEnableTimer(true);
			}
		} catch (err: any) {
			console.error(err.message);
			setErrors((prevErrors) => ({ ...prevErrors, global: err.message }));
			setIsEmailSent(false);
			setEnableTimer(false);
			toast({
				description: err.message,
				variant: "destructive",
				duration: 10000,
			});
		} finally {
			setLoading.close();
		}
	};

	// ? OTP Handlers
	const handleOTPFieldChange = (index: number, value: string) => {
		const newOtp = [...otp];
		newOtp[index] = value;
		setOtp(newOtp);

		// Auto-focus to the next input
		if (value && index < 5) {
			const nextInput = document.getElementById(`otp-input-${index + 1}`);
			if (nextInput) {
				nextInput.focus();
			}
		}
	};
	const handleOTPFieldKeyDown = (
		index: number,
		e: React.KeyboardEvent<HTMLInputElement>
	) => {
		if (e.key === "Backspace" && !otp[index] && index > 0) {
			const prevInput = document.getElementById(`otp-input-${index - 1}`);
			if (prevInput) {
				prevInput.focus();
			}
		}
	};
	const handleOTPFieldPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		e.preventDefault();
		const pasteData = e.clipboardData.getData("text").slice(0, 6).split("");
		const newOtp = [...otp];
		pasteData.forEach((value, index) => {
			if (index < 6) {
				newOtp[index] = value;
			}
		});
		setOtp(newOtp);
	};
	// Handle timer countdown
	useEffect(() => {
		if (!enableTimer) return;

		const timer = setInterval(() => {
			setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
		}, 1000);

		return () => clearInterval(timer);
	}, [enableTimer]);
	// Format time left into MM:SS
	const formatTime = (seconds: number): string => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
			.toString()
			.padStart(2, "0")}`;
	};

	// handle verify otp
	const verifyOTP = async () => {
		const otpCode = otp.join("");
		if (otpCode.length !== 6) {
			toast({
				title: "Please enter a valid 6-digit OTP",
				variant: "destructive",
				duration: 10000,
			});
			return;
		}

		try {
			setLoading.open();
			// Simulate OTP verification
			const result = await customerService.verifyResetPassword(
				email,
				otpCode
			);
			toast({
				title: result.message,
				description: "Please reset your password.",
				variant: "success",
				duration: 10000,
			});
			setVerifiedOTP(true);
			setEnableTimer(false);
			setErrors((prevErrors) => ({ ...prevErrors, global: "" }));
		} catch (err: any) {
			console.error(err.message);
			setErrors((prevErrors) => ({ ...prevErrors, global: err.message }));
			if (timeLeft > 0) {
				setOtp(Array(6).fill("")); // Reset OTP state
				const firstInput = document.getElementById("otp-input-0");
				if (firstInput) {
					firstInput.focus(); // Focus on the first input field
				}
				setErrors((prevErrors) => ({
					...prevErrors,
					global: err.message,
				}));
			}
			toast({
				description: err.message,
				variant: "destructive",
				duration: 10000,
			});
		} finally {
			setLoading.close();
		}
	};

	// ? reset the password

	// handle password input change
	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setPassword(value);
		validateField("password", value);
		setErrors((prevErrors) => ({
			...prevErrors,
			global: "",
		}));
	};

	const updatePassword = async () => {
		try {
			if (validateField("password", password)) {
				setLoading.open();

				// Simulate API call
				const result = await customerService.resetPassword(
					email,
					password
				);
				toast({
					description: result.message,
					variant: "success",
					duration: 10000,
				});

				login(
					result.data.authToken,
					result.data.customer,
					routes.account.dashboard.path
				);
			}
		} catch (err: any) {
			console.error(err.message);
			setErrors((prevErrors) => ({ ...prevErrors, global: err.message }));
			toast({
				description: err.message,
				variant: "destructive",
				duration: 10000,
			});
		} finally {
			setLoading.close();
		}
	};

	const SectionHeadingProps: SectionHeadingProps = {
		title: "Reset Password",
		description:
			"Lost your password? Please enter your username or email address. You will receive a link to create a new password via email.",
	};

	return (
		<section className="py-20 md:py-40">
			<SectionHeading
				title={SectionHeadingProps.title}
				description={SectionHeadingProps.description}
			/>
			<div className="row">
				<div className="relative w-full md:w-1/2 mx-auto py-4 px-7 flex items-start justify-center gap-4 flex-col">
					<LoadingOverlay
						visible={loading}
						zIndex={10}
						overlayProps={{ radius: "xs", blur: 2 }}
					/>

					{!isEmailSent && !isVerifiedOTP && (
						<>
							<Label
								htmlFor="email"
								className="text-lg cursor-pointer"
							>
								Email<span className="text-skyblue"> *</span>
							</Label>
							<Input
								id="email"
								name="email"
								type="email"
								value={email}
								onChange={handleEmailChange}
								error={!!errors.email}
							/>
							{errors.email && (
								<p className="text-rose-500 font-semibold text-sm">
									{errors.email}
								</p>
							)}
						</>
					)}

					{/* OTP Field */}
					{isEmailSent && timeLeft > 0 && !isVerifiedOTP && (
						<>
							<div className="w-full flex items-center gap-2">
								{otp.map((digit, index) => (
									<Input
										key={index}
										type="text"
										maxLength={1}
										className="w-12 h-12 p-2 text-center text-base truncate rounded-md flex items-center justify-center"
										error={errors.global ? true : false}
										autoFocus={index === 0}
										value={digit}
										onChange={(e: any) =>
											handleOTPFieldChange(
												index,
												e.target.value
											)
										}
										onKeyDown={(e) =>
											handleOTPFieldKeyDown(index, e)
										}
										onPaste={handleOTPFieldPaste}
										id={`otp-input-${index}`}
									/>
								))}
							</div>

							<div className="py-2">
								{timeLeft > 0 ? (
									<p className="text-lg font-semibold">
										Time Remaining: {formatTime(timeLeft)}
									</p>
								) : (
									<p className="text-red-500 font-semibold">
										The OTP has expired. Please request a
										new one.
									</p>
								)}
							</div>
						</>
					)}

					{isEmailSent && isVerifiedOTP && (
						<>
							<Label
								htmlFor="password"
								className="text-lg cursor-pointer"
							>
								Reset Password
								<span className="text-skyblue"> *</span>
							</Label>
							<div className="flex w-full items-center space-x-2 relative">
								<Input
									type={
										showLoginPassword ? "text" : "password"
									}
									name="password"
									id="password"
									placeholder="your password"
									value={password}
									onChange={handlePasswordChange}
									error={errors.password ? true : false}
								/>
								{showLoginPassword ? (
									<EyeClosed
										size={20}
										className="cursor-pointer text-gray absolute right-5"
										onClick={() =>
											setShowLoginPassword(false)
										}
									/>
								) : (
									<Eye
										size={20}
										className="cursor-pointer text-gray absolute right-5"
										onClick={() =>
											setShowLoginPassword(true)
										}
									/>
								)}
							</div>
							{errors.password && (
								<p className="text-rose-500 font-semibold text-sm">
									{errors.password}
								</p>
							)}
						</>
					)}

					{errors.global && (
						<p className="text-rose-500 font-semibold text-sm">
							{errors.global}
						</p>
					)}

					{/* OTP Button */}
					{!isEmailSent && !isVerifiedOTP && (
						<Button onClick={requestResetPassword}>Get OTP</Button>
					)}
					{isEmailSent && timeLeft > 0 && !isVerifiedOTP && (
						<Button onClick={verifyOTP} variant="success">
							Submit OTP
						</Button>
					)}

					{isEmailSent && isVerifiedOTP && (
						<Button onClick={updatePassword}>Reset Password</Button>
					)}
				</div>
			</div>
		</section>
	);
};

export default ResetPassword;
