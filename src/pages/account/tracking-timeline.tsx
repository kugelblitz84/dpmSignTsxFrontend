import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Define the type for a step
interface Step {
	id: number;
	name: string;
	completed: boolean;
}

const TrackingTimeline = () => {
	const steps: Step[] = [
		{ id: 1, name: "Order Request Received", completed: true },
		{ id: 2, name: "Order Confirmed", completed: true },
		{ id: 3, name: "Processing", completed: true },
		{ id: 4, name: "Ready for Delivery", completed: false },
		{ id: 5, name: "Delivered", completed: false },
		{ id: 6, name: "Returned", completed: false },
	];

	return (
		<div className="py-20 px-5 grid grid-cols-1 grid-rows-6 md:grid-cols-6 md:grid-rows-1 h-auto overflow-hidden">
			{steps.map((step, index) => (
				<div key={step.id} className="w-full relative h-[100px]">
					<div className="w-full h-full relative flex items-start md:items-center justify-start md:justify-center">
						<div
							className={cn(
								"w-[40px] h-[40px] text-base md:w-10 md:h-10 rounded-full flex items-center justify-center border-[3px]",
								step.completed
									? "border-skyblue bg-skyblue text-white"
									: "border-skyblue/30 bg-white text-skyblue/60"
							)}
						>
							{step.completed ? (
								<Check size={25} />
							) : (
								<X size={25} />
							)}
						</div>

						{index < steps.length - 1 && (
							<div
								className={
									step.completed && steps[index + 1].completed
										? "absolute top-0 md:top-1/2 md:-translate-y-1/2 left-[18px] md:left-0 md:translate-x-1/2 w-1 md:w-full h-[100%] md:h-1 bg-skyblue -z-10"
										: "absolute top-0 md:top-1/2 md:-translate-y-1/2 left-[18px] md:left-0 md:translate-x-1/2 w-1 md:w-full h-[100%] md:h-1 bg-skyblue/30 -z-10"
								}
							></div>
						)}
					</div>
					<div className="w-full absolute -top-1 left-16 md:left-1/2 md:-translate-x-1/2 md:top-full text-left md:text-center text-sm">
						<h6 className="text-lg">{step.name}</h6>
						<h6 className="text-base text-gray">
							Saturday, 31 January
						</h6>
					</div>
				</div>
			))}
		</div>
	);
};

export default TrackingTimeline;
