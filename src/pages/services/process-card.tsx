import { ProcessItem } from "@/pages/services/our-process"; // Import the ProcessItem interface
import { cn } from "@/lib/utils";

interface ProcessCardProps {
	index: number;
	processItem: ProcessItem;
}

const ProcessCard: React.FC<ProcessCardProps> = ({ index, processItem }) => {
	return (
		<div
			id={`process-card-${index}`}
			className={cn(
				"min-w-[300px] md:min-w-[500px] w-full flex items-start justify-around flex-col gap-4 h-full backdrop-blur-lg shadow-sm rounded-lg p-6 transform transition-all duration-300",
				index === 1
					? "bg-skyblue/90 text-white"
					: index === 2
					? "bg-darkblue/90 text-white"
					: index === 3
					? "bg-purple-500/90 text-white"
					: index === 4
					? "bg-indigo-500/90 text-white"
					: index === 5
					? "bg-violet-500/90 text-white"
					: "bg-sky-500/90 text-white"
			)}
		>
			<processItem.icon size={30} />
			<h4 className="text-xl font-semibold">{processItem.title}</h4>
			<p className="text-sm font-semibold">{processItem.description}</p>
		</div>
	);
};

export default ProcessCard;
