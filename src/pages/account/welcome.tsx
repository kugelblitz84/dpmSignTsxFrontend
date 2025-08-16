import { Link } from "react-router-dom";
import routes from "@/routes";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LoadingOverlay } from "@mantine/core";

const Welcome = () => {
	const { customer, logout } = useAuth();

	return (
		<div>
			{customer ? (
				<>
					<p className="py-3 text-base lg:text-lg">
						Hello <span className="font-semibold">{customer?.name}</span> (not{" "}
						<span className="font-semibold">{customer?.name}</span>?
						<Button onClick={logout} variant={"link"}>
							{" "}
							Logout
						</Button>
						)
					</p>
					<p className="py-3 text-base lg:text-lg">
						From your account dashboard you can view your{" "}
						<Link
							to={routes.account.orders.path}
							className="text-skyblue font-manrope"
						>
							recent orders{" "}
						</Link>
						, and{" "}
						<Link
							to={routes.account.accountDetails.path}
							className="text-skyblue font-manrope"
						>
							edit your password and account details.
						</Link>
					</p>
				</>
			) : (
				<>
					<div className="relative">
						<LoadingOverlay
							visible={true}
							zIndex={10}
							overlayProps={{ radius: "sm", blur: 2 }}
						/>
					</div>
				</>
			)}
		</div>
	);
};

export default Welcome;
