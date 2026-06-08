"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronDown, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ProgressBar from "@/components/ProgressBar";

interface GlobalPlanProps {
    onNext: (data: Record<string, unknown>) => void;
    onBack: () => void;
}

const GlobalPlan: React.FC<GlobalPlanProps> = ({ onNext, onBack }) => {
    const [exportingToUS, setExportingToUS] = useState<string | null>(null);
    const [productCategory, setProductCategory] = useState("");
    const [quantity, setQuantity] = useState<string | null>(null);
    const [otherQuantity, setOtherQuantity] = useState("");
    const [dimensions, setDimensions] = useState<string | null>(null);
    const [cartonDimensions, setCartonDimensions] = useState("");
    const [frequency, setFrequency] = useState<string | null>(null);
    const [approxOrders, setApproxOrders] = useState("");
    const [shipmentWeight, setShipmentWeight] = useState<string | null>(null);
    const [logisticsPartner, setLogisticsPartner] = useState<string | null>(null);
    const [logisticsPartnerName, setLogisticsPartnerName] = useState("");
    const [returnHandling, setReturnHandling] = useState<string | null>(null);
    const [timeline, setTimeline] = useState("");
    const [boxDimensions, setBoxDimensions] = useState({ length: "", width: "", height: "" });
    const [avgWeight, setAvgWeight] = useState("");
    const [numProductsPerBox, setNumProductsPerBox] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const steps = [
        "Your Details",
        "Select Plan",
        "Add Services",
        "Business Details",
        "Payment",
        "Confirmation",
        "KYC",
    ];

    const handleContinue = async () => {
        // Validation
        if (!exportingToUS) return toast.error("Please specify if you are currently exporting to the US.");
        if (!productCategory || productCategory === "Please specify") return toast.error("Please specify your product.");
        if (!quantity) return toast.error("Please specify the export quantity.");
        if (quantity?.includes("Other") && !otherQuantity) return toast.error("Please specify the other quantity.");
        if (!dimensions) return toast.error("Please specify the shipment dimensions.");
        if (dimensions?.includes("Carton dimensions") && !cartonDimensions) return toast.error("Please provide carton dimensions.");
        if (!frequency) return toast.error("Please specify the frequency of orders.");
        if (!approxOrders) return toast.error("Please provide the approx number of orders.");
        if (!shipmentWeight) return toast.error("Please specify the shipment weight.");
        if (!logisticsPartner) return toast.error("Please specify if you have a logistics partner.");
        if (logisticsPartner === "yes" && !logisticsPartnerName) return toast.error("Please provide the logistics partner name.");
        if (!returnHandling) return toast.error("Please specify if you need return handling.");
        if (!timeline) return toast.error("Please provide your storage timeline.");
        if (!boxDimensions.length || !boxDimensions.width || !boxDimensions.height) return toast.error("Please provide complete box dimensions.");
        if (!avgWeight) return toast.error("Please provide average weight per box.");
        if (!numProductsPerBox) return toast.error("Please provide number of products per box.");

        setIsLoading(true);
        try {
            await onNext({
                exportingToUS,
                productCategory,
                quantity: quantity?.includes("Other") ? `Other: ${otherQuantity}` : quantity,
                dimensions: dimensions?.includes("Carton dimensions") ? `Carton: ${cartonDimensions}` : dimensions,
                frequency,
                approxOrders,
                shipmentWeight,
                logisticsPartner,
                logisticsPartnerName,
                returnHandling,
                timeline,
                boxLength: boxDimensions.length,
                boxWidth: boxDimensions.width,
                boxHeight: boxDimensions.height,
                avgWeight,
                numProductsPerBox
            });
        } catch (error) {
            console.error("Error saving global plan details:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

            {/* Content Container (Modal) */}
            <div className="w-full max-w-[1256px] bg-white rounded-[20px] shadow-2xl overflow-hidden relative p-8 md:p-12 z-10 animate-in fade-in zoom-in duration-300">
                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="absolute left-8 top-8 p-2 rounded-full group hover:bg-slate-50 transition-colors"
                >
                    <ChevronLeft className="w-8 h-8 text-slate-900" />
                </button>

                {/* Progress Bar */}
                <ProgressBar steps={steps} currentStepIndex={2} />

                {/* Content */}
                <div className="flex flex-col items-center w-full max-w-[900px] mx-auto px-2 pb-4 overflow-y-auto max-h-[716px] hide-scrollbar">
                    <div className="text-center mb-8">
                        <h1 className="text-[40px] font-[700] text-[#1A202C] mb-2">Global Plan</h1>
                        <p className="text-[#4A5568] text-[20px]">Warehousing Intake Form</p>
                    </div>

                    <div className="w-full space-y-6">
                        {/* Question 1 */}
                        <div className="space-y-4">
                            <h3 className="text-[18px] font-semibold text-[#1A202C]">Are you currently exporting to the United States?</h3>
                            <div className="flex gap-8">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${exportingToUS === "yes" ? "bg-[#193D66] border-[#193D66]" : "border-slate-300 bg-white"}`}>
                                        {exportingToUS === "yes" && <Check className="w-4 h-4 text-white" strokeWidth={4} />}
                                    </div>
                                    <input type="radio" className="hidden" name="export" value="yes" onChange={() => setExportingToUS("yes")} />
                                    <span className="text-slate-600">Yes</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${exportingToUS === "no" ? "bg-[#193D66] border-[#193D66]" : "border-slate-300 bg-white"}`}>
                                        {exportingToUS === "no" && <Check className="w-4 h-4 text-white" strokeWidth={4} />}
                                    </div>
                                    <input type="radio" className="hidden" name="export" value="no" onChange={() => setExportingToUS("no")} />
                                    <span className="text-slate-600">No</span>
                                </label>
                            </div>
                        </div>

                        {/* Question 2 */}
                        <div className="space-y-4">
                            <h3 className="text-[18px] font-semibold text-[#1A202C]">What is your product?</h3>
                            <div className="relative">
                                <select 
                                    className="w-full p-4 pr-12 rounded-[32px] border-1 border-slate-200 bg-[#193D66]/4 appearance-none focus:outline-none focus:ring-2 focus:ring-[#193D66]/20 transition-all text-slate-600"
                                    value={productCategory}
                                    onChange={(e) => setProductCategory(e.target.value)}
                                >
                                    <option value="" disabled>Please specify</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Apparel">Apparel</option>
                                    <option value="Other">Other</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                            </div>
                        </div>

                        {/* Question 3 */}
                        <div className="space-y-4">
                            <h3 className="text-[18px] font-semibold text-[#1A202C]">What is the quantity that you export at one time?</h3>
                            <div className="space-y-3">
                                {[
                                    "Less than 100 units",
                                    "100 – 500 units",
                                    "500 – 1,000 units",
                                    "More than 1,000 units",
                                    "Other (please specify):"
                                ].map((option) => (
                                    <label key={option} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${quantity === option ? "bg-[#193D66] border-[#193D66]" : "border-slate-300 bg-white"}`}>
                                            {quantity === option && <Check className="w-4 h-4 text-white" strokeWidth={4} />}
                                        </div>
                                        <input type="radio" className="hidden" name="quantity" value={option} onChange={() => setQuantity(option)} />
                                        <span className="text-slate-600 flex items-center gap-2">
                                            {option}
                                            {option.includes("Other") && (
                                                <input 
                                                    type="text" 
                                                    value={otherQuantity}
                                                    onChange={(e) => setOtherQuantity(e.target.value)}
                                                    placeholder="Specify here"
                                                    className="border-b border-slate-300 focus:outline-none focus:border-[#193D66] bg-transparent w-32 px-1 text-sm" 
                                                />
                                            )}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Question 4 */}
                        <div className="space-y-4">
                            <h3 className="text-[18px] font-semibold text-[#1A202C]">What are the dimensions of your shipment that will be stored in the US warehouse?</h3>
                            <div className="space-y-3">
                                {[
                                    "Carton dimensions (L x W x H):",
                                    "Palletised shipment",
                                    "Non-palletised shipment",
                                    "Not sure / Need assistance"
                                ].map((option) => (
                                    <label key={option} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${dimensions === option ? "bg-[#193D66] border-[#193D66]" : "border-slate-300 bg-white"}`}>
                                            {dimensions === option && <Check className="w-4 h-4 text-white" strokeWidth={4} />}
                                        </div>
                                        <input type="radio" className="hidden" name="dimensions" value={option} onChange={() => setDimensions(option)} />
                                        <span className="text-slate-600 flex items-center gap-2">
                                            {option}
                                            {option.includes("Carton dimensions") && (
                                                <input 
                                                    type="text" 
                                                    value={cartonDimensions}
                                                    onChange={(e) => setCartonDimensions(e.target.value)}
                                                    placeholder="L x W x H"
                                                    className="border-b border-slate-300 focus:outline-none focus:border-[#193D66] bg-transparent w-32 px-1 text-sm" 
                                                />
                                            )}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Question 5 */}
                        <div className="space-y-4">
                            <h3 className="text-[18px] font-semibold text-[#1A202C]">What is the frequency of your orders?</h3>
                            <div className="space-y-3">
                                {[
                                    "Daily",
                                    "Weekly",
                                    "Bi-weekly",
                                    "Monthly",
                                    "Seasonal/irregular"
                                ].map((option) => (
                                    <label key={option} className="flex  items-center gap-3 cursor-pointer group">
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${frequency === option ? "bg-[#193D66] border-[#193D66]" : "border-slate-300 bg-white"}`}>
                                            {frequency === option && <Check className="w-4 h-4 text-white" strokeWidth={4} />}
                                        </div>
                                        <input type="radio" className="hidden" name="frequency" value={option} onChange={() => setFrequency(option)} />
                                        <span className="text-slate-600">{option}</span>
                                    </label>
                                ))}
                            </div>
                            <div className="mt-4">
                                <input
                                    type="text"
                                    placeholder="Approx. number of orders per period"
                                    value={approxOrders}
                                    onChange={(e) => setApproxOrders(e.target.value)}
                                    className="w-full p-4 rounded-[32px] border border-slate-200 bg-[#193D66]/4 focus:outline-none focus:ring-2 focus:ring-[#193D66]/20 transition-all text-slate-600 placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        {/* Question 6: Shipment Weight */}
                        <div className="space-y-4">
                            <h3 className="text-[18px] font-semibold text-[#1A202C]">What is the approximate weight of your shipment?</h3>
                            <div className="space-y-3">
                                {[
                                    "Less than 50 kg (110.23 pounds)",
                                    "50 – 200 kg (110.23 Pounds to 440.92 pounds)",
                                    "200 – 500 kg",
                                    "More than 500 kg",
                                    "Not sure / To be confirmed"
                                ].map((option) => (
                                    <label key={option} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${shipmentWeight === option ? "bg-[#193D66] border-[#193D66]" : "border-slate-300 bg-white"}`}>
                                            {shipmentWeight === option && <Check className="w-4 h-4 text-white" strokeWidth={4} />}
                                        </div>
                                        <input type="radio" className="hidden" name="shipmentWeight" value={option} onChange={() => setShipmentWeight(option)} />
                                        <span className="text-slate-600">{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Question 7: Logistics Partner */}
                        <div className="space-y-4">
                            <h3 className="text-[18px] font-semibold text-[#1A202C]">Do you currently have a Logistics Partner? If yes, who?</h3>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${logisticsPartner === "no" ? "bg-[#193D66] border-[#193D66]" : "border-slate-300 bg-white"}`}>
                                        {logisticsPartner === "no" && <Check className="w-4 h-4 text-white" strokeWidth={4} />}
                                    </div>
                                    <input type="radio" className="hidden" name="logistics" value="no" onChange={() => setLogisticsPartner("no")} />
                                    <span className="text-slate-600">No</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${logisticsPartner === "yes" ? "bg-[#193D66] border-[#193D66]" : "border-slate-300 bg-white"}`}>
                                        {logisticsPartner === "yes" && <Check className="w-4 h-4 text-white" strokeWidth={4} />}
                                    </div>
                                    <input type="radio" className="hidden" name="logistics" value="yes" onChange={() => setLogisticsPartner("yes")} />
                                    <span className="text-slate-600 flex items-center gap-2">
                                        Yes, please specify:
                                        <input
                                            type="text"
                                            value={logisticsPartnerName}
                                            onChange={(e) => setLogisticsPartnerName(e.target.value)}
                                            className="ml-2 px-4 py-2 rounded-[32px] border border-slate-200 bg-[#193D66]/4 focus:outline-none focus:ring-2 focus:ring-[#193D66]/20 transition-all text-slate-600 w-48"
                                        />
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Question 8: Return Handling */}
                        <div className="space-y-4">
                            <h3 className="text-[18px] font-semibold text-[#1A202C]">Do you need return handling?</h3>
                            <div className="flex gap-8">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${returnHandling === "no" ? "bg-[#193D66] border-[#193D66]" : "border-slate-300 bg-white"}`}>
                                        {returnHandling === "no" && <Check className="w-4 h-4 text-white" strokeWidth={4} />}
                                    </div>
                                    <input type="radio" className="hidden" name="return" value="no" onChange={() => setReturnHandling("no")} />
                                    <span className="text-slate-600">No</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${returnHandling === "yes" ? "bg-[#193D66] border-[#193D66]" : "border-slate-300 bg-white"}`}>
                                        {returnHandling === "yes" && <Check className="w-4 h-4 text-white" strokeWidth={4} />}
                                    </div>
                                    <input type="radio" className="hidden" name="return" value="yes" onChange={() => setReturnHandling("yes")} />
                                    <span className="text-slate-600">Yes</span>
                                </label>
                            </div>
                        </div>

                        {/* Question 9: Timeline */}
                        <div className="space-y-4">
                            <h3 className="text-[18px] font-semibold text-[#1A202C]">What is your timeline for storing your products in our warehouse?</h3>
                            <div>
                                <input
                                    type="text"
                                    placeholder="When do you plan to start storing your products"
                                    value={timeline}
                                    onChange={(e) => setTimeline(e.target.value)}
                                    className="w-full p-4 rounded-[32px] border border-slate-200 bg-[#193D66]/4 focus:outline-none focus:ring-2 focus:ring-[#193D66]/20 transition-all text-slate-600 placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        {/* Question 10: Box Dimensions */}
                        <div className="space-y-4">
                            <h3 className="text-[18px] font-semibold text-[#1A202C]">Box Dimensions (in cm)</h3>
                            <div className="flex items-center gap-4">
                                <input
                                    type="text"
                                    placeholder="Length"
                                    value={boxDimensions.length}
                                    onChange={(e) => setBoxDimensions({ ...boxDimensions, length: e.target.value })}
                                    className="flex-1 p-4 rounded-[32px] border border-slate-200 bg-[#193D66]/4 focus:outline-none focus:ring-2 focus:ring-[#193D66]/20 transition-all text-slate-600 placeholder:text-slate-400"
                                />
                                <span className="text-slate-400 text-xl">×</span>
                                <input
                                    type="text"
                                    placeholder="Width"
                                    value={boxDimensions.width}
                                    onChange={(e) => setBoxDimensions({ ...boxDimensions, width: e.target.value })}
                                    className="flex-1 p-4 rounded-[32px] border border-slate-200 bg-[#193D66]/4 focus:outline-none focus:ring-2 focus:ring-[#193D66]/20 transition-all text-slate-600 placeholder:text-slate-400"
                                />
                                <span className="text-slate-400 text-xl">×</span>
                                <input
                                    type="text"
                                    placeholder="Height"
                                    value={boxDimensions.height}
                                    onChange={(e) => setBoxDimensions({ ...boxDimensions, height: e.target.value })}
                                    className="flex-1 p-4 rounded-[32px] border border-slate-200 bg-[#193D66]/4 focus:outline-none focus:ring-2 focus:ring-[#193D66]/20 transition-all text-slate-600 placeholder:text-slate-400"
                                />
                                <span className="text-slate-400 font-medium whitespace-nowrap">cm</span>
                            </div>
                        </div>

                        {/* Question 11: Average Weight */}
                        <div className="space-y-4">
                            <h3 className="text-[18px] font-semibold text-[#1A202C]">Average Weight per Box / Carton</h3>
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    placeholder=""
                                    value={avgWeight}
                                    onChange={(e) => setAvgWeight(e.target.value)}
                                    className="w-full p-4 rounded-[32px] border border-slate-200 bg-[#193D66]/4 focus:outline-none focus:ring-2 focus:ring-[#193D66]/20 transition-all text-slate-600"
                                />
                                <span className="text-slate-400 font-medium whitespace-nowrap">kg</span>
                            </div>
                        </div>

                        {/* Question 12: Number of Products */}
                        <div className="space-y-4">
                            <h3 className="text-[18px] font-semibold text-[#1A202C]">Number of Products per Box / Carton</h3>
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    placeholder=""
                                    value={numProductsPerBox}
                                    onChange={(e) => setNumProductsPerBox(e.target.value)}
                                    className="w-full p-4 rounded-[32px] border border-slate-200 bg-[#193D66]/4 focus:outline-none focus:ring-2 focus:ring-[#193D66]/20 transition-all text-slate-600"
                                />
                                <span className="text-slate-400 font-medium whitespace-nowrap">units per carton</span>
                            </div>
                        </div>
                    </div>

                    {/* Continue Button */}
                    <div className="w-full pt-12 pb-4">
                        <button
                            onClick={handleContinue}
                            disabled={isLoading}
                            className={`w-[480px] mx-auto py-4 bg-[#3B87FA] text-white cursor-pointer rounded-full font-bold text-[18px] hover:bg-[#0266FF] transition-all transform active:scale-[0.98] shadow-lg shadow-blue-900/20 flex items-center justify-center ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                "Continue"
                            )}
                        </button>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default GlobalPlan;
