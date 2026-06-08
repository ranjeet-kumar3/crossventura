"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import WhoIsThisFor from "./steps/WhoIsThisFor";
import YourDetails from "./steps/YourDetails";
import Personal from "./steps/manage/Personal";
import Category from "./steps/manage/Category";
import SelectPlan from "./steps/SelectPlan";
import StarterPlan from "./steps/plans/StarterPlan";
import GlobalPlan from "./steps/plans/GlobalPlan";
import PremiumPlan from "./steps/plans/PremiumPlan";
import BusinessDetails from "./steps/BusinessDetails";
import BusinessInfo from "./steps/manage/businessInfo";
import Payment from "./steps/Payment";
import Confirmation from "./steps/Confirmation";
import { useSession } from "next-auth/react";
import Kyc from "./steps/Kyc";
import BookConsultation from "./steps/BookConsultation";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function OnboardingContent() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Record<string, unknown>>({});
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [user, setUser] = useState<any>(null);

    // Handle URL parameters for direct step navigation
    useEffect(() => {
        const stepParam = searchParams.get('step');
        const flowParam = searchParams.get('flow');

        if (stepParam) {
            const stepNum = parseInt(stepParam);
            if (!isNaN(stepNum)) setStep(stepNum);
        }
        if (flowParam) {
            setFormData(prev => ({ ...prev, whoIsThisFor: flowParam }));
        }
    }, [searchParams]);

    useEffect(() => {
        const checkAuth = async () => {
            // First check NextAuth status
            if (status === "loading") return;

            if (status === "authenticated") {
                setIsAuthenticated(true);
                return;
            }

            // If not NextAuth, check manual token
            try {
                const res = await fetch('/api/me');
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                    setIsAuthenticated(true);
                } else if (status === "unauthenticated") {
                    // Only redirect if both are missing
                    router.push('/signup?redirect=/onboarding');
                }
            } catch (error) {
                if (status === "unauthenticated") {
                    router.push('/signup?redirect=/onboarding');
                }
            }
        };
        checkAuth();
    }, [router, status]);

    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#193D66]/20 border-t-[#193D66] rounded-full animate-spin" />
                    <p className="text-slate-600 font-medium">Checking authentication...</p>
                </div>
            </div>
        );
    }

    const handleNext = async (data: Record<string, any>) => {
        const updatedFormData = { ...formData, ...data };
        setFormData(updatedFormData);

        // Save journey type (category) to database when step 1 is completed
        if (step === 1) {
            const journeyType = data.whoIsThisFor === "start"
                ? "start your new business"
                : "manage your exisitng business";

            try {
                await fetch('/api/onboarding/category', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ category: journeyType }),
                });
            } catch (error) {
                console.error("Failed to save journey type:", error);
            }
        }

        // Handle flow switch from Manage to Start
        if (step === 2 && formData.whoIsThisFor === "manage" && data.whoIsThisFor === "start") {
            // Stay on step 2 but the component will switch to YourDetails
            return;
        }

        // Save data to database if at step 4 (Plan details)
        if (step === 4 && formData.plan) {
            try {
                const planType = formData.plan; // Current plan selected in Step 3
                const apiUrl = `/api/onboarding/plans/${planType}`;

                const response = await fetch(apiUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    console.error(`Failed to save ${planType} plan data`);
                }
            } catch (error) {
                console.error("Error saving plan data:", error);
            }

            // Custom step transitions
            const isPremiumPlan = formData.plan === "premium";
            const isGlobalPlan = formData.plan === "global";
            const hasPhysicalAddress = (updatedFormData.addOnServices as string[] || []).includes("physical-address");
            const needsConsultation = updatedFormData.bookConsultation || (isPremiumPlan && hasPhysicalAddress);

            if (needsConsultation) {
                // If we are already on the consultation screen (step 4 version), go to business details
                if (!formData.plan && formData.bookConsultation) {
                    setStep(6);
                } else if (isGlobalPlan && updatedFormData.bookConsultation && step === 4) {
                    // If we just finished Global Plan form and already did consultation, go to Business Details
                    setStep(6);
                } else {
                    setStep(5); // Go to Book Consultation (normal flow)
                }
            } else {
                setStep(6); // Skip to Business Details
            }




        } else if (step === 6) {
            // Save Business Details
            try {
                const response = await fetch('/api/onboarding/business-details', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
                if (!response.ok) {
                    console.error("Failed to save business details");
                }
            } catch (error) {
                console.error("Error saving business details:", error);
            }
            setStep((prev) => prev + 1);
        } else if (step === 9) {
            // Save KYC Details
            try {
                await fetch('/api/onboarding/kyc', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
            } catch (error) {
                console.error("Error saving KYC details:", error);
            }
            // After KYC (final step)
            router.push("/");
        } else if (step === 5 || (step === 4 && !formData.plan && formData.bookConsultation)) {
            // Consultation is already saved in BookConsultation.tsx, so we skip the redundant fetch
            // If it was Global Plan + Consultation, now go to the Global Plan form (Step 4)
            if (formData.plan === "global" && formData.bookConsultation) {
                setStep(4);
            } else {
                setStep(6);
            }

        } else if (step === 3) {
            // Special case: Global Plan + Consultation should do Consultation FIRST
            const isGlobalPlan = updatedFormData.plan === "global";
            const isManageFlow = updatedFormData.whoIsThisFor === "manage";

            if (isManageFlow) {
                try {
                    await fetch('/api/onboarding/category', {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data),
                    });
                } catch (error) {
                    console.error("Failed to save manage category data:", error);
                }
            }

            if (isGlobalPlan && updatedFormData.bookConsultation) {
                setStep(5); // Go to Consultation first
            } else if (isManageFlow && isGlobalPlan) {
                setStep(4); // Go to Global Plan page for warehousing
            } else if (isManageFlow && !updatedFormData.bookConsultation) {
                setStep(6); // Skip Plan and Consultation steps for other manage categories
            } else {
                setStep((prev) => prev + 1);
            }
        } else {
            setStep((prev) => prev + 1);
        }


    };

    const handleBack = () => {
        const isManageFlow = formData.whoIsThisFor === "manage";

        if (step === 6) {
            const isPremiumPlan = formData.plan === "premium";
            const hasPhysicalAddress = (formData.addOnServices as string[] || []).includes("physical-address");
            const needsConsultation = formData.bookConsultation || (isPremiumPlan && hasPhysicalAddress);

            if (!needsConsultation) {
                if (isManageFlow) {
                    setStep(3); // Go back to Category step for Manage flow
                } else {
                    setStep(4); // Skip Step 5 and go back to Plan Details for Start flow
                }
                return;
            }
        }

        // Special case: Back from Consultation in Manage flow
        if (step === 5 && isManageFlow) {
            setStep(3); // Go back to Category
            return;
        }

        setStep((prev) => Math.max(1, prev - 1));
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            {step === 1 && (
                <WhoIsThisFor
                    onNext={handleNext}
                    onBack={() => router.push("/")}
                />
            )}
            {step === 2 && formData.whoIsThisFor === "start" && (
                <YourDetails
                    onNext={handleNext}
                    onBack={handleBack}
                    user={user}
                />
            )}
            {step === 2 && formData.whoIsThisFor === "manage" && (
                <Personal
                    onNext={handleNext}
                    onBack={handleBack}
                    user={user}
                />
            )}
            {step === 3 && formData.whoIsThisFor === "manage" && (
                <Category
                    onNext={handleNext}
                    onBack={handleBack}
                />
            )}
            {step === 3 && formData.whoIsThisFor === "start" && (
                <SelectPlan
                    onNext={handleNext}
                    onBack={handleBack}
                />
            )}
            {step === 4 && formData.plan === "starter" && (
                <StarterPlan
                    onNext={handleNext}
                    onBack={handleBack}
                />
            )}
            {step === 4 && formData.plan === "global" && (
                <GlobalPlan
                    onNext={handleNext}
                    onBack={handleBack}
                />
            )}
            {step === 4 && formData.plan === "premium" && (
                <PremiumPlan
                    onNext={handleNext}
                    onBack={handleBack}
                />
            )}
            {step === 4 && !formData.plan && !!formData.bookConsultation && (
                <BookConsultation
                    onNext={handleNext}
                    onBack={handleBack}
                />
            )}

            {/* Dynamic Step 5: Book Consultation if triggered from Plan features */}
            {step === 5 && (
                <BookConsultation
                    onNext={handleNext}
                    onBack={handleBack}
                />
            )}

            {/* Step 6: Business Details / Business Info */}
            {step === 6 && formData.whoIsThisFor !== "manage" && (
                <BusinessDetails
                    onNext={handleNext}
                    onBack={handleBack}
                    initialBusinessName={formData.businessName as string}
                    initialCountry={formData.country as string}
                />
            )}
            {step === 6 && formData.whoIsThisFor === "manage" && (
                <BusinessInfo
                    onNext={handleNext}
                    onBack={handleBack}
                    formData={formData}
                />
            )}

            {/* Step 7: Payment */}
            {step === 7 && (
                <Payment
                    onNext={handleNext}
                    onBack={handleBack}
                    formData={formData}
                />
            )}


            {/* Step 8: Confirmation */}
            {step === 8 && (
                <Confirmation
                    onNext={handleNext}
                    onBack={handleBack}
                />
            )}

            {/* Step 9: KYC */}
            {step === 9 && (
                <Kyc
                    onNext={handleNext}
                    onBack={handleBack}
                    formData={formData}
                />
            )}
        </div>
    );
}

export default function OnboardingPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#193D66]/20 border-t-[#193D66] rounded-full animate-spin" />
                    <p className="text-slate-600 font-medium">Loading onboarding...</p>
                </div>
            </div>
        }>
            <OnboardingContent />
        </Suspense>
    );
}
