import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Printer, Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { currencyCode } from "@/config";
import { OrderItemProps, OrderProps, useOrders } from "@/hooks/use-order";
import { Button } from "@/components/ui/button";
import Preloader from "@/components/common/preloader";
import { useAuth } from "@/hooks/use-auth";
import { courierService, staffService } from "@/api";
import type { StaffProps } from "@/pages/checkout";

interface CourierProps { courierId: number; name: string }

const Invoice = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders } = useOrders();
  const { token } = useAuth();

  const [order, setOrder] = useState<OrderProps | null>(null);
  const [staff, setStaff] = useState<StaffProps[]>([]);
  const [couriers, setCouriers] = useState<CourierProps[]>([]);
  const printRef = useRef<HTMLDivElement | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    if (orders.length === 0) return;
    const found = orders.find((o) => o.orderId === Number(orderId)) || null;
    if (!found) {
      navigate("/account/orders");
      return;
    }
    setOrder(found);
  }, [orderId, orders, navigate]);

  useEffect(() => {
    const fetchAux = async () => {
      try {
        if (!token) return;
        const [s, c] = await Promise.all([
          staffService.fetchAllStaff(token),
          courierService.fetchAllCourier(token),
        ]);
        setStaff((s.data?.staff || []).filter((x: StaffProps) => !x.isDeleted));
        setCouriers(c.data?.couriers || []);
      } catch {
        // non-blocking
      }
    };
    fetchAux();
  }, [token]);

  const invoiceData = useMemo(() => {
    if (!order) return null;
    const agentInfo = staff.find((s) => s.staffId === order.staffId);

    const subTotal = order.orderItems.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    const grandTotal = order.orderTotalPrice;
    const discountAmount = Math.max(0, subTotal - grandTotal);

    const totalPaidAmount = order.payments
      .filter((p) => p.isPaid)
      .reduce((acc, p) => acc + p.amount, 0);
    const amountDue = Math.max(0, grandTotal - totalPaidAmount);

    const designCharge = agentInfo?.role === "designer" ? agentInfo.designCharge || 0 : 0;
    const installationCharge = 1148;

    return {
      order,
      agentInfo,
      subTotal,
      discountAmount,
      designCharge,
      installationCharge,
      grandTotal,
      amountDue,
    };
  }, [order, staff]);

  const handlePrint = () => {
    if (!printRef.current) return;
    setTimeout(() => window.print(), 50);
  };

  const handleDownloadPdf = async () => {
    if (!printRef.current || downloading) return;
    try {
      setDownloading(true);
      // Slight delay to ensure fonts/images are rendered
      await new Promise((r) => setTimeout(r, 50));

      const element = printRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        // Ensure images & fonts are captured
        logging: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");

      // Create A4 PDF in portrait (mm)
      const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Scale the image to full page width; compute corresponding height
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight; // shift up to show next section
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");
        heightLeft -= pageHeight;
      }

      const fileName = `Invoice-DPM-${orderId}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      // Non-blocking: fall back to print dialog if PDF fails
      try { handlePrint(); } catch {}
    } finally {
      setDownloading(false);
    }
  };

  if (!invoiceData) return <Preloader />;

  const { order: currentOrder, agentInfo, subTotal, discountAmount, designCharge, installationCharge, grandTotal, amountDue } = invoiceData;

  const courierName = currentOrder.courierId
    ? couriers.find((c) => c.courierId === currentOrder.courierId)?.name || "N/A"
    : null;

  return (
    <div className="w-full h-full flex flex-col gap-10 pt-5">
      <div className="w-full flex items-center justify-center gap-4 mb-4 print:hidden">
        <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2">
          <Printer className="h-4 w-4" />
          Print Invoice
        </Button>
        <Button onClick={handleDownloadPdf} disabled={downloading} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          {downloading ? "Generating PDF..." : "Download PDF"}
        </Button>
      </div>

      <div ref={printRef} className="w-[900px] h-auto min-h-screen mx-auto pt-1 print:break-after-avoid-page bg-white p-6 font-sans text-black">
        <div id="printHeader" className="w-full flex items-center justify-between gap-2 px-3 pb-4 border-b-2 border-gray-300">
          <div className="flex items-start justify-start gap-4">
            <div className="flex items-center justify-center">
              <img src="/icon.svg" alt="icon" className="max-w-[70px]" />
            </div>
            <div className="flex flex-col items-start gap-1">
              <h1 className="text-3xl tracking-wider font-bold text-red-600">Dhaka Plastic & Metal</h1>
              <span className="text-sm text-gray-700">Your Trusted Business Partner for Branding Solutions.</span>
              <span className="text-sm text-gray-700">
                <a href="mailto:info@dpmsign.com" target="_blank" className="text-blue-600 hover:underline" rel="noreferrer">
                  info@dpmsign.com
                </a>{" "}
                |{" "}
                <a href="https://www.dpmsign.com" target="_blank" className="text-blue-600 hover:underline" rel="noreferrer">
                  www.dpmsign.com
                </a>
              </span>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <h2 className="text-[#3871C2] text-3xl font-semibold">INVOICE</h2>
            <p className="font-bold text-xl">DPM-{currentOrder.orderId}</p>
            <p className="text-sm mt-2 text-gray-700">Order Date: {new Date(currentOrder.createdAt).toLocaleDateString("en-GB")}</p>
            <p className="text-sm text-gray-700">
              Delivery Date: {currentOrder.deliveryDate ? new Date(currentOrder.deliveryDate).toLocaleDateString("en-GB") : "N/A"}
            </p>
          </div>
        </div>

        <div id="printContent" className="h-max min-h-full py-6">
          <div className="w-full h-[180px] mb-6 flex font-medium">
            <div className="flex-1 pt-4 px-4">
              <h3 className="text-base font-bold pb-2 text-gray-800">Billing Information:</h3>
              <p className="text-sm text-gray-700">Name: {currentOrder.customerName}</p>
              <p className="text-sm text-gray-700">Email: {currentOrder.customerEmail || "N/A"}</p>
              <p className="text-sm text-gray-700">Phone: {currentOrder.customerPhone}</p>
              <p className="text-sm text-gray-700">Address: {currentOrder.billingAddress}</p>
            </div>
            <div className="flex-1 pt-4 px-4">
              <h3 className="text-base font-bold pb-2 text-gray-800">Shipping Information:</h3>
              <p className="text-sm text-gray-700">Shipping Method: {currentOrder.deliveryMethod === "courier" ? "Courier" : "Shop Pickup"}</p>
              {currentOrder.courierAddress && currentOrder.courierId && (
                <>
                  <p className="text-sm text-gray-700">Preferred Courier: {courierName}</p>
                  <p className="text-sm text-gray-700">Courier Address: {currentOrder.courierAddress || "N/A"}</p>
                </>
              )}
            </div>
          </div>

          <div className="w-full h-auto mb-6">
            <h3 className="text-base font-bold mb-2 text-gray-800">Order Details</h3>
            <table className="w-full table-auto border-collapse text-sm">
              <thead>
                <tr className="bg-[#3871C2] text-white">
                  <th className="border border-blue-700 p-2 text-center w-[5%]">NO</th>
                  <th className="border border-blue-700 p-2 text-left w-[40%]">DESCRIPTION</th>
                  <th className="border border-blue-700 p-2 text-center w-[15%]">QTY/SQ. FT.</th>
                  <th className="border border-blue-700 p-2 text-center w-[20%]">PRICE</th>
                  <th className="border border-blue-700 p-2 text-center w-[20%]">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {currentOrder.orderItems.map((orderItem: OrderItemProps, index: number) => (
                  <tr key={orderItem.orderItemId} className={index % 2 === 0 ? "bg-white" : "bg-blue-100"}>
                    <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                    <td className="border border-gray-300 p-2 whitespace-normal break-words">
                      <span className="font-semibold">{orderItem?.product?.name}</span>
                      <br />
                      <span className="text-xs text-gray-600">
                        {orderItem?.productVariant?.variantDetails.map((detail: any) => (
                          <span key={detail.productVariantDetailId} className="mr-2">
                            {detail.variationItem.variation.name}: {detail.variationItem.value} {detail.variationItem.variation.unit}
                          </span>
                        ))}{" "}
                        {orderItem.widthInch && orderItem.heightInch && (
                          <span className="text-xs text-gray-600">({orderItem.widthInch} inch x {orderItem.heightInch} inch)</span>
                        )}
                      </span>
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {orderItem.quantity} {orderItem.quantity > 1 ? "pieces" : "piece"}
                      {orderItem.size ? ` (${orderItem.size.toLocaleString()} sq.ft)` : ""}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">{Number(orderItem.price).toLocaleString()} {currencyCode}</td>
                    <td className="border border-gray-300 p-2 text-center">{(Number(orderItem.price) * orderItem.quantity).toLocaleString()} {currencyCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="w-full flex justify-end mb-6">
            <table className="w-1/3 table-auto border-collapse text-sm">
              <tbody>
                <tr className="bg-gray-50">
                  <td className="px-2 text-right font-bold">Sub Total:</td>
                  <td className="px-2 text-right">{subTotal.toLocaleString()} {currencyCode}</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-2 text-right font-bold">Design Charge:</td>
                  <td className="px-2 text-right">{designCharge.toLocaleString()} {currencyCode}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-2 text-right font-bold">Installation Charge:</td>
                  <td className="px-2 text-right">{installationCharge.toLocaleString()} {currencyCode}</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-2 text-right font-bold">Discount:</td>
                  <td className="px-2 text-right">{discountAmount.toLocaleString()} {currencyCode}</td>
                </tr>
                <tr className="bg-[#3871C2] text-white font-bold text-lg">
                  <td className="border border-blue-700 px-2 text-right">GRAND TOTAL:</td>
                  <td className="border border-blue-700 px-2 text-right">{grandTotal.toLocaleString()} {currencyCode}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {currentOrder.payments.filter((p) => p.isPaid).length > 0 && (
            <div className="w-full h-auto mb-6">
              <h3 className="text-base font-bold mb-2 text-gray-800">Payment Details</h3>
              <table className="w-full table-auto border-collapse text-sm">
                <thead>
                  <tr className="bg-[#3871C2] text-white">
                    <th className="border border-blue-700 p-2 text-left w-1/3">Payment Method</th>
                    <th className="border border-blue-700 p-2 text-right w-1/3">Amount Paid</th>
                    <th className="border border-blue-700 p-2 text-right w-1/3">Amount Due</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrder.payments.filter((p) => p.isPaid).map((payment) => (
                    <tr key={payment.paymentId} className="bg-gray-50">
                      <td className="border border-gray-300 p-2 text-left">{payment.paymentMethod.split("-").join(" ")}</td>
                      <td className="border border-gray-300 p-2 text-right">{payment.amount.toLocaleString()} {currencyCode}</td>
                      <td className="border border-gray-300 p-2 text-right">{amountDue.toLocaleString()} {currencyCode}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-4 font-semibold text-xs italic text-gray-700">NB: Delivery charges are the customer’s responsibility (if applicable).</p>
            </div>
          )}

          <div className="w-full h-auto min-h-min flex justify-between mt-16 text-center pb-4">
            <div>
              <p className="text-sm font-semibold text-gray-800">Thank you for choosing Dhaka Plastic & Metal!</p>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-sm font-semibold text-gray-800">{agentInfo?.name ?? ""}</p>
              <p className="text-sm text-gray-700">{agentInfo?.phone ?? ""}</p>
              <p className="text-sm font-semibold text-gray-800 border-t border-gray-500 mt-2 pt-1">Authorized Signature</p>
              <p className="text-sm font-semibold text-gray-800">For Dhaka Plastic & Metal</p>
            </div>
          </div>

          <div id="printFooter" className="bg-white text-xs text-black w-full py-3 px-4 border-t border-gray-300">
            <div className="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0">
              <div className="flex items-center gap-1">
                <span>+8801919960198 <br /> +8801858253961</span>
              </div>
              <div className="flex items-center gap-1">
                <span>info@dpmsign.com</span>
              </div>
              <div className="flex items-center gap-1 text-center md:text-left flex-wrap">
                <span>Shop No: 94 & 142, Dhaka University  <br /> Market, Katabon Road, Dhaka-1000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
