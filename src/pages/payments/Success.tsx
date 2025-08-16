import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import routes from "@/routes";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { currencyCode } from "@/config";

interface Transaction {
	id: number;
	transactionId: string;
	orderId: number;
	valId: string;
	amount: string;
	storeAmount: string;
	cardType: string;
	bankTransactionId: string;
	status: string;
	transactionDate: string;
	currency: string;
	cardIssuer: string;
	cardBrand: string;
	updatedAt: string;
	createdAt: string;
}

const SuccessPayment = () => {
	const navigate = useNavigate();
	const { search } = useLocation();
	const [transaction, setTransaction] = useState<Transaction | null>(null);
	const params = new URLSearchParams(search);

	useEffect(() => {
		try {
			setTransaction(JSON.parse(params.get("transaction") as any));
		} catch (error) {
			navigate(routes.home.path);
		}
	}, []);

	const orderData = transaction
		? {
				orderId: `ORD-${transaction.orderId}`,
				date: new Date(transaction.transactionDate).toLocaleDateString(),
				paymentMethod: `${transaction.cardBrand} (${transaction.cardIssuer})`,
				transactionId: transaction.transactionId,
				bankTransactionId: transaction.bankTransactionId,
				items: [
					{
						name: "Order Total",
						quantity: 1,
						price: parseFloat(transaction.amount),
					},
				],
				subtotal: parseFloat(transaction.amount),
				shipping: 0, // Shipping could be calculated elsewhere if needed
				total: parseFloat(transaction.amount),
				currency: transaction.currency,
		  }
		: null;

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
				<div className="bg-white rounded-lg shadow overflow-hidden">
					<div className="p-6 sm:p-10 space-y-8">
						{/* success animation */}
						<div className="flex justify-center mb-6">
							<div className="rounded-full bg-green-100 p-3 animate-in zoom-in duration-300">
								<div className="rounded-full bg-green-200 p-3">
									<div className="rounded-full bg-green-500 p-3">
										<Check className="h-8 w-8 text-white animate-in fade-in-25 duration-500" />
									</div>
								</div>
							</div>
						</div>
						<div className="text-center space-y-2">
							<h1 className="text-3xl font-bold text-gray-900">
								Payment Successful!
							</h1>
							<p className="text-gray-600">
								Thank you for your order. Your payment has been processed
								successfully.
							</p>
							<p className="text-sm text-gray-500">
								A confirmation email has been sent to your email address with
								your order details.
							</p>
						</div>

						{orderData && (
							<Card className="w-full shadow-sm">
								<CardHeader>
									<CardTitle className="text-xl">Order Summary</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="grid grid-cols-2 text-sm">
											<p className="text-muted-foreground">Order ID</p>
											<p className="font-medium text-right">
												{orderData.orderId}
											</p>
											<p className="text-muted-foreground">Date</p>
											<p className="font-medium text-right">{orderData.date}</p>
											<p className="text-muted-foreground">Payment Method</p>
											<p className="font-medium text-right">
												{orderData.paymentMethod}
											</p>
										</div>

										<Separator className="bg-neutral-500/30" />

										<div className="space-y-2">
											{orderData.items.map((item, index) => (
												<div
													key={index}
													className="flex justify-between text-sm"
												>
													<span>
														{item.name}{" "}
														<span className="text-muted-foreground">
															×{item.quantity}
														</span>
													</span>
													<span>{item.price * item.quantity}</span>
												</div>
											))}
										</div>

										<Separator className="bg-neutral-500/30" />

										<div className="space-y-1 text-sm">
											<div className="flex justify-between">
												<span className="text-muted-foreground">Subtotal</span>
												<span>
													{orderData.subtotal.toLocaleString() +
														" " +
														currencyCode}
												</span>
											</div>
											<div className="flex justify-between">
												<span className="text-muted-foreground">Shipping</span>
												<span>
													{orderData.shipping.toLocaleString() +
														" " +
														currencyCode}
												</span>
											</div>
											<div className="flex justify-between font-medium text-base pt-2">
												<span>Total</span>
												<span>
													{orderData.total.toLocaleString() +
														" " +
														currencyCode}
												</span>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						)}

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

export default SuccessPayment;
