"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft } from "lucide-react";
import ProgressBar from "@/components/ProgressBar";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/onboarding/CheckoutForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentProps {
    onNext: (data: Record<string, unknown>) => void;
    onBack: () => void;
    formData: Record<string, any>;
}

const Payment: React.FC<PaymentProps> = ({ onNext, onBack, formData }) => {

    // Price Mappings
    const planPrices: Record<string, number> = {
        starter: 249,
        premium: 849,
        global: 0,
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
        washington: 200
    };

    const addOnPrices: Record<string, { price: number; type: "one-time" | "monthly"; label: string }> = {
        "ein-letter": { price: 80, type: "one-time", label: "EIN Letter" },
        "virtual-mailbox": { price: 25, type: "monthly", label: "Virtual Mailbox" },
        "virtual-bank": { price: 100, type: "one-time", label: "Bank Setup" },
        "boir-filing": { price: 200, type: "one-time", label: "BOIR Filing" },
        "operating-agreement": { price: 150, type: "one-time", label: "Operating Agreement" },
        "bookkeeping": { price: 200, type: "monthly", label: "Bookkeeping" },
        "physical-address": { price: 200, type: "monthly", label: "Physical Address" }
    };

    // Dynamic Calculations
    const calculations = useMemo(() => {
        // If Manage flow, use the total passed from Category step
        if (formData.whoIsThisFor === "manage") {
            const selectedAddOns = (formData.selectedServicesDetails as any[]) || [];
            let oneTimeTotal = 0;
            let monthlyTotal = 0;

            // 1. Calculate base totals from selected services
            selectedAddOns.forEach(item => {
                if (item.type === 'monthly') {
                    monthlyTotal += item.numericPrice;
                } else {
                    oneTimeTotal += item.numericPrice;
                }
            });

            // 2. Check if we need to add an extra consultation fee
            // We only add it if bookConsultation is true AND no selected service is already a consultation
            // 2. Check if we need to add an extra consultation fee
            const hasConsultationInServices = selectedAddOns.some(s =>
                s.title?.toLowerCase().includes("consultation") ||
                (s.price && typeof s.price === 'string' && s.price.toLowerCase().includes("consultation"))
            );

            const shouldAddExtraConsultation = formData.bookConsultation && !hasConsultationInServices;

            if (shouldAddExtraConsultation) {
                oneTimeTotal += (planPrices.consultation || 49);
            }

            // 3. Calculate State Fees for Manage Flow
            const serviceStatesMap = (formData.serviceStates as Record<string, string>) || {};
            const uniqueStates = Array.from(new Set(Object.values(serviceStatesMap)));

            let totalStateFee = 0;
            const stateLabels: string[] = [];

            uniqueStates.forEach(stateName => {
                const fee = stateFees[stateName.toLowerCase()] || 0;
                if (fee > 0) {
                    totalStateFee += fee;
                    stateLabels.push(stateName);
                }
            });

            oneTimeTotal += totalStateFee;

            const gstAmount = oneTimeTotal * 0.19;
            oneTimeTotal += gstAmount;

            return {
                planLabel: `${formData.categoryTitle || "Custom Scaling Services"} (Manage Business)`,
                basePrice: 0,
                stateLabel: stateLabels.join(", "),
                stateFee: totalStateFee,
                selectedAddOns: [
                    ...(shouldAddExtraConsultation
                        ? [{ label: "Consultation Booking", price: (planPrices.consultation || 49), type: 'one-time' }]
                        : []),
                    ...selectedAddOns.map(s => ({
                        label: s.title,
                        price: s.numericPrice,
                        type: s.type || 'one-time'
                    }))
                ],
                gstAmount,
                oneTimeTotal,
                monthlyTotal
            };
        }

        // Default Start Flow Logic
        const plan = formData.plan || "starter";
        const basePrice = planPrices[plan] || 0;
        const state = formData.state || "";
        const stateFee = plan === "global" ? 0 : (stateFees[state.toLowerCase()] || 0);
        const addOns = (formData.addOnServices as string[]) || [];

        // For Global Plan: consultation is the main charge (shown in Plan row, not Add-ons)
        const consultationFee = planPrices["consultation"];
        const isGlobal = plan === "global";

        let oneTimeTotal = isGlobal ? consultationFee : (basePrice + stateFee);
        let monthlyTotal = 0;
        const selectedAddOns: any[] = [];

        // 1. For non-global: Add Consultation fee if selected
        if (!isGlobal && formData.bookConsultation) {
            oneTimeTotal += consultationFee;
            selectedAddOns.push({
                price: consultationFee,
                type: "one-time",
                label: "Consultation Booking"
            });
        }

        // 2. Add other Add-on Services
        addOns.forEach(id => {
            let service = { ...addOnPrices[id] };
            if (service) {
                selectedAddOns.push(service);

                if (service.type === "one-time") {
                    oneTimeTotal += service.price;
                } else {
                    monthlyTotal += service.price;
                }
            }
        });

        const gstAmount = oneTimeTotal * 0.19;
        oneTimeTotal += gstAmount;

        return {
            planLabel: isGlobal ? "Global Plan (Consultation Booking)" : plan.charAt(0).toUpperCase() + plan.slice(1) + " Plan",
            basePrice: isGlobal ? consultationFee : basePrice,
            stateLabel: state.charAt(0).toUpperCase() + state.slice(1),
            stateFee,
            selectedAddOns,
            gstAmount,
            oneTimeTotal,
            monthlyTotal,
            isGlobal
        };
    }, [formData]);


    const handlePaymentSuccess = async (paymentIntentId: string, billingDetails?: { billingAddress: string; city: string; zipCode: string }) => {
        try {
            await fetch('/api/onboarding/payment', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paymentIntentId,
                    status: 'succeeded',
                    ...billingDetails
                })
            });
            onNext({
                paymentIntentId,
                amount: calculations.oneTimeTotal,
                planType: calculations.planLabel
            });
        } catch (error) {
            console.error("Error updating payment status:", error);
            // Still proceed to next step but log the error
            onNext({
                paymentIntentId,
                amount: calculations.oneTimeTotal,
                planType: calculations.planLabel
            });
        }
    };

    const steps = formData.whoIsThisFor === "manage"
        ? ["Your Details", "Category", "Business Info", "Payment", "Confirmation", "KYC"]
        : ["Your Details", "Select Plan", "Add Services", "Business Details", "Payment", "Confirmation", "KYC"];

    const currentStepIndex = formData.whoIsThisFor === "manage" ? 3 : 4;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <div className="w-full max-w-[1296px] bg-white rounded-[20px] shadow-2xl overflow-hidden relative p-8 md:p-12 z-10 animate-in fade-in zoom-in duration-300">
                <button onClick={onBack} className="absolute left-8 top-8 p-2 rounded-full group hover:bg-slate-50 transition-colors">
                    <ChevronLeft className="w-8 h-8 text-slate-900" />
                </button>
                <ProgressBar steps={steps} currentStepIndex={currentStepIndex} />

                <div className="w-full max-w-[1200px] mx-auto overflow-y-auto max-h-[716px] hide-scrollbar px-2">
                    <div className="text-center mb-10">
                        <h1 className="text-[40px] font-[700] text-[#1A202C] mb-2">Review & Complete Payment</h1>
                        <p className="text-[#4A5568] text-[18px]">No hidden fees — review your full order before paying</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8 max-w-[1138px] mx-auto">
                        {/* Left Column: Payment Details */}
                        <div className="lg:col-span-6 space-y-8">
                            <div className="lg:col-span-6 space-y-8">
                                <div className="space-y-6">
                                    <h3 className="text-[28px] font-[700] text-[#1A202C]">Payment Form</h3>
                                    <Elements stripe={stripePromise}>
                                        <CheckoutForm amount={calculations.oneTimeTotal} planType={calculations.planLabel} onSuccess={handlePaymentSuccess} onBack={onBack} />
                                    </Elements>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Order Summary */}
                        <div className="lg:col-span-6 flex justify-end items-start lg:sticky lg:top-0 h-fit">
                            <div className="bg-[#DEE5ED]/12 rounded-[20px] border border-slate-100 p-8 w-[559px] h-fit shadow-sm">
                                <h2 className="text-[24px] font-bold text-[#1A202C] mb-6">Order Summary</h2>
                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <p className="font-bold text-[#1A202C] text-[18px]">Plan / Category:</p>
                                        <div className="flex justify-between items-center text-[16px]">
                                            <span className="text-slate-400">{calculations.planLabel}</span>
                                            {formData.whoIsThisFor !== "manage" && (
                                                <span className="font-semibold text-[#193D66]/60">${calculations.basePrice}</span>
                                            )}
                                        </div>
                                    </div>

                                    {calculations.stateFee > 0 && (
                                        <div className="space-y-1">
                                            <p className="font-bold text-[#1A202C] text-[18px]">State Filing Fee:</p>
                                            <div className="flex justify-between items-center text-[16px]">
                                                <span className="text-[#193D66]/60">{calculations.stateLabel} —</span>
                                                <span className="font-semibold text-[#193D66]/60">${calculations.stateFee}</span>
                                            </div>
                                        </div>
                                    )}

                                    {calculations.selectedAddOns.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="font-bold text-[#1A202C] text-[18px]">Add-ons:</p>
                                            <div className="space-y-1">
                                                {calculations.selectedAddOns.map((addon, idx) => (
                                                    <div key={idx} className="flex justify-between items-center text-[16px]">
                                                        <span className="text-[#193D66]/60">{addon.label} —</span>
                                                        <span className="font-semibold text-[#193D66]/60">${addon.price}{addon.type === 'monthly' ? '/month' : ' (one-time)'}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-6 border-t border-slate-200 space-y-2">
                                        <p className="font-bold text-[#1A202C] text-[18px]">Totals Section:</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500 font-[600] text-[16px]">GST (19%) —</span>
                                            <span className="font-[600] text-[#193D66]/60 text-[16px]">${calculations.gstAmount.toFixed(2)} USD</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500 font-[600] text-[16px]">One-time total —</span>
                                            <span className="font-[600] text-[#193D66]/60 text-[16px]">${calculations.oneTimeTotal.toFixed(2)} USD</span>
                                        </div>
                                        {calculations.monthlyTotal > 0 && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-500 font-[600] text-[16px]">
                                                    Recurring ({calculations.selectedAddOns.filter(a => a.type === 'monthly').map(a => a.label).join(", ")}) —
                                                </span>
                                                <span className="font-[600] text-[#193D66]/60 text-[16px]">${calculations.monthlyTotal}/month USD</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
