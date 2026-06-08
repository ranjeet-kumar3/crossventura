"use client";

import React, { useState } from "react";
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import { Lock, Loader2 } from "lucide-react";

interface CheckoutFormProps {
  amount: number;
  planType: string;
  onSuccess: (paymentIntentId: string, billingDetails?: { billingAddress: string; city: string; zipCode: string }) => void;
  onBack: () => void;
}

const CheckoutForm = ({ amount, planType, onSuccess, onBack }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [cardholderName, setCardholderName] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const elementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#1e293b",
        "::placeholder": {
          color: "#94a3b8",
        },
      },
      invalid: {
        color: "#ef4444",
      },
    },
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // 1. Create PaymentIntent on the server
      const res = await fetch("/api/onboarding/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, planType }),
      });

      const { clientSecret, message } = await res.json();

      if (!clientSecret) {
        throw new Error(message || "Failed to initialize payment");
      }

      // 2. Confirm the payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement)!,
          billing_details: {
            name: cardholderName,
            address: {
              line1: billingAddress,
              city: city,
              postal_code: zipCode,
            },
          },
        },
      });

      if (result.error) {
        setError(result.error.message || "Payment failed");
      } else {
        if (result.paymentIntent.status === "succeeded") {
          onSuccess(result.paymentIntent.id, { billingAddress, city, zipCode });
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        {/* Card Number */}
        <div className="space-y-2">
          <label className="text-[16px] font-bold text-[#1A202C]">Card Number</label>
          <div className="relative">
            <div className={`p-4 rounded-[32px] border bg-[#F8FAFC] transition-all ${focusedField === "cardNumber" ? "ring-1 ring-slate-400/20 focus:border-[#193D6614]" : "border-slate-200"}`}>
              <CardNumberElement 
                options={elementOptions} 
                onFocus={() => setFocusedField("cardNumber")}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" className="h-8" />
              <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="Mastercard" className="h-8" />
            </div>
          </div>
        </div>

        {/* Expiry & CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[16px] font-bold text-[#1A202C]">Expiry Date</label>
            <div className={`p-4 rounded-[32px] border bg-[#F8FAFC] transition-all ${focusedField === "expiry" ? "ring-1 ring-slate-400/20 focus:border-[#193D6614]" : "border-slate-200"}`}>
              <CardExpiryElement 
                options={elementOptions} 
                onFocus={() => setFocusedField("expiry")}
                onBlur={() => setFocusedField(null)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[16px] font-bold text-[#1A202C]">CVV</label>
            <div className={`p-4 rounded-[32px] border bg-[#F8FAFC] transition-all ${focusedField === "cvc" ? "ring-2 ring-slate-400/10 border-slate-400" : "border-slate-200"}`}>
              <CardCvcElement 
                options={elementOptions} 
                onFocus={() => setFocusedField("cvc")}
                onBlur={() => setFocusedField(null)}
              />
            </div>
          </div>
        </div>

        {/* Cardholder Name */}
        <div className="space-y-2">
          <label className="text-[16px] font-bold text-[#1A202C]">Cardholder Name</label>
          <input
            type="text"
            placeholder="Cardholder Name"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value.replace(/[^a-zA-Z\s]/g, ""))}
            minLength={3}
            maxLength={50}
            className="w-full p-4 rounded-[32px] border border-slate-200 bg-[#F8FAFC] focus:ring-1 focus:ring-slate-400/20 focus:border-[#193D6614] transition-all outline-none text-[16px] text-slate-800 placeholder:text-slate-400"
            required
          />
          <p className="text-[12px] text-slate-400 font-medium ml-1">Support for international cards.</p>
        </div>

        {/* Billing Address */}
        <div className="space-y-4 pt-2">
          <label className="text-[16px] font-bold text-[#1A202C]">Billing Address</label>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Address"
              value={billingAddress}
              onChange={(e) => setBillingAddress(e.target.value)}
              minLength={5}
              maxLength={100}
              className="w-full p-4 rounded-[32px] border border-slate-200 bg-[#F8FAFC] focus:ring-1 focus:ring-slate-400/20 focus:border-[#193D6614] transition-all outline-none text-[16px] text-slate-800 placeholder:text-slate-400"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value.replace(/[^a-zA-Z\s]/g, ""))}
                minLength={2}
                maxLength={50}
                className="w-full p-4 rounded-[32px] border border-slate-200 bg-[#F8FAFC] focus:ring-1 focus:ring-slate-400/20 focus:border-[#193D6614] transition-all outline-none text-[16px] text-slate-800 placeholder:text-slate-400"
                required
              />
              <input
                type="text"
                placeholder="ZIP Code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value.replace(/[^0-9-]/g, ""))}
                minLength={3}
                maxLength={12}
                className="w-full p-4 rounded-[32px] border border-slate-200 bg-[#F8FAFC] focus:ring-1 focus:ring-slate-400/20 focus:border-[#193D6614] transition-all outline-none text-[16px] text-slate-800 placeholder:text-slate-400"
                required
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-xl border border-red-100">
            <div className="w-1 h-1 bg-red-500 rounded-full" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 p-5 rounded-[24px] border border-slate-100 bg-slate-50/50">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
          <Lock className="w-5 h-5 text-slate-700" />
        </div>
        <div>
          <p className="font-bold text-[#1A202C] text-[15px]">Secure Payment</p>
          <p className="text-sm text-slate-500 font-medium leading-tight">Your payment information is encrypted and secure</p>
        </div>
      </div>

      <div className="pt-6">
        <button
          type="submit"
          disabled={!stripe || processing}
          className="w-full py-5 bg-[#0266FF] cursor-pointer text-white rounded-full font-bold text-[18px] hover:bg-[#3B87FA] transition-all transform active:scale-[0.98] shadow-2xl shadow-[#193D66]/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {processing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay $${amount} USD`
          )}
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;
