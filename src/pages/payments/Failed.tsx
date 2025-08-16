import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { XOctagon } from "lucide-react";
import routes from "@/routes";
import {
	AlertDialog,
	AlertDialogDescription,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const FailedPayment = () => {
	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
				<div className="bg-white rounded-lg shadow overflow-hidden">
					<div className="p-6 sm:p-10 space-y-8">
						<div className="flex justify-center">
							<div className="rounded-full bg-rose-100 p-3 animate-in zoom-in duration-300">
								<div className="rounded-full bg-rose-200 p-3">
									<div className="rounded-full bg-rose-500 p-3">
										<XOctagon className="h-16 w-16 text-white animate-in fade-in-25 duration-500" />
									</div>
								</div>
							</div>
						</div>

						<div className="text-center space-y-2">
							<h1 className="text-3xl font-bold text-gray-900">
								Payment Failed
							</h1>
							<p className="text-gray-600">
								We were unable to process your payment.
							</p>
							<p className="text-sm text-gray-500">Please try again.</p>
						</div>

						<AlertDialog>
							<AlertDialogTitle>Payment Error</AlertDialogTitle>
							<AlertDialogDescription>
								Your payment could not be processed. Please verify your payment
								details or try a different payment method.
							</AlertDialogDescription>
						</AlertDialog>

						<div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
							<Button asChild variant="outline">
								<Link to={routes.products.path}>Continue Shopping</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FailedPayment;
