import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { cn } from "@/lib/utils";
import { buttonVariants, ButtonVariantsProps } from "@/components/ui/button";

const AlertDialog = AlertDialogPrimitive.Root;

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = AlertDialogPrimitive.Portal;

interface AlertDialogOverlayProps
	extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay> {
	className?: string;
}

const AlertDialogOverlay = React.forwardRef<
	HTMLDivElement,
	AlertDialogOverlayProps
>(({ className, ...props }, ref) => (
	<AlertDialogPrimitive.Overlay
		className={cn(
			"fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
			className
		)}
		{...props}
		ref={ref}
	/>
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

interface AlertDialogContentProps
	extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> {
	className?: string;
}

const AlertDialogContent = React.forwardRef<
	HTMLDivElement,
	AlertDialogContentProps
>(({ className, ...props }, ref) => (
	<AlertDialogPortal>
		<AlertDialogOverlay />
		<AlertDialogPrimitive.Content
			ref={ref}
			className={cn(
				"fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-neutral-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg dark:border-neutral-800 dark:bg-neutral-950",
				className
			)}
			{...props}
		/>
	</AlertDialogPortal>
));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

interface AlertDialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
	className?: string;
}

const AlertDialogHeader: React.FC<AlertDialogHeaderProps> = ({
	className,
	...props
}) => (
	<div
		className={cn(
			"flex flex-col space-y-2 text-center sm:text-left",
			className
		)}
		{...props}
	/>
);
AlertDialogHeader.displayName = "AlertDialogHeader";

interface AlertDialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
	className?: string;
}

const AlertDialogFooter: React.FC<AlertDialogFooterProps> = ({
	className,
	...props
}) => (
	<div
		className={cn(
			"flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
			className
		)}
		{...props}
	/>
);
AlertDialogFooter.displayName = "AlertDialogFooter";

interface AlertDialogTitleProps
	extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title> {
	className?: string;
}

const AlertDialogTitle = React.forwardRef<
	HTMLHeadingElement,
	AlertDialogTitleProps
>(({ className, ...props }, ref) => (
	<AlertDialogPrimitive.Title
		ref={ref}
		className={cn("text-lg font-semibold", className)}
		{...props}
	/>
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

interface AlertDialogDescriptionProps
	extends React.ComponentPropsWithoutRef<
		typeof AlertDialogPrimitive.Description
	> {
	className?: string;
}

const AlertDialogDescription = React.forwardRef<
	HTMLParagraphElement,
	AlertDialogDescriptionProps
>(({ className, ...props }, ref) => (
	<AlertDialogPrimitive.Description
		ref={ref}
		className={cn("text-sm text-neutral-500 dark:text-neutral-400", className)}
		{...props}
	/>
));
AlertDialogDescription.displayName =
	AlertDialogPrimitive.Description.displayName;

interface AlertDialogActionProps
	extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action> {
	className?: string;
	variant?: ButtonVariantsProps["variant"];
}

const AlertDialogAction = React.forwardRef<
	HTMLButtonElement,
	AlertDialogActionProps
>(({ className, variant, ...props }, ref) => (
	<AlertDialogPrimitive.Action
		ref={ref}
		className={cn(buttonVariants({ variant }), className)}
		{...props}
	/>
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

interface AlertDialogCancelProps
	extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel> {
	className?: string;
}

const AlertDialogCancel = React.forwardRef<
	HTMLButtonElement,
	AlertDialogCancelProps
>(({ className, ...props }, ref) => (
	<AlertDialogPrimitive.Cancel
		ref={ref}
		className={cn(
			buttonVariants({ variant: "outline" }),
			"mt-2 sm:mt-0",
			className
		)}
		{...props}
	/>
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

export {
	AlertDialog,
	AlertDialogPortal,
	AlertDialogOverlay,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogAction,
	AlertDialogCancel,
};
