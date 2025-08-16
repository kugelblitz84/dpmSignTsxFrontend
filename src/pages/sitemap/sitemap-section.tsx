import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

// Define the type for a route object
interface Route {
	path: string;
	name: string;
}

interface SitemapSectionProps {
	title: string;
	links: Route[];
}

const SitemapSection = ({ title, links }: SitemapSectionProps) => {
	return (
		<Card className="h-full bg-slate-100/40 backdrop-blur-lg shadow-sm border-gray/50">
			<CardHeader>
				<CardTitle className="text-xl font-semibold">{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<ul className="space-y-2">
					{links.map((link) => (
						<li key={link.path}>
							<Link
								to={link.path}
								className="transition-all duration-300 hover:underline hover:text-skyblue"
							>
								{link.name}
							</Link>
						</li>
					))}
				</ul>
			</CardContent>
		</Card>
	);
};

export default SitemapSection;
