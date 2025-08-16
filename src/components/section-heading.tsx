import { cn } from "@/lib/utils";

// Define the type for the section heading props
export interface SectionHeadingProps {
	title: string;
	description?: string;
	variant?: "black" | "white";
}

const SectionHeading = ({
	title,
	description,
	variant = "black",
}: SectionHeadingProps) => {
	return (
		<>
			{variant === "black" && (
				<div className="row flex items-center justify-center flex-col gap-4 py-5">
					<h2 className="w-full text-center text-3xl lg:text-4xl font-semibold relative py-5 after:content-[''] after:absolute after:w-20 after:h-[0.3rem] after:rounded-full after:bg-skyblue after:left-[50%] after:-translate-x-1/2 after:-bottom-1 after:transition-all after:duration-300">
						{title}
					</h2>
					<p
						className={cn(
							"text-base lg:text-lg font-semibold lg:w-[65%]",
							description && description.toString().length > 150
								? "text-justify"
								: "text-center"
						)}
					>
						{description}
					</p>
				</div>
			)}
			{variant === "white" && (
				<div className="row flex items-center justify-center flex-col gap-4 py-5 text-white">
					<h2 className="w-full text-center text-3xl lg:text-4xl font-semibold relative py-5 after:bg-white after:content-[''] after:absolute after:w-20 after:h-[0.3rem] after:rounded-full after:left-[50%] after:-translate-x-1/2 after:-bottom-1 after:transition-all after:duration-300">
						{title}
					</h2>
					<p
						className={cn(
							"text-base lg:text-lg font-semibold lg:w-[65%]",
							description && description.toString().length > 150
								? "text-justify"
								: "text-center"
						)}
					>
						{description}
					</p>
				</div>
			)}
		</>
	);
};

export default SectionHeading;
