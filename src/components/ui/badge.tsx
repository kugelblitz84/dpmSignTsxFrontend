import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"inline-flex items-center border rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2",
	{
		variants: {
			variant: {
				default: "border-skyblue bg-skyblue/10 text-skyblue",
				secondary: "border-darkblue bg-darkblue/10 text-darkblue",
				success: "border-green-500 bg-green-500/10 text-green-500",
				destructive: "border-rose-500 bg-rose-500/10 text-rose-500",
				outline: "text-skyblue",

				"order-request-received": "border-purple bg-purple-100 text-purple-600",
				"consultation-in-progress":
					"border-indigo bg-indigo-100 text-indigo-600",
				"order-canceled": "border-rose bg-rose-100   text-rose-600",
				"awaiting-advance-payment": "border-yellow bg-yellow/10 text-yellow",
				"advance-payment-received": "border-green bg-green-100  text-green-600",
				"design-in-progress": "border-pink bg-pink-100   text-pink-600",
				"awaiting-design-approval": "border-teal bg-teal-100   text-teal-600",
				"production-started": "border-orange bg-orange-100 text-orange-600",
				"production-in-progress": "border-cyan bg-cyan-100   text-cyan-600",
				"ready-for-delivery": "border-blue bg-blue-100   text-blue-600",
				"out-for-delivery": "border-lime bg-lime-100   text-lime-600",
				"order-completed": "border-emerald bg-emerald-100 text-emerald-600",
			},
			size: {
				default: "px-6 py-1 text-sm xl:text-sm font-medium",
				sm: "py-[0.3rem] px-2 text-xs font-medium",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
);

interface BadgeProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {
	className?: string;
}

const Badge = ({ className, variant, size, ...props }: BadgeProps) => {
	return (
		<div
			className={cn(badgeVariants({ variant, size }), className)}
			{...props}
		/>
	);
};

export { Badge, badgeVariants };
