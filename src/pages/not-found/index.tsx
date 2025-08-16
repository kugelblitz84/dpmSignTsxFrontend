import { Link } from "react-router-dom";
import illustrator from "@/assets/icons/404-illustrator.svg";
import routes from "@/routes";
import { Button } from "@/components/ui/button";

const NotFound: React.FC = () => {
	return (
		<div className="row min-h-[900px] flex items-center justify-center flex-col gap-3">
			<img src={illustrator} className="w-1/3" alt="404" />
			<h3 className="text-3xl font-semibold text-skyblue text-center">
				Your requested content couldn't be found.
			</h3>
			<Link to={routes.home.path}>
				<Button variant="success">Go Back Home</Button>
			</Link>
		</div>
	);
};

export default NotFound;
