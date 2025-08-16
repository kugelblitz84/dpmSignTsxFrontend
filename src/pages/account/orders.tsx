import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import {
	OrderImageProps,
	OrderItemProps,
	OrderProps,
	PaymentProps,
	useOrders,
} from "@/hooks/use-order";
import { LoadingOverlay } from "@mantine/core";
import { currencyCode } from "@/config";
import { formatPrice } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
	CalendarIcon,
	Clock,
	ExternalLink,
	Mail,
	MapPin,
	Package,
	Phone,
	User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import { useAuth } from "@/hooks/use-auth";
import { StaffProps } from "../checkout";
import { staffService } from "@/api";

const Orders = () => {
	const { token, logout } = useAuth();
	const { orders, loading } = useOrders();
	const [staff, setStaff] = useState<StaffProps[]>([]);

	useEffect(() => {
		const fetchStaff = async () => {
			try {
				if (!token) {
					// navigate(routes.products.path);
					return logout();
				}

				const response = await staffService.fetchAllStaff(token);

				setStaff(response.data.staff);
			} catch (err: any) {
				console.log(err.message);
			}
		};
		fetchStaff();
	}, []);

	return (
		<div>
			<Table className="border-collapse min-w-max w-full">
				<TableCaption className="text-base py-4">
					Your recent orders.
				</TableCaption>
				<TableHeader className="text-base">
					<TableRow>
						<TableHead className="bg-skyblue text-white border-[2px] border-white text-center">
							Order ID
						</TableHead>
						<TableHead className="bg-skyblue text-white border-[2px] border-white text-center">
							Order Items
						</TableHead>
						<TableHead className="bg-skyblue text-white border-[2px] border-white text-center">
							Status
						</TableHead>
						<TableHead className="bg-skyblue text-white border-[2px] border-white text-center">
							Date
						</TableHead>
						<TableHead className="bg-skyblue text-white border-[2px] border-white text-center">
							Total
						</TableHead>
						<TableHead className="bg-skyblue text-white border-[2px] border-white text-center">
							Action
						</TableHead>
					</TableRow>
				</TableHeader>

				{loading ? (
					<>
						<LoadingOverlay
							visible={loading}
							zIndex={10}
							overlayProps={{ radius: "xs", blur: 1 }}
						/>
					</>
				) : (
					<TableBody className="text-base">
						{orders.map((order) => (
							<TableRow key={order.orderId}>
								<TableCell className="text-center">{order.orderId}</TableCell>
								<TableCell className="text-start">
									{order.orderItems.length}
								</TableCell>
								<TableCell className="text-center capitalize">
									{order.status.split("-").join(" ")}
								</TableCell>
								<TableCell className="text-center">
									{new Date(order.createdAt).toDateString()}
								</TableCell>
								<TableCell className="text-center">
									{formatPrice(order.orderTotalPrice)}
									{" " + currencyCode}
								</TableCell>
								<TableCell className="underline transition-all duration-300 hover:text-skyblue text-center">
									<Dialog>
										<DialogTrigger>
											<Button variant="link" size="sm">
												View Order
											</Button>
										</DialogTrigger>
										<DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
											<DialogHeader className="flex flex-row items-start justify-between mt-4 mb-2">
												<DialogTitle className="text-2xl font-bold">
													Order #{order.orderId}
												</DialogTitle>
												<div className="flex gap-3 items-start">
													<p className="font-bold">Agent: </p>
													<div className="w-full flex flex-col gap-1 text-right">
														<p className=" text-sm">
															{staff.filter(
																(staffItem) =>
																	staffItem.staffId === order.staffId
															)[0]?.name ?? "Unassigned"}
														</p>
														<p className=" text-sm">
															{staff.filter(
																(staffItem) =>
																	staffItem.staffId === order.staffId
															)[0]?.phone ?? "N/A"}
														</p>
													</div>
												</div>
											</DialogHeader>

											<div className="space-y-6">
												<div className="grid grid-cols-2 gap-4">
													<div className="space-y-2">
														<div className="flex items-center gap-2 ">
															<Clock className="h-4 w-4" />
															<span>Order Date:</span>
															<span className="font-medium text-black">
																{new Date(order.createdAt).toDateString()}
															</span>
														</div>
														<div className="flex items-center gap-2 ">
															<CalendarIcon className="h-4 w-4" />
															<span>Est. Delivery:</span>
															{order.deliveryDate ? (
																<span className="font-medium text-black">
																	{new Date(order.deliveryDate).toDateString()}
																</span>
															) : (
																"N/A"
															)}
														</div>
														<div className="flex items-center gap-2 ">
															<Package className="h-4 w-4" />
															<span>Status:</span>
															<Badge variant={order.status} size="sm">
																{order.status}
															</Badge>
														</div>
													</div>

													<div className="space-y-2">
														<div className="flex items-center gap-2 ">
															<Package className="h-4 w-4" />
															<span>Payment Status:</span>
															<Badge
																variant={
																	order.paymentStatus === "paid"
																		? "success"
																		: order.paymentStatus === "pending"
																		? "destructive"
																		: "default"
																}
																size="sm"
															>
																{order.paymentStatus}
															</Badge>
														</div>
														<div className="flex items-center gap-2 ">
															<Package className="h-4 w-4" />
															<span>Payment Method:</span>
															<span className="font-medium text-black">
																{order.paymentMethod.replace(/-/g, " ")}
															</span>
														</div>

														{/* <div className="flex items-center gap-2 ">
																<Package className="h-4 w-4" />
																<span>Coupon Applied:</span>
																<span className="font-medium text-black">
																	{order.couponId ? (
																		<Badge size="sm" variant="success">
																			{appliedCoupon}
																		</Badge>
																	) : (
																		"N/A"
																	)}
																</span>
															</div> */}
													</div>
												</div>

												<Separator className="bg-neutral-500/30" />

												<div className="space-y-2">
													<h3 className="text-lg font-semibold mb-2">
														Payment Details
													</h3>
													<PaymentSection
														order={order}
														orderTotalCouponCheckedPrice={order.orderTotalPrice}
													/>
												</div>

												<Separator className="bg-neutral-500/30" />

												<div className="space-y-4">
													<h3 className="text-lg font-semibold">
														Customer Information
													</h3>
													<div className="grid grid-cols-2 gap-4">
														<div className="space-y-2">
															<div className="flex items-center gap-2 ">
																<User className="h-4 w-4" />
																<span>Name:</span>
																<span className="font-medium text-black">
																	{order.customerName}
																</span>
															</div>
															<div className="flex items-center gap-2 ">
																<Mail className="h-4 w-4" />
																<span>Email:</span>
																<span className="font-medium text-black">
																	{order.customerEmail}
																</span>
															</div>
															<div className="flex items-center gap-2 ">
																<Phone className="h-4 w-4" />
																<span>Phone:</span>
																<span className="font-medium text-black">
																	{order.customerPhone}
																</span>
															</div>
														</div>
														<div className="space-y-4">
															<div className="flex flex-col gap-2 ">
																<div className="flex items-center gap-2 font-semibold">
																	<MapPin className="h-4 w-4" />
																	<span>Billing Address:</span>
																</div>
																<span className="text-neutral-600">
																	{order.billingAddress}
																</span>
															</div>
															{order.courierAddress && (
																<div className="flex flex-col gap-2 ">
																	<div className="flex items-center gap-2 font-semibold">
																		<MapPin className="h-4 w-4" />
																		<span>Courier Address:</span>
																	</div>
																	<span className="text-neutral-600">
																		{order.courierAddress}
																	</span>
																</div>
															)}
														</div>
													</div>
												</div>

												<Separator className="bg-neutral-500/30" />

												<div className="space-y-4">
													<h3 className="text-lg font-semibold">Order Items</h3>
													<Table>
														<TableBody>
															{order.orderItems.map((item: OrderItemProps) => (
																<TableRow
																	key={item.orderItemId}
																	className="cursor-pointer hover:bg-gray-50"
																>
																	<TableCell>
																		<div className="flex items-center gap-4">
																			<div>
																				<p className="font-semibold truncate">
																					{item.product.name.slice(0, 40)}
																					{item.product.name.length > 40 &&
																						"..."}
																				</p>
																				<div className="text-sm text-gray-500 mt-1">
																					SKU:{" "}
																					<span className="text-skyblue">
																						{item.product.sku}{" "}
																					</span>
																					{item.productVariant.variantDetails.map(
																						(detail: any) => (
																							<span
																								key={
																									detail.productVariantDetailId
																								}
																								className="mr-2"
																							>
																								{
																									detail.variationItem.variation
																										.name
																								}
																								: {detail.variationItem.value}{" "}
																								{
																									detail.variationItem.variation
																										.unit
																								}{" "}
																								{item.widthInch &&
																									item.heightInch && (
																										<span className="text-xs text-neutral-600">
																											{item.widthInch} inch x{" "}
																											{item.heightInch} inch
																										</span>
																									)}
																							</span>
																						)
																					)}
																				</div>
																			</div>
																		</div>
																	</TableCell>
																	<TableCell>
																		Qty: {item.quantity} (
																		{item.quantity > 1 ? "pieces" : "piece"})
																	</TableCell>
																	<TableCell>
																		Size:{" "}
																		{item.size
																			? `${item.size.toLocaleString()} sqfeet.`
																			: "N/A"}
																	</TableCell>
																	<TableCell className="text-right">
																		{Number(item.price).toLocaleString()}
																		{" " + currencyCode}
																	</TableCell>
																</TableRow>
															))}

															<TableRow>
																<TableCell className=""></TableCell>
																<TableCell className=""></TableCell>
																<TableCell>Total Price: </TableCell>
																<TableCell className="text-right">
																	{order.orderTotalPrice.toLocaleString()}
																	{" " + currencyCode}
																</TableCell>
															</TableRow>
														</TableBody>
													</Table>
												</div>

												<Separator className="bg-neutral-500/30" />
												<div className="space-y-2">
													<div className="flex flex-col gap-2 ">
														<div className="flex items-center gap-2 font-semibold">
															<MapPin className="h-4 w-4" />
															<span>Additional Notes:</span>
														</div>
														<span className="text-neutral-600">
															{order.additionalNotes}
														</span>
													</div>
												</div>

												<Separator className="bg-neutral-500/30" />

												<OrderImageSlider images={order.images} />
											</div>

											<DialogFooter className="flex justify-between">
												<div className="w-full flex justify-end gap-4">
													<Link
														to={`/invoice/${order.orderId}`}
														target="_blank"
													>
														<Button size="sm" className="gap-2">
															<ExternalLink />
															View Invoice
														</Button>
													</Link>
												</div>
											</DialogFooter>
										</DialogContent>
									</Dialog>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				)}
			</Table>
		</div>
	);
};

const OrderImageSlider = ({ images }: { images: OrderImageProps[] }) => {
	if (!images.length) return null;

	return (
		<div className="w-full">
			<h3 className="text-lg font-semibold mb-4">Order Images</h3>
			<Carousel className="w-full">
				<CarouselContent>
					{images.map((image, index) => (
						<CarouselItem key={index} className="md:basis-1/4">
							<div className="p-1">
								<div className="rounded-lg overflow-hidden aspect-square">
									<img
										src={image.imageUrl}
										alt={`Order item ${index + 1}`}
										className="w-full h-full object-cover"
									/>
								</div>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
		</div>
	);
};

interface PaymentSectionProps {
	order: OrderProps;
	orderTotalCouponCheckedPrice: number | null;
}

const PaymentSection = ({
	order,
	orderTotalCouponCheckedPrice,
}: PaymentSectionProps) => {
	const suggestedPayment = Math.floor(order.orderTotalPrice * 0.25); // 25% of total amount

	return (
		<div className="bg-gray-50 py-4 rounded-lg">
			<div className="space-y-4">
				<div className="grid gap-4 md:grid-cols-2">
					<div>
						<p className="text-sm mb-1">Total Order Amount</p>
						<p className="font-semibold text-lg">
							{orderTotalCouponCheckedPrice
								? orderTotalCouponCheckedPrice.toLocaleString()
								: "Calculating"}
							{" " + currencyCode}
							{orderTotalCouponCheckedPrice !== order.orderTotalPrice && (
								<span className="text-sm text-neutral-500">
									{" "}
									({order.orderTotalPrice.toLocaleString()}
									{" " + currencyCode})
								</span>
							)}
						</p>
					</div>
					{order.payments.length > 0 ? (
						<div className="flex flex-col gap-2">
							<div>
								<p className="text-sm mb-1">Payment History</p>
								{order.payments.map((payment) => (
									<p key={payment.paymentId} className="text-sm space-y-1">
										<span className="font-semibold text-lg">
											{payment.isPaid
												? `Paid ${payment.amount.toLocaleString()} ${currencyCode} `
												: `Pending ${payment.amount.toLocaleString()} ${currencyCode} `}
										</span>
										at {new Date(payment.createdAt).toDateString()}
									</p>
								))}
							</div>
						</div>
					) : (
						<div>
							<p className="text-sm  mb-1">Suggested Initial Payment (25%)</p>
							<p className="font-semibold text-lg">
								{suggestedPayment.toLocaleString()}
								{" " + currencyCode}
							</p>
						</div>
					)}
				</div>

				{order.paymentMethod === "online-payment" && (
					<>
						{/* STEP 1: Show payment link only if no payment is paid */}
						{order.payments.length > 0 &&
							order.payments.some(
								(payment: PaymentProps) => !payment.isPaid
							) && (
								<div className="space-y-1">
									<p className="text-sm mb-1">
										You has not paid yet. Copy the link below and complete the
										payment.
									</p>

									<Link
										to={
											order.payments.filter(
												(payment) => !payment.isPaid && payment.paymentLink
											)[0].paymentLink as any
										}
										target="_blank"
									>
										<Button size="sm" variant="success">
											<ExternalLink />
											Complete Payment
										</Button>
									</Link>
								</div>
							)}
					</>
				)}
			</div>
		</div>
	);
};

export default Orders;
