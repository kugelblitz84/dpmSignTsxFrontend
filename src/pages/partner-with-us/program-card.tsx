import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

export interface Program {
	title: string;
	icon: LucideIcon;
	description: string;
	benefits: string[];
	requirements: string[];
}

interface ProgramCardProps {
	program: Program;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program }) => {
	return (
		<Card className="h-full bg-slate-100/40 backdrop-blur-lg shadow-sm border-gray/50 border rounded-lg">
			<CardHeader>
				<div className="flex items-center gap-4">
					<program.icon size={32} className="text-skyblue" />
					<CardTitle className="text-xl font-semibold">
						{program.title}
					</CardTitle>
				</div>
			</CardHeader>
			<CardContent>
				<p className="text-base font-semibold mb-6">
					{program.description}
				</p>

				<div className="space-y-6">
					<div>
						<h4 className="text-base font-semibold mb-2">
							Key Benefits:
						</h4>
						<ul className="list-disc list-inside space-y-1 pl-4">
							{program.benefits.map((benefit, index) => (
								<li key={index}>{benefit}</li>
							))}
						</ul>
					</div>

					<div>
						<h4 className="text-base font-semibold mb-2">
							Who Can Apply?
						</h4>
						<ul className="list-disc list-inside space-y-1 pl-4">
							{program.requirements.map((requirement, index) => (
								<li key={index}>{requirement}</li>
							))}
						</ul>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default ProgramCard;
