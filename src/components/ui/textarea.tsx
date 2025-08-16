import * as React from "react";

import { cn } from "@/lib/utils";

interface TextareaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	error?: boolean; // Add an `error` prop
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, error, ...props }, ref) => {
		return (
			<textarea
				className={cn(
					"flex min-h-[60px] w-full rounded-md border border-neutral-300 hover:border-skyblue bg-transparent px-3 py-2 text-sm placeholder:text-sm shadow-sm placeholder:text-neutral-500 outline-none  disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",
					{
						"border-rose-500": error, // Apply red border when `error` is true
						"focus:border-rose-500": error, // Apply red border on focus when `error` is true
						"text-rose-500": error, // Apply red border on focus when `error` is true
					},
					className
				)}
				ref={ref}
				{...props}
			/>
		);
	}
);
Textarea.displayName = "Textarea";

export { Textarea };
