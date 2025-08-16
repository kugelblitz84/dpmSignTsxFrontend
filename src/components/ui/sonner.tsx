import { toast as sonnerToast } from "sonner";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import { cn } from "@/lib/utils"; // Import the `cn` utility

type ToastVariant = "success" | "warning" | "error" | "info";

const buttonVariants = {
	default: "bg-skyblue text-white hover:bg-skyblue/80",
	destructive: "bg-red-500 text-white hover:bg-red-600",
	outline: "border border-gray-300 bg-transparent hover:bg-gray-100",
	success:
		"bg-green-500 text-white hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
};

export const toast = (
	message: string,
	options?: {
		description?: string;
		action?: { label: string; onClick: () => void };
		cancel?: { label: string; onClick: () => void };
		variant?: ToastVariant;
	}
) => {
	const { variant = "info", ...rest } = options || {};

	const variantClasses = {
		success: "group-[.toaster]:bg-green-500 group-[.toaster]:text-white",
		warning: "group-[.toaster]:bg-amber-500 group-[.toaster]:text-black",
		error: "group-[.toaster]:bg-rose-500 group-[.toaster]:text-white",
		info: "group-[.toaster]:bg-skyblue group-[.toaster]:text-white",
	};

	sonnerToast(message, {
		...rest,
		classNames: {
			toast: `${variantClasses[variant]} group-[.toaster]:border-transparent group-[.toaster]:shadow-lg`,
			// description: "group-[.toast]:text-white",
			actionButton: cn(
				"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md group-[.toaster]:text-3xl font-firasans font-medium transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
				buttonVariants.success // Apply the default variant
			),
			cancelButton: cn(
				"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md group-[.toaster]:text-3xl font-firasans font-medium transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
				buttonVariants.destructive // Apply the destructive variant
			),
		},
	});
};

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = "system" } = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			className="toaster group text-4xl"
			duration={60000}
			// pauseWhenPageIsHidden={true}
			toastOptions={{
				classNames: {
					toast: "group toast group-[.toaster]:border-transparent group-[.toaster]:shadow-lg",
					// description: "group-[.toast]:text-white",
					actionButton: cn(
						"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md group-[.toaster]:text-2xl font-firasans font-medium transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
						buttonVariants.success // Apply the default variant
					),
					cancelButton: cn(
						"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md group-[.toaster]:text-2xl font-firasans font-medium transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
						buttonVariants.destructive // Apply the destructive variant
					),
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };
