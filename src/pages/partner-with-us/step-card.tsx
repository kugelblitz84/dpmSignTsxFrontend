import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StepCardProps {
	step: number;
	title: string;
	description: string;
}

const StepCard: React.FC<StepCardProps> = ({ step, title, description }) => {
	return (
		<Card className="h-full bg-slate-100/40 backdrop-blur-lg shadow-sm border-gray/50 border rounded-lg">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-lg">
					<span className="flex items-center justify-center w-10 h-10 rounded-full bg-skyblue/10 text-skyblue text-base">
						{step}
					</span>
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="text-base font-semibold">{description}</p>
			</CardContent>
		</Card>
	);
};

export default StepCard;
