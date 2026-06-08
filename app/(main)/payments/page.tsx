'use client';

import React from 'react';
import { FileText } from 'lucide-react';

const PaymentsPage = () => {
    const [invoice, setInvoice] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        try {
            const raw = localStorage.getItem('invoice_pdf');
            if (raw) {
                setInvoice(JSON.parse(raw));
            }
        } catch (e) {
            console.error('Failed to parse invoice from localStorage', e);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleDownload = () => {
        if (!invoice?.base64 || !invoice?.fileName) return;

        // Convert base64 data URL back to a downloadable link
        const link = document.createElement('a');
        link.href = invoice.base64;
        link.download = invoice.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <div className="min-h-screen bg-[#F8FAFC] pt-12 pb-20 px-4">
                <div className="max-w-[900px] mx-auto">
                    {/* Header */}
                    <h1 className="text-[40px] md:text-[48px] font-[800] text-[#1e293b] text-center mb-10">
                        Payments
                    </h1>

                    {/* Content */}
                    <div className="space-y-4 mb-10">
                        {loading ? (
                            <div className="flex justify-center py-16">
                                <div className="w-10 h-10 border-4 border-[#193D66]/20 border-t-[#193D66] rounded-full animate-spin" />
                            </div>
                        ) : !invoice ? (
                            /* Empty State */
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-5">
                                    <FileText className="w-10 h-10 text-slate-400" />
                                </div>
                                <p className="text-[20px] font-[700] text-[#1e293b] mb-2">No payments yet</p>
                                <p className="text-[#64748b] text-[15px]">Your payment history and invoices will appear here.</p>
                            </div>
                        ) : (
                            /* Invoice Row */
                            <div className="bg-white rounded-[24px] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-50 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                                <div className="space-y-1 mb-4 md:mb-0">
                                    <h3 className="text-[20px] md:text-[22px] font-[700] text-[#1e293b]">
                                        {invoice.amount}
                                    </h3>
                                    <p className="text-[#64748b] text-[16px]">{invoice.date}</p>
                                    <p className="text-[#94a3b8] text-[13px] font-medium">
                                        Order #{invoice.orderId}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="bg-[#E6F9F1] text-[#00BA77] px-6 py-2.5 rounded-full text-[15px] font-[600]">
                                        Paid
                                    </div>
                                    <button
                                        onClick={handleDownload}
                                        className="px-8 py-2.5 rounded-full border border-slate-200 text-[#1e293b] text-[15px] font-[600] hover:bg-slate-50 transition-all cursor-pointer"
                                    >
                                        Download Invoice
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaymentsPage;
