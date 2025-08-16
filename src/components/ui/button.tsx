import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export interface ButtonVariantsProps {
	variant?:
		| "default"
		| "destructive"
		| "alert"
		| "outline"
		| "secondary"
		| "success"
		| "greenlight"
		| "transparent"
		| "ghost"
		| "link";
}

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-lg font-firasans font-medium transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default: "bg-skyblue text-neutral-50 shadow hover:bg-skyblue/80",
				destructive:
					"bg-rose-500 text-neutral-50 shadow-sm hover:bg-rose-500/80",
				alert:
					"bg-rose-500/10 text-rose-500 border-[2px] border-rose-500/40 shadow-sm hover:bg-rose-500/20",
				outline:
					"border border-neutral-200 bg-white shadow-sm hover:bg-neutral-100 hover:text-neutral-900",
				secondary: "bg-darkblue text-neutral-50 shadow-sm hover:bg-darkblue/80",
				success: "bg-green-500 text-neutral-50 shadow-sm hover:bg-green-500/90",
				greenlight:
					"bg-green-500/10 text-green-500 border-[2px] border-green-500/40 shadow-sm hover:bg-green-500/20",
				transparent:
					"bg-skyblue/10 text-skyblue border-[2px] border-skyblue/40 shadow-sm hover:bg-skyblue/20",
				ghost: "hover:bg-neutral-100 hover:text-neutral-900",
				link: "text-neutral-900 underline-offset-4 underline hover:text-skyblue",
			},
			size: {
				default: "h-10 px-5 py-5",
				sm: "h-9 rounded-md px-3 text-sm",
				xs: "w-7 min-w-max h-7 rounded-md px-2 text-xs",
				lg: "h-14 rounded-md px-10",
				icon: "h-9 w-9",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	}
);
Button.displayName = "Button";

export { Button, buttonVariants };
