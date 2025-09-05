import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
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
  const { orders } = useOrders();
  const { token } = useAuth();

  const [order, setOrder] = useState<OrderProps | null>(null);
  const [staff, setStaff] = useState<StaffProps[]>([]);
  const [couriers, setCouriers] = useState<CourierProps[]>([]);
  const printRef = useRef<HTMLDivElement | null>(null);
  const [downloading, setDownloading] = useState(false);

  const handlePrint = () => {
    if (!printRef.current) return;
    setTimeout(() => window.print(), 50);
  };

  // Fetch support data (staff, couriers) for labels and charges
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [staffRes, courierRes] = await Promise.all([
          token ? staffService.fetchAllStaff(token) : staffService.fetchAllStaffPublic(),
          token ? courierService.fetchAllCourier(token) : courierService.fetchAllCourierPublic(),
        ]);
        setStaff((staffRes?.data?.staff || []).filter((s: StaffProps) => !s.isDeleted));
        setCouriers(courierRes?.data?.couriers || []);
      } catch (e) {
        // non-blocking
        console.log("invoice fetchAll failed", e);
      }
    };
    fetchAll();
  }, [token]);

  // Select the current order from context by route param
  useEffect(() => {
    const found = orders.find((o) => String(o.orderId) === String(orderId));
    setOrder(found || null);
  }, [orders, orderId]);

  // Compute totals and agent info
  const invoiceData = useMemo(() => {
    if (!order) return null;
    const agentInfo = staff.find((s) => s.staffId === order.staffId) || null;
    const subTotal = (order.orderItems || []).reduce(
      (sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 0),
      0
    );
    const discountAmount = 0;
    const designCharge = Number(agentInfo?.designCharge ?? 0);
    const installationCharge = 0;
    const paidTotal = (order.payments || [])
      .filter((p) => p.isPaid)
      .reduce((a, p) => a + Number(p.amount || 0), 0);
    const grandTotal = subTotal + designCharge + installationCharge - discountAmount;
    const amountDue = Math.max(0, grandTotal - paidTotal);
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

  const handleDownloadPdf = async () => {
    if (!printRef.current || downloading) return;
    // Keep handles outside try so we can restore in finally
    const element = printRef.current;
    const prevStyle = {
      width: element.style.width,
      minHeight: element.style.minHeight,
      height: element.style.height,
      paddingBottom: element.style.paddingBottom,
      paddingTop: element.style.paddingTop,
      marginTop: element.style.marginTop,
      marginBottom: element.style.marginBottom,
    } as const;
    const hadMinHScreenClass = element.classList.contains("min-h-screen");
    const contentEl = document.getElementById("printContent") as HTMLElement | null;
  const contentPrev = contentEl
      ? {
          minHeight: contentEl.style.minHeight,
          height: contentEl.style.height,
          paddingBottom: contentEl.style.paddingBottom,
      display: contentEl.style.display,
      flexDirection: (contentEl as HTMLElement).style.flexDirection,
          marginTop: contentEl.style.marginTop,
          marginBottom: contentEl.style.marginBottom,
        }
      : null;
    const hadMinHFullClass = contentEl?.classList.contains("min-h-full");
  const totalsTable = document.getElementById("totalsTable") as HTMLTableElement | null;
  const prevTableLayout = totalsTable?.style.tableLayout ?? "";
  const prevTableWidth = totalsTable?.style.width ?? "";
  const grandRowCells = totalsTable?.rows?.[totalsTable.rows.length - 1]?.cells;
  const prevGrandLeftWS = grandRowCells?.[0]?.style.whiteSpace ?? "";
  const prevGrandRightWS = grandRowCells?.[1]?.style.whiteSpace ?? "";
    try {
      setDownloading(true);
      // slight delay for fonts/images
      await new Promise((r) => setTimeout(r, 20));

  // Prepare PDF page metrics early (used to size content before capture)
  const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const topMargin = 4; // mm small safety margin to keep header near top
  const bottomMargin = 6; // mm safety margin
  const safeHeight = Math.max(10, pageHeight - topMargin - bottomMargin);

      // Normalize layout for pdf capture
      if (hadMinHScreenClass) element.classList.remove("min-h-screen");
  // Keep current width; do not force a fixed px width so totals box width matches preview
      element.style.minHeight = "auto";
      element.style.height = "auto";
  element.style.paddingBottom = "0px";
  element.style.paddingTop = "0px";
      element.style.marginTop = "0px";
      element.style.marginBottom = "0px";

      if (contentEl) {
        if (hadMinHFullClass) contentEl.classList.remove("min-h-full");
        // Enforce a safe height equal to A4 minus margins to keep footer at bottom
        contentEl.style.minHeight = `${safeHeight * 3.7795}px`; // mm -> px approx at 96dpi
        contentEl.style.height = `${safeHeight * 3.7795}px`;
        contentEl.style.display = "flex";
        (contentEl as HTMLElement).style.flexDirection = "column";
        contentEl.style.paddingBottom = "0px";
        contentEl.style.marginTop = "0px";
        contentEl.style.marginBottom = "0px";
      }

      if (totalsTable) {
        totalsTable.style.tableLayout = "fixed"; // improve column alignment
        // Lock to current rendered width so PDF matches preview
        const currentWidth = totalsTable.offsetWidth;
        if (currentWidth > 0) totalsTable.style.width = `${currentWidth}px`;
        if (grandRowCells && grandRowCells.length >= 2) {
          grandRowCells[0].style.whiteSpace = "nowrap";
          grandRowCells[1].style.whiteSpace = "nowrap";
        }
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        scrollY: -window.scrollY,
      });

      const imgData = canvas.toDataURL("image/png");

  // PDF already prepared above; use computed page metrics

      // Calculate image size (mm) for full width
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // If the capture would span multiple pages, scale it down to fit within safe height
      let drawWidth = imgWidth;
      let drawHeight = imgHeight;
      if (imgHeight > safeHeight) {
        const scale = safeHeight / imgHeight;
        drawWidth = imgWidth * scale;
        drawHeight = imgHeight * scale;
      }

  // Center horizontally and top-align vertically within safe area
      const xOffset = (pageWidth - drawWidth) / 2;
  const yOffset = topMargin;
      pdf.addImage(imgData, "PNG", xOffset, yOffset, drawWidth, drawHeight, undefined, "FAST");

      const fileName = `Invoice-DPM-${orderId}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      // Non-blocking: fall back to print dialog if PDF fails
      try { handlePrint(); } catch {}
    } finally {
      // restore
      if (printRef.current) {
        const el = printRef.current;
        el.style.width = prevStyle.width;
        el.style.minHeight = prevStyle.minHeight;
        el.style.height = prevStyle.height;
        el.style.paddingBottom = prevStyle.paddingBottom;
  el.style.paddingTop = prevStyle.paddingTop;
        el.style.marginTop = prevStyle.marginTop;
        el.style.marginBottom = prevStyle.marginBottom;
        if (hadMinHScreenClass) el.classList.add("min-h-screen");
      }
      if (contentEl && contentPrev) {
        contentEl.style.minHeight = contentPrev.minHeight;
        contentEl.style.height = contentPrev.height;
        contentEl.style.paddingBottom = contentPrev.paddingBottom;
        contentEl.style.display = contentPrev.display;
        (contentEl as HTMLElement).style.flexDirection = contentPrev.flexDirection;
        contentEl.style.marginTop = contentPrev.marginTop;
        contentEl.style.marginBottom = contentPrev.marginBottom;
        if (hadMinHFullClass) contentEl.classList.add("min-h-full");
      }
      if (totalsTable) {
        totalsTable.style.tableLayout = prevTableLayout;
        totalsTable.style.width = prevTableWidth;
        if (grandRowCells && grandRowCells.length >= 2) {
          grandRowCells[0].style.whiteSpace = prevGrandLeftWS;
          grandRowCells[1].style.whiteSpace = prevGrandRightWS;
        }
      }
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

  <div id="invoicePrintArea" ref={printRef} className="invoice-a4 w-[794px] min-h-[1123px] h-auto mx-auto pt-1 print:break-after-avoid-page bg-white p-6 font-sans text-black flex flex-col justify-between">
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

  <div id="printContent" className="avoid-page-break h-max min-h-full py-6">
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
                <tr className="bg-[#3871C2] text-white print-bg">
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
            <table id="totalsTable" className="w-[32%] table-fixed border-collapse text-sm">
              <colgroup>
                <col style={{ width: "60%" }} />
                <col style={{ width: "40%" }} />
              </colgroup>
              <tbody>
                <tr className="bg-gray-50">
                  <td className="px-3 py-2 text-right font-bold whitespace-nowrap align-middle">Sub Total:</td>
                  <td className="px-3 py-2 text-right whitespace-nowrap align-middle">{subTotal.toLocaleString()} {currencyCode}</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-3 py-2 text-right font-bold whitespace-nowrap align-middle">Design Charge:</td>
                  <td className="px-3 py-2 text-right whitespace-nowrap align-middle">{designCharge.toLocaleString()} {currencyCode}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-3 py-2 text-right font-bold whitespace-nowrap align-middle">Installation Charge:</td>
                  <td className="px-3 py-2 text-right whitespace-nowrap align-middle">{installationCharge.toLocaleString()} {currencyCode}</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-3 py-2 text-right font-bold whitespace-nowrap align-middle">Discount:</td>
                  <td className="px-3 py-2 text-right whitespace-nowrap align-middle">{discountAmount.toLocaleString()} {currencyCode}</td>
                </tr>
                <tr className="bg-[#3871C2] text-white font-bold print-bg">
                  <td className="border border-blue-700 px-2 py-1 text-right align-middle">
                    <div className="h-8 flex items-center justify-end overflow-hidden">
                      <span className="inline-block whitespace-nowrap leading-none tracking-normal text-base">GRAND TOTAL:</span>
                    </div>
                  </td>
                  <td className="border border-blue-700 px-2 py-1 text-right align-middle">
                    <div className="h-8 flex items-center justify-end overflow-hidden">
                      <span className="inline-block whitespace-nowrap leading-none tracking-normal text-base">{grandTotal.toLocaleString()} {currencyCode}</span>
                    </div>
                  </td>
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
            {/* Flexible spacer to push footer to bottom when content is short (hidden on print) */}
            <div className="flex-1 no-print" />


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
