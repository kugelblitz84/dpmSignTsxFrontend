import * as React from "react";
import { cn } from "@/lib/utils"; // Ensure you have the `cn` utility for merging class names

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	error?: boolean; // Add an `error` prop
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, error, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(
					"py-[1rem] pl-4 border-[0.1rem] border-solid border-neutral-300 hover:border-skyblue focus:border-skyblue text-black rounded-[0.4rem] transition-all duration-300 w-full outline-none flex h-9 bg-transparent text-sm shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:file:text-neutral-50 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300 placeholder:text-sm lg:placeholder:text-sm",
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

Input.displayName = "Input";

export { Input };
