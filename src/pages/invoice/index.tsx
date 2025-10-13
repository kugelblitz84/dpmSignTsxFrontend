import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Printer } from "lucide-react";

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
  const lastPageRef = useRef<HTMLDivElement | null>(null);
  const [splitPaymentToNewPage, setSplitPaymentToNewPage] = useState(false);

  const handlePrint = () => {
    if (!printRef.current) return;
    const prevTitle = document.title;
    document.title = `DPM-${orderId}`;
    const restore = () => {
      document.title = prevTitle;
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);
    setTimeout(() => window.print(), 30);
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [staffRes, courierRes] = await Promise.all([
          token ? staffService.fetchAllStaff(token) : staffService.fetchAllStaffPublic(),
          token ? courierService.fetchAllCourier(token) : courierService.fetchAllCourierPublic(),
        ]);
        setStaff((staffRes?.data?.staff || []).filter((s: StaffProps) => !s.isDeleted));
        setCouriers(courierRes?.data?.couriers || []);
      } catch (e) { console.log("invoice fetchAll failed", e); }
    };
    fetchAll();
  }, [token]);

  useEffect(() => {
    const found = orders.find((o) => String(o.orderId) === String(orderId));
    setOrder(found || null);
  }, [orders, orderId]);

  const invoiceData = useMemo(() => {
    if (!order) return null;
    const agentInfo = staff.find((s) => s.staffId === order.staffId) || null;
    const toNum = (v: unknown) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : 0;
    };
    const agg = (order.orderItems || []).reduce(
      (acc, it) => {
        const qty = Math.max(1, toNum(it.quantity));
        const unit = toNum((it as any).unitPrice);
        const addl = toNum((it as any).additionalPrice);
        const discPct = toNum((it as any).discountPercentage);
        const design = toNum((it as any).designCharge);
        const unitBase = unit * qty;
        const addlBase = addl * qty;
        const discountAmt = (unit + addl) * qty * (discPct / 100);
        return {
          unitBaseTotal: acc.unitBaseTotal + unitBase,
          additionalTotal: acc.additionalTotal + addlBase,
          itemDiscountTotal: acc.itemDiscountTotal + discountAmt,
          designChargeTotal: acc.designChargeTotal + design,
        };
      },
      { unitBaseTotal: 0, additionalTotal: 0, itemDiscountTotal: 0, designChargeTotal: 0 }
    );
    const computedSubTotal = (order.orderItems || []).reduce((s, it) => s + Number(it.price || 0), 0);
    const subTotal = computedSubTotal > 0 ? computedSubTotal : Number(order.orderTotalPrice || 0);
    const grandTotal = Number(order.orderTotalPrice ?? subTotal);
    const totalPaidAmount = (order.payments || []).reduce((acc, curr) => acc + ((curr.isPaid || curr.paymentMethod === "cod-payment") ? (Number(curr.amount) || 0) : 0), 0);
    const amountDue = Math.max(0, grandTotal - totalPaidAmount);
    return { order, agentInfo, subTotal, grandTotal, amountDue, priceDetails: agg };
  }, [order, staff]);

  // Pagination helpers: 4 items per page. Must be declared before any early return to respect Rules of Hooks.
  const itemsPerPage = 6; // match admin panel layout density
  const pages: OrderItemProps[][] = useMemo(() => {
    const items = order?.orderItems || [];
    const res: OrderItemProps[][] = [];
    for (let i = 0; i < items.length; i += itemsPerPage) res.push(items.slice(i, i + itemsPerPage));
    return res.length ? res : [[]];
  }, [order?.orderItems]);

  // Measure to decide whether to move Payment section to a new page when it overflows last page
  useEffect(() => {
    setSplitPaymentToNewPage(false);
    const t = setTimeout(() => {
      if (!invoiceData) return;
      const el = lastPageRef.current;
      if (!el) return;
      const A4_HEIGHT = 1123; // px
      const tolerance = 2;
      if (el.scrollHeight > A4_HEIGHT + tolerance) setSplitPaymentToNewPage(true);
    }, 50);
    return () => clearTimeout(t);
  }, [orderId, order?.orderItems?.length, invoiceData?.grandTotal]);

  if (!invoiceData) return <Preloader />;

  const { order: currentOrder, agentInfo, subTotal, grandTotal, amountDue, priceDetails } = invoiceData;

  const courierName = currentOrder.courierId ? (couriers.find((c) => c.courierId === currentOrder.courierId)?.name || "N/A") : null;

  // pages computed above; safe to use here

  const Header = () => (
    <div id="printHeader" className="w-full flex items-center justify-between gap-2 px-3 pb-2 border-b border-gray-300">
      <div className="flex items-center justify-start gap-3">
        <div className="h-[70px] flex items-end">
          <img src="/icon.svg" alt="icon" className="h-[80px] w-auto object-contain invoice-logo" />
        </div>
        <div className="flex flex-col items-start leading-tight">
          <h1 className="text-2xl tracking-wider font-bold text-red-600">Dhaka Plastic & Metal</h1>
          <span className="text-xs text-gray-700">Your Trusted Business Partner for Branding Solutions.</span>
          <span className="text-xs text-gray-700">
            <a href="mailto:info@dpmsign.com" target="_blank" className="text-blue-600 hover:underline" rel="noreferrer">info@dpmsign.com</a>
            {" | "}
            <a href="https://www.dpmsign.com" target="_blank" className="text-blue-600 hover:underline" rel="noreferrer">www.dpmsign.com</a>
          </span>
        </div>
      </div>
      <div className="text-right flex flex-col items-end">
        <h2 className="text-[#3871C2] text-2xl font-semibold">INVOICE</h2>
        <p className="font-bold text-lg">DPM-{currentOrder.orderId}</p>
        <p className="text-xs mt-1 text-gray-700">Order Date: {new Date(currentOrder.createdAt).toLocaleDateString("en-GB")}</p>
        <p className="text-xs text-gray-700">Delivery Date: {currentOrder.deliveryDate ? new Date(currentOrder.deliveryDate).toLocaleDateString("en-GB") : "N/A"}</p>
      </div>
    </div>
  );

  const Footer = ({ isLast }: { isLast: boolean }) => (
    <div className="bg-white text-xs text-black w-full px-4 pt-2">
      {/* Signature section (part of footer) */}
      <div className="w-full px-3 pt-2 mb-3">
        <div className="flex items-end justify-between">
          {/* Left side: NB + Thank you only on last page */}
          <div className="text-sm text-gray-800 whitespace-pre-line pr-4">
            {isLast && (
              <>
                <p className="mt-1 font-bold">NB: Delivery and Installation charges are the customer’s responsibility (if applicable).</p>
                <p className="">Thank you for choosing Dhaka Plastic & Metal!</p>
              </>
            )}
          </div>
          {/* Right side: signature display on every page */}
          <div className="w-1/2 text-right">
            <div className="text-sm font-medium">{agentInfo?.name ?? ""}</div>
            <div className="text-xs">{agentInfo?.phone ?? (agentInfo as any)?.contactNo ?? ""}</div>
            <div className="border-t border-gray-500 mt-1 mb-1 w-1/2 ml-auto"></div>
            <div className="text-xs leading-tight">Authorized Signature<br/>For Dhaka Plastic & Metal</div>
          </div>
        </div>
      </div>

      {/* Footer info bar with top border line */}
      <div id="printFooter" className="bg-white text-xs text-black w-full py-3 border-t border-gray-300">
        <div className="flex flex-row items-center justify-between w-full max-w-full mx-auto">
          <div className="flex items-center gap-2 text-left w-1/3">
            <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 5a2 2 0 012-2h2.3a1 1 0 01.97.757l.7 2.8a1 1 0 01-.24.92L7.4 9.6a15.05 15.05 0 006 6l1.2-1.6a1 1 0 01.92-.24l2.8.7A1 1 0 0121 16.7V19a2 2 0 01-2 2h-1C8.5 21 3 15.5 3 8V5z" fill="#3871C2"/></svg>
            <div className="leading-tight"><div>+8801919960198</div><div>+8801858253961</div></div>
          </div>
          <div className="flex items-center gap-2 justify-center w-1/3 text-center">
            <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h16v16H4z" fill="none"/><path d="M3 6.5L12 13l9-6.5" stroke="#3871C2" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/><rect x="3" y="5" width="18" height="14" rx="2" stroke="#3871C2" strokeWidth="0" fill="transparent"/></svg>
            <div>info@dpmsign.com</div>
          </div>
          <div className="flex items-center gap-2 justify-end w-1/3 text-right">
            <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#3871C2"/><circle cx="12" cy="9" r="2.3" fill="#fff"/></svg>
            <div className="leading-tight"><div>Shop No: 94 &amp; 142, Dhaka University</div><div>Market, Katabon Road, Dhaka-1000</div></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
  <div className="w-full h-full flex flex-col gap-8 pt-5 print:h-auto print:gap-0 print:pt-0">
      <div className="w-full flex items-center justify-center gap-4 mb-4 print:hidden">
        <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2">
          <Printer className="h-4 w-4" />
          Print or Download Invoice
        </Button>
      </div>

  <div id="invoicePrintArea" ref={printRef} className="w-[794px] mx-auto text-black">
        {pages.map((pageItems, pageIndex) => {
          const isFirst = pageIndex === 0;
          const isLast = pageIndex === pages.length - 1;
          return (
            <div key={pageIndex} className="invoice-a4 bg-white font-sans text-black flex flex-col justify-between" ref={isLast ? lastPageRef : undefined}>
              <Header />
              <div className="flex-1 py-2 px-3">
                {isFirst && (
                  <div className="w-full h-auto mb-6 flex font-medium">
                    <div className="flex-1 pt-2 px-3">
                      <h3 className="text-sm font-bold pb-1 text-gray-800">Billing Information:</h3>
                      <p className="text-xs text-gray-700">Name: {currentOrder.customerName}</p>
                      <p className="text-xs text-gray-700">Email: {currentOrder.customerEmail || "N/A"}</p>
                      <p className="text-xs text-gray-700">Phone: {currentOrder.customerPhone}</p>
                      <p className="text-xs text-gray-700">Address: {currentOrder.billingAddress}</p>
                    </div>
                    <div className="flex-1 pt-2 px-3">
                      <h3 className="text-sm font-bold pb-1 text-gray-800">Shipping Information:</h3>
                      <p className="text-xs text-gray-700">Shipping Method: {currentOrder.deliveryMethod === "courier" ? "Courier" : "Shop Pickup"}</p>
                      {currentOrder.courierAddress && currentOrder.courierId && (<>
                        <p className="text-xs text-gray-700">Preferred Courier: {courierName}</p>
                        <p className="text-xs text-gray-700">Courier Address: {currentOrder.courierAddress || "N/A"}</p>
                      </>)}
                    </div>
                  </div>
                )}

                <div className="w-full h-auto mb-2">
                  <h3 className="text-sm font-bold mb-1 text-gray-800">Order Details</h3>
                  <table className="w-full table-auto border-collapse text-sm">
                    <thead>
                      <tr className="bg-[#3871C2] text-white">
                        <th className="border border-blue-700 p-2 text-center w-[8%]">S/N</th>
                        <th className="border border-blue-700 p-2 text-left w-[47%]">DESCRIPTION</th>
                        <th className="border border-blue-700 p-2 text-center w-[15%]">QTY / SQ.FT</th>
                        <th className="border border-blue-700 p-2 text-center w-[15%]">UNIT PRICE</th>
                        <th className="border border-blue-700 p-2 text-center w-[15%]">TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(pageItems.length ? pageItems : []).map((orderItem: OrderItemProps, idx: number) => {
                        const globalIndex = pageIndex * itemsPerPage + idx;
                        const toNum = (v: unknown) => { const n = Number(v); return Number.isFinite(n) ? n : 0; };
                        const qty = Math.max(1, toNum(orderItem.quantity));
                        const unitBase = toNum(orderItem.unitPrice) + toNum(orderItem.additionalPrice);
                        const discPct = toNum(orderItem.discountPercentage);
                        const hasBreakdown = unitBase > 0 || discPct > 0;
                        const fallback = qty ? toNum(orderItem.price) / qty : 0;
                        const unitNet = hasBreakdown ? unitBase * (1 - discPct / 100) : fallback;
                        return (
                          <tr key={orderItem.orderItemId} className={globalIndex % 2 === 0 ? "bg-white" : "bg-blue-100"}>
                            <td className="border border-gray-300 p-2 text-center">{globalIndex + 1}</td>
                            <td className="border border-gray-300 p-2 whitespace-normal break-words">
                              <span className="font-semibold">{orderItem?.product?.name ?? "Unknown Product"}</span>
                              <br />
                              <span className="text-xs text-gray-600 ">
                                {(() => {
                                  const details = (orderItem?.productVariant?.variantDetails || []) as any[];
                                  const labels = details.map((detail: any) => {
                                    const varName = detail?.variationItem?.variation?.name || "";
                                    const varUnit = detail?.variationItem?.variation?.unit || "";
                                    const val = detail?.variationItem?.value || "";
                                    return varName ? `${varName}: ${val} ${varUnit}` : String(val || "");
                                  }).filter(Boolean);
                                  return labels.length ? labels.join("; ") : null;
                                })()}
                                {(() => {
                                  const sizeNum = Number(orderItem.size);
                                  const showSize = Number.isFinite(sizeNum) && sizeNum > 0 && orderItem.widthInch != null && orderItem.heightInch != null;
                                  return showSize ? ` (${orderItem.widthInch} inch x ${orderItem.heightInch} inch)` : "";
                                })()}
                              </span>
                            </td>
                            <td className="border border-gray-300 p-2 text-center">{orderItem.quantity} {orderItem.quantity > 1 ? "pcs" : "pc"}{(() => { const n = Number(orderItem.size); return Number.isFinite(n) && n > 0 ? ` (${n.toLocaleString()} sq.ft)` : ""; })()}</td>
                            <td className="border border-gray-300 p-2 text-center">{unitNet.toLocaleString()} {currencyCode}</td>
                            <td className="border border-gray-300 p-2 text-center">{Number(orderItem.price).toLocaleString()} {currencyCode}</td>
                          </tr>
                        );
                      })}
                      {(pageItems.length === 0) && (
                        <tr>
                          <td className="border border-gray-300 p-2 text-center">1</td>
                          <td className="border border-gray-300 p-2"><span className="font-semibold">Order summary</span><br /><span className="text-xs text-gray-600">Item details are not available for this order.</span></td>
                          <td className="border border-gray-300 p-2 text-center">—</td>
                          <td className="border border-gray-300 p-2 text-center">—</td>
                          <td className="border border-gray-300 p-2 text-center">{grandTotal.toLocaleString()} {currencyCode}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {isLast && (
                  <>
                    <div className="w-full flex justify-end mb-4">
                      <div className="w-[360px] text-sm">
                        <div className="grid grid-cols-2">
                          <div className="px-2 py-1 text-right font-bold bg-gray-50">Sub Total:</div>
                          <div className="px-2 py-1 text-right bg-gray-50">{(subTotal - priceDetails.designChargeTotal + priceDetails.itemDiscountTotal).toLocaleString()} {currencyCode}</div>
                          <div className="px-2 py-1 text-right font-bold bg-gray-50">Design Charge:</div>
                          <div className="px-2 py-1 text-right bg-gray-50">{priceDetails.designChargeTotal.toLocaleString()} {currencyCode}</div>
                          <div className="px-2 py-1 text-right font-bold bg-white">Discount:</div>
                          <div className="px-2 py-1 text-right bg-white">{Math.ceil(priceDetails.itemDiscountTotal).toLocaleString()} {currencyCode}</div>
                          <div className="col-span-2 h-1"></div>
                          <div className="px-2 py-1.5 text-right font-bold text-lg bg-[#3871C2] text-white">GRAND TOTAL:</div>
                          <div className="px-2 py-1.5 text-right font-bold text-lg bg-[#3871C2] text-white">{grandTotal.toLocaleString()} {currencyCode}</div>
                        </div>
                      </div>
                    </div>

                    {currentOrder.payments.length > 0 && !splitPaymentToNewPage && (
                      <div className="w-full h-auto mb-4">
                        <h3 className="text-base font-bold mb-2 text-gray-800">Payment Details</h3>
                        <table className="w-full table-auto border-collapse text-sm">
                          <thead>
                            <tr className="bg-[#3871C2] text-white">
                              <th className="border border-blue-700 p-2 text-left">Payment Method</th>
                              <th className="border border-blue-700 p-2 text-left">Status</th>
                              <th className="border border-blue-700 p-2 text-right">Amount Paid</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentOrder.payments.map((payment) => (
                              <tr key={payment.paymentId} className="bg-gray-50">
                                <td className="border border-gray-300 p-2 text-left">{payment.paymentMethod === 'cod-payment' ? 'cash payment' : 'online payment'}</td>
                                <td className="border border-gray-300 p-2 text-left">{payment.isPaid ? 'paid' : 'pending'}</td>
                                <td className="border border-gray-300 p-2 text-right">{Number(payment.amount).toLocaleString()} {currencyCode}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="w-full flex justify-end mt-3"><div className="text-right font-bold">Amount Due: {amountDue.toLocaleString()} {currencyCode}</div></div>
                      </div>
                    )}

                  </>
                )}
              </div>
              <Footer isLast={isLast} />
            </div>
          );
        })}
        {splitPaymentToNewPage && currentOrder.payments.length > 0 && (
          <div className="invoice-a4 bg-white font-sans text-black flex flex-col justify-between">
            <Header />
            <div className="flex-1 py-2 px-3">
              <h3 className="text-base font-bold mb-2 text-gray-800">Payment Details</h3>
              <table className="w-full table-auto border-collapse text-sm">
                <thead>
                  <tr className="bg-[#3871C2] text-white">
                    <th className="border border-blue-700 p-2 text-left">Payment Method</th>
                    <th className="border border-blue-700 p-2 text-left">Status</th>
                    <th className="border border-blue-700 p-2 text-right">Amount Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrder.payments.map((payment) => (
                    <tr key={payment.paymentId} className="bg-gray-50">
                      <td className="border border-gray-300 p-2 text-left">{payment.paymentMethod === 'cod-payment' ? 'cash payment' : 'online payment'}</td>
                      <td className="border border-gray-300 p-2 text-left">{payment.isPaid ? 'paid' : 'pending'}</td>
                      <td className="border border-gray-300 p-2 text-right">{Number(payment.amount).toLocaleString()} {currencyCode}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="w-full flex justify-end mt-3"><div className="text-right font-bold">Amount Due: {amountDue.toLocaleString()} {currencyCode}</div></div>
            </div>
            <Footer isLast={true} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoice;
