import { useIsMobile } from "@/hooks/use-mobile";
import { ProcessItem } from "@/pages/services/our-process"; // Import the ProcessItem interface

interface ProcessStepsProps {
	processItems: ProcessItem[];
}

const ProcessSteps: React.FC<ProcessStepsProps> = ({ processItems }) => {
	const isMobile = useIsMobile();

	return (
		<div className="py-20 px-5 grid grid-cols-1 grid-rows-6 xl:grid-cols-6 xl:grid-rows-1 h-auto overflow-hidden">
			{processItems.map((item, index) => (
				<div key={item.id} className="w-full relative h-[100px]">
					<div className="w-full h-full relative flex items-start xl:items-center justify-start xl:justify-center">
						<div className="w-[40px] h-[40px] text-base xl:w-16 xl:h-16 rounded-full flex items-center justify-center border-[3px] border-skyblue bg-skyblue text-white">
							<item.icon size={isMobile ? 20 : 25} />
						</div>

						{index < processItems.length - 1 && (
							<div
								className={
									"absolute top-0 xl:top-1/2 xl:-translate-y-1/2 left-[18px] xl:left-0 xl:translate-x-1/2 w-1 xl:w-full h-[100%] xl:h-1 bg-skyblue -z-10"
								}
							></div>
						)}
					</div>

					<div className="w-full absolute -top-1 left-16 xl:left-1/2 xl:-translate-x-1/2 xl:top-full text-left xl:text-center text-sm space-y-2 pr-10 xl:pr-0">
						<h6 className="text-lg xl:text-xl font-semibold">
							{item.title}
						</h6>
						<h6 className="text-base text-gray">
							{item.description}
						</h6>
					</div>
				</div>
			))}
		</div>
	);
};

export default ProcessSteps;
