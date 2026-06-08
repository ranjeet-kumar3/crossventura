"use client";

import React from "react";
import { ChevronLeft, Check, Mail, Loader2, Download } from "lucide-react";
import ProgressBar from "@/components/ProgressBar";
import { pdf } from '@react-pdf/renderer';
import InvoiceTemplate from '@/components/invoices/InvoiceTemplate';
import { toast } from "sonner";

interface ConfirmationProps {
    onNext: (data: Record<string, unknown>) => void;
    onBack: () => void;
}

const Confirmation: React.FC<ConfirmationProps> = ({ onNext, onBack }) => {
    const [loading, setLoading] = React.useState(true);
    const [paymentData, setPaymentData] = React.useState<any>(null);
    const [isDownloaded, setIsDownloaded] = React.useState(false);
    const [isGeneratingPDF, setIsGeneratingPDF] = React.useState(false);

    React.useEffect(() => {
        const fetchPaymentData = async () => {
            try {
                const response = await fetch('/api/onboarding/payment');
                if (response.ok) {
                    const data = await response.json();
                    setPaymentData(data);
                }
            } catch (error) {
                console.error("Error fetching payment data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPaymentData();
    }, []);

    const steps = [
        "Your Details",
        "Select Plan",
        "Add Services",
        "Business Details",
        "Payment",
        "Confirmation",
        "KYC",
    ];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleDownloadPDF = async () => {
        if (!paymentData) return;

        // Pricing Configuration (Matching Payment.tsx)
        const planPrices: Record<string, number> = {
            starter: 249,
            premium: 849,
            global: 49,
            consultation: 49
        };

        const stateFees: Record<string, number> = {
            "delaware": 160,
            "wyoming": 103.75,
            "florida": 125,
            "texas": 310,
            "nevada": 425,
            "new york": 205,
            "california": 70,
            "new jersey": 125,
            "new mexico": 50,
            "washington": 200
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

        setIsGeneratingPDF(true);
        try {
            const plan = paymentData.planType?.toLowerCase().includes("starter") ? "starter" :
                paymentData.planType?.toLowerCase().includes("premium") ? "premium" :
                    paymentData.planType?.toLowerCase().includes("global") ? "global" : "starter";

            const items = [];

            // 1. Add Plan / Category
            const isManageFlow = paymentData.planType?.toLowerCase().includes("manage");
            
            if (isManageFlow) {
                items.push({
                    description: paymentData.planType || "Manage Existing Business",
                    amount: 0
                });
            } else {
                items.push({
                    description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan - Formation`,
                    amount: planPrices[plan] || 0
                });
            }

            // 2. Add State Fee
            if (paymentData.formationState) {
                const stateKey = paymentData.formationState.toLowerCase();
                items.push({
                    description: `${paymentData.formationState} State Filing Fee`,
                    amount: stateFees[stateKey] || 0
                });
            }

            // 3. Add Add-ons
            if (paymentData.addOnServices && Array.from(paymentData.addOnServices).length > 0) {
                paymentData.addOnServices.forEach((serviceId: string) => {
                    const service = addOnPrices[serviceId];
                    if (service) {
                        items.push({
                            description: service.label,
                            amount: service.price
                        });
                    } else {
                        // Fallback if ID doesn't match exactly
                        items.push({
                            description: serviceId,
                            amount: 0
                        });
                    }
                });
            }

            const subtotal = items.reduce((acc, item) => acc + item.amount, 0);
            const gstAmount = subtotal * 0.19;

            const orderData = {
                orderId: paymentData?.stripePaymentIntentId?.slice(-10).toUpperCase() || "N/A",
                date: paymentData ? formatDate(paymentData.createdAt) : new Date().toLocaleDateString(),
                customerName: paymentData?.customerName || "Valued Customer",
                customerEmail: paymentData?.receiptEmail || "",
                formationState: paymentData?.formationState || "",
                items: items,
                subtotalAmount: subtotal,
                gstAmount: gstAmount,
                totalAmount: (paymentData?.amount / 100) || 0
            };

            // Generate PDF Blob
            const blob = await pdf(<InvoiceTemplate orderData={orderData} />).toBlob();

            // Save to localStorage for Payments page
            const invoiceReader = new FileReader();
            invoiceReader.readAsDataURL(blob);
            invoiceReader.onloadend = () => {
                const base64 = invoiceReader.result as string;
                localStorage.setItem('invoice_pdf', JSON.stringify({
                    base64,
                    orderId: orderData.orderId,
                    date: orderData.date,
                    amount: `$${orderData.totalAmount.toFixed(2)} USD`,
                    fileName: `CrossVentura-Invoice-${orderData.orderId}.pdf`,
                    savedAt: new Date().toISOString(),
                }));
            };

            // Create Download Link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `CrossVentura-Invoice-${orderData.orderId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setIsDownloaded(true);
            toast.success("Invoice downloaded successfully!");

            // Identify recurring (monthly) services for the email
            const recurringDetails: string[] = [];
            if (paymentData.addOnServices && Array.from(paymentData.addOnServices).length > 0) {
                paymentData.addOnServices.forEach((serviceId: string) => {
                    const service = addOnPrices[serviceId];
                    // Check if the service is monthly (recurring)
                    // Note: We check if the ID or label indicates it's monthly
                    if (service && (serviceId === 'virtual-mailbox' || serviceId === 'bookkeeping' || serviceId === 'physical-address' || serviceId === 'virtual_office')) {
                        recurringDetails.push(`${service.label} ($${service.price}/month)`);
                    }
                });
            }

            // Send to Email
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = async () => {
                const base64 = reader.result as string;
                try {
                    await fetch('/api/onboarding/send-receipt', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: paymentData?.receiptEmail,
                            customerName: paymentData?.customerName,
                            pdfBase64: base64,
                            orderId: orderData.orderId,
                            recurringDetails: recurringDetails
                        })
                    });
                    toast.success("Invoice has been sent to your email!");
                } catch (emailError) {
                    console.error("Error sending invoice email:", emailError);
                }
            };

        } catch (error) {
            console.error("Error generating invoice:", error);
            toast.error("Failed to generate invoice. Please try again.");
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    const handleAction = () => {
        if (!isDownloaded) {
            handleDownloadPDF();
        } else {
            onNext({});
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
                <div className="w-full max-w-[1296px] bg-white rounded-[20px] shadow-2xl overflow-hidden relative p-8 md:p-12 z-10 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#193D66]" />
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

            {/* Content Container (Modal) */}
            <div className="w-full max-w-[1296px] bg-white rounded-[20px] shadow-2xl overflow-hidden relative p-8 md:p-12 z-10 animate-in fade-in zoom-in duration-300">
                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="absolute left-8 top-8 p-2 rounded-full group hover:bg-slate-50 transition-colors"
                >
                    <ChevronLeft className="w-8 h-8 text-slate-900" />
                </button>

                {/* Progress Bar */}
                <ProgressBar steps={steps} currentStepIndex={5} />

                {/* Content */}
                <div className="flex flex-col items-center w-full max-w-[1218px] h-[716px] mx-auto overflow-y-auto pb-8 hide-scrollbar">
                    {/* Header Section: Icon & Title */}
                    <div className="flex flex-col items-center w-full max-w-[1138px] mb-4">
                        {/* Success Icon */}
                        <div className="mt-4 mb-4">
                            <div className="w-[72px] h-[72px] bg-[#48B02C] rounded-full flex items-center justify-center shadow-lg shadow-green-500/10">
                                <Check className="w-10 h-10 text-white stroke-[4px]" />
                            </div>
                        </div>

                        {/* Title & Subtitle */}
                        <div className="text-center">
                            <h1 className="text-[40px] font-[700] text-[#2D3748] mb-2 tracking-tight">
                                Order Confirmed!
                            </h1>
                            <p className="text-[#4A5568] text-[18px] max-w-[1138px] mx-auto leading-relaxed font-[400]">
                                Thank you for choosing us. Your company formation is now in progress.
                            </p>
                        </div>
                    </div>
                    {/* Order Details Box */}
                    <div className="w-full max-w-[1138px] bg-[#DEE5ED]/12 rounded-[32px] border border-[#E2E8F0] p-12 mb-4">
                        <div className="grid grid-cols-3 w-full gap-8">
                            <div className="flex flex-col gap-2">
                                <p className="text-[18px] font-[700] text-[#2D3748]">Order Number</p>
                                <p className="text-[#718096] text-[16px] font-[400]">
                                    {paymentData?.stripePaymentIntentId?.slice(-10).toUpperCase() || "ORD-" + Math.floor(Math.random() * 100000000)}
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-[18px] font-[700] text-[#2D3748]">Order Date</p>
                                <p className="text-[#718096] text-[16px] font-[400]">
                                    {paymentData ? formatDate(paymentData.createdAt) : "Monday, April 13, 2026"}
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-[18px] font-[700] text-[#2D3748]">Status</p>
                                <p className="text-[#718096] text-[16px] font-[400] capitalize">
                                    {paymentData?.status || "Processing"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Confirmation Email Alert (Non-PDF) */}
                    <div className="w-full max-w-[1138px] h-[62px] border border-[#E2E8F0] rounded-[32px] p-5 flex items-center gap-5 mb-4 bg-white">
                        <div className="flex-shrink-0">
                            <Mail className="w-5 h-5 text-slate-700" />
                        </div>
                        <div className="flex-1">
                            <p className="font-[700] text-[#2D3748] text-[14px] mb-0.5">Confirmation Email Sent</p>
                            <p className="text-[#718096] text-[13px] font-[400] leading-normal opacity-80">
                                Check your inbox at <span className="font-bold text-[#3B87FA]">{paymentData?.receiptEmail || "your email"}</span> for a detailed confirmation.
                            </p>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="w-full max-w-[480px] mt-8">
                        <button
                            onClick={handleAction}
                            disabled={isGeneratingPDF}
                            className="w-full py-4 px-10 bg-[#3B87FA] cursor-pointer text-white rounded-full font-[600] text-[18px] hover:bg-[#0055F7] transition-all transform active:scale-[0.98] shadow-lg shadow-[#193D66]/20 flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {isGeneratingPDF ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Generating PDF...
                                </>
                            ) : !isDownloaded ? (
                                <>
                                    <Download className="w-5 h-5" />
                                    Download Invoice
                                </>
                            ) : (
                                "Continue to KYC"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Confirmation;
