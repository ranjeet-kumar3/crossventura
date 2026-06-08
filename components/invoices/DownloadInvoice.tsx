"use client";

import React, { useEffect, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoiceTemplate from './InvoiceTemplate';
import { Download, Loader2 } from 'lucide-react';

interface DownloadInvoiceProps {
    orderData: {
        orderId: string;
        date: string;
        customerName: string;
        customerEmail: string;
        items: Array<{
            description: string;
            amount: number;
        }>;
        totalAmount: number;
        gstAmount?: number;
        subtotalAmount?: number;
    };
    buttonText?: string;
    className?: string;
}

const DownloadInvoice: React.FC<DownloadInvoiceProps> = ({ 
    orderData, 
    buttonText = "Download Invoice",
    className = "" 
}) => {
    const [isClient, setIsClient] = useState(false);

    // Only render on client side to avoid hydration mismatch with PDF generator
    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return (
            <button className={`flex items-center gap-2 px-6 py-2 border border-[#E2E8F0] rounded-full text-[15px] font-[600] text-[#2D3748] opacity-50 cursor-not-allowed ${className}`}>
                <Loader2 className="w-4 h-4 animate-spin" />
                {buttonText}
            </button>
        );
    }

    return (
        <PDFDownloadLink
            document={<InvoiceTemplate orderData={orderData} />}
            fileName={`invoice_${orderData.orderId}.pdf`}
            className={`flex items-center gap-2 px-6 py-2 border border-[#E2E8F0] rounded-full text-[15px] font-[600] text-[#2D3748] hover:bg-slate-50 transition-all ${className}`}
        >
            {({ blob, url, loading, error }) =>
                loading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#3B87FA]" />
                        <span>Preparing...</span>
                    </>
                ) : (
                    <>
                        <Download className="w-4 h-4 text-[#3B87FA]" />
                        <span>{buttonText}</span>
                    </>
                )
            }
        </PDFDownloadLink>
    );
};

export default DownloadInvoice;
