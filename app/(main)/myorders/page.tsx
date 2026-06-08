'use client';

import React from 'react';
import { Loader2, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { pdf } from '@react-pdf/renderer';
import InvoiceTemplate from '@/components/invoices/InvoiceTemplate';
import { toast } from 'sonner';

const MyOrdersPage = () => {
    const router = useRouter();
    const [userData, setUserData] = React.useState<any>({ name: "", email: "" });
    const [orders, setOrders] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [downloadingId, setDownloadingId] = React.useState<string | null>(null);

    // Pricing config (same as Confirmation.tsx)
    const planPrices: Record<string, number> = {
        starter: 249, premium: 849, global: 0, consultation: 49
    };
    const stateFees: Record<string, number> = {
        "delaware": 160, "wyoming": 103.75, "florida": 125, "texas": 310,
        "nevada": 425, "new york": 205, "california": 70,
        "new jersey": 125, "new mexico": 50, "washington": 200
    };
    const addOnPrices: Record<string, { price: number; label: string }> = {
        "ein-letter": { price: 80, label: "EIN Letter" },
        "virtual-mailbox": { price: 25, label: "Virtual Mailbox" },
        "virtual-bank": { price: 100, label: "Bank Setup" },
        "boir-filing": { price: 200, label: "BOIR Filing" },
        "operating-agreement": { price: 150, label: "Operating Agreement" },
        "bookkeeping": { price: 200, label: "Bookkeeping" },
        "physical-address": { price: 200, label: "Physical Address" },
        "google_verification": { price: 299, label: "Google Verification" },
        "board_flex": { price: 500, label: "Board Flex" },
        "physical_office": { price: 200, label: "Physical Office Address" },
        "virtual_office": { price: 35, label: "Virtual Office Address" },
        "warehousing": { price: 49, label: "Warehousing & Logistics" },
        "physical_bank": { price: 49, label: "Physical Bank Account Consultation" },
        "payment_gateway": { price: 49, label: "Payment Gateway Consultation" },
        "tax_guidance": { price: 49, label: "Annual Taxation Guidance" }
    };

    React.useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/myorders');
                if (response.ok) {
                    const data = await response.json();
                    setUserData({ name: data.name, email: data.email });
                    setOrders(data.orders);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
        });
    };

    const handleDownloadInvoice = async (orderId: string) => {
        setDownloadingId(orderId);
        try {
            // Fetch full payment data (same as Confirmation.tsx)
            const response = await fetch('/api/onboarding/payment');
            if (!response.ok) throw new Error("Failed to fetch payment details");
            const paymentData = await response.json();

            const plan = paymentData.planType?.toLowerCase().includes("starter") ? "starter"
                : paymentData.planType?.toLowerCase().includes("premium") ? "premium"
                    : paymentData.planType?.toLowerCase().includes("global") ? "global" : "starter";

            const items: { description: string; amount: number }[] = [];
            const isManageFlow = paymentData.planType?.toLowerCase().includes("manage");
            const isGlobal = plan === "global";

            if (isManageFlow) {
                items.push({ description: paymentData.planType || "Manage Existing Business", amount: 0 });
            } else if (isGlobal) {
                items.push({ description: "Global Plan (Consultation Booking)", amount: planPrices.consultation });
            } else {
                items.push({
                    description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan - Formation`,
                    amount: planPrices[plan] || 0
                });
            }

            // State fee (not for global)
            if (!isGlobal && paymentData.formationState) {
                const stateKey = paymentData.formationState.toLowerCase();
                items.push({
                    description: `${paymentData.formationState} State Filing Fee`,
                    amount: stateFees[stateKey] || 0
                });
            }

            // Add-ons
            if (paymentData.addOnServices && Array.from(paymentData.addOnServices).length > 0) {
                paymentData.addOnServices.forEach((serviceId: string) => {
                    const service = addOnPrices[serviceId];
                    items.push({ description: service?.label || serviceId, amount: service?.price || 0 });
                });
            }

            const subtotal = items.reduce((acc, item) => acc + item.amount, 0);
            const gstAmount = subtotal * 0.19;

            const orderData = {
                orderId: paymentData?.stripePaymentIntentId?.slice(-10).toUpperCase() || orderId,
                date: paymentData ? formatDate(paymentData.createdAt) : new Date().toLocaleDateString(),
                customerName: paymentData?.customerName || userData.name || "Valued Customer",
                customerEmail: paymentData?.receiptEmail || userData.email || "",
                formationState: paymentData?.formationState || "",
                items,
                subtotalAmount: subtotal,
                gstAmount,
                totalAmount: (paymentData?.amount / 100) || 0
            };

            const blob = await pdf(<InvoiceTemplate orderData={orderData} />).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `CrossVentura-Invoice-${orderData.orderId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success("Invoice downloaded successfully!");

        } catch (error) {
            console.error("Error generating invoice:", error);
            toast.error("Failed to generate invoice. Please try again.");
        } finally {
            setDownloadingId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-12 h-12 text-[#0266FF] animate-spin" />
                <p className="text-slate-500 font-bold text-sm tracking-wide">Loading your orders...</p>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-[#F8FAFC] pt-12 pb-20 px-4">
                <div className="max-w-[900px] mx-auto">
                    {/* Header */}
                    <h1 className="text-[40px] md:text-[48px] font-[800] text-[#1e293b] text-center mb-8">
                        My Orders
                    </h1>

                    {/* Orders List */}
                    {orders.length === 0 ? (
                        <div className="bg-white rounded-[24px] p-12 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-50 mb-10">
                            <p className="text-[#64748b] text-lg font-medium">No orders found.</p>
                        </div>
                    ) : (
                        <div className="space-y-4 mb-10">
                            {orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="bg-white rounded-[24px] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-50 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] group"
                                >
                                    <div className="space-y-1 mb-4 md:mb-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-[20px] md:text-[22px] font-[700] text-[#1e293b]">
                                                {order.title}
                                            </h3>
                                            <span className="text-[14px] text-[#94A3B8] font-medium">#{order.id}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <p className="text-[#64748b] text-[16px]">{order.date}</p>
                                            <span className="text-[#CBD5E0]">•</span>
                                            <p className="text-[#3B87FA] font-bold text-[16px]">
                                                ${order.amount.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="bg-[#E6F9F1] text-[#00BA77] px-6 py-2.5 rounded-full text-[15px] font-[600]">
                                            {order.status}
                                        </div>

                                        <button
                                            onClick={() => handleDownloadInvoice(order.id)}
                                            disabled={downloadingId === order.id}
                                            className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 rounded-full text-[15px] font-[600] text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-60 disabled:cursor-wait"
                                        >
                                            {downloadingId === order.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Download className="w-4 h-4" />
                                            )}
                                            {downloadingId === order.id ? "Generating..." : "Download Invoice"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Continue Button */}
                    <div className="flex justify-center">
                        <button
                            onClick={() => router.push('/document')}
                            className="w-full max-w-[400px] py-4 bg-[#0266FF] text-white rounded-full text-[18px] font-[600] shadow-lg shadow-[#193D66]/20 hover:bg-[#3B87FA] transition-all active:scale-[0.98]"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyOrdersPage;

